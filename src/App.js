import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup, GeolocateControl } from "react-map-gl";
import axios from "axios";
import Checkbox from "./checkbox.js";
import { resolve } from "path";
import pic from './pic2.jpeg';

let user_up = 90;
let user_down = 75;
let user_ping = 5;
let calc=0;
let size=19572090 *8;
let speed_kpbs=0;
const speed_count=100
let test_result= []
let sum=0

var currentTime = new Date(Date.now());
var time = currentTime.toLocaleString();


export default function App() {

  const [viewport, setViewport] = useState({
    latitude: 28.063570,
    longitude: -80.623040,
    width: "100vw",
    height: "80vh",
    zoom: 16
  });

  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [status, setStatus] = useState(null);

  const [pointData, setPointData] = useState([]);

  

  const getData = () => {
    axios.get("http://localhost:3000/")
      .then(response => {
        setPointData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    getLocation();
  }, []);
  const download_speed= () =>{
      return new Promise((resolve,reject)=>{
      let image= new Image()
      image.src=pic
      let starTtime=Date.now()
      console.log("start time",starTtime)
      
      image.onload=function(){
        let endTime= Date.now()
        console.log("end time",endTime)
        calc=endTime-starTtime
        //console.log(calc)
        resolve(calc)
      }
      image.onerror = function(err){
        reject(err)
      }
    })
  }
  async function getloadspeed(){
    let loadtime = await download_speed()
    console.log("loadtime",loadtime)
    if(loadtime <1) loadtime =1
    console.log("size",size)
    let speed_bps = size/loadtime
    speed_kpbs=speed_bps/(1000)
    let mbps=speed_kpbs/1000
    //console.log(speed_kpbs)
    return mbps
  }
  //getloadspeed()

  async function final_download_speed(){
    for (let i=0;i<speed_count;i++){
      let speed= await getloadspeed()
      test_result.push(speed)
    }
    sum=test_result.reduce((a,b) => a+b,0)
     sum=(sum/test_result.length)
     //console.log(sum)
  }
  final_download_speed()
  const postData = (lat, lng) => {
    const newData = {
      time: time,
      upload: 90,
      download: 75,
      ping: 5,
      latitude: lat,
      longitude: lng
    }
    axios.post("http://localhost:3000/", newData)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }
  
  const getLocation = async () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser');
    } else {
      setStatus('Locating...');
      navigator.geolocation.getCurrentPosition(async (position) => {
        setStatus(null);
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        await postData(position.coords.latitude, position.coords.longitude);
        setTimeout(getData, 1000);
;
      }, () => {
        setStatus('Unable to retrieve your location');
      });
    }
}


  const [selectedPoint, setselectedPoint] = useState(null);

  const [showUpload, setShowUpload] = useState(true);
  const [showDownload, setShowDownload] = useState(true);
  const [showPing, setShowPing] = useState(true);


  const geolocateStyle = {
  position: "absolute",
  top: 0,
  right: 0,
  margin: 10
  };



  return (
    <div>
      <div style={{
  display: "block",
  width: "80%",
  height: "auto",
  backgroundColor: "#f2f2f2",
  padding: "20px",
  fontSize: "20px",
  fontFamily: "Arial, sans-serif",
  textAlign: "center",
  border: "1px solid black",
  margin: "0 auto"}}>

      <h3>Current metrics</h3>
      <p>Upload: {user_up}<br />
      Download: {sum}<br />
      Ping: {user_ping}</p>
      <p>Timestamp: {time} <br />
      Latitude: {status} {lat} <br />
      longitude: {lng}</p>
      </div>
      <ReactMapGL
      
        {...viewport}
        mapboxApiAccessToken={"pk.eyJ1IjoiZHJlc2VuZGVzIiwiYSI6ImNsYWczYnVxdDA5aXEzd21vdmlzY3lmemUifQ.szVCqwXEpk5-FpJFutAFCg"}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onViewportChange={viewport=> {
          setViewport(viewport)}}
      >
        <div className="checkboxes">
          <Checkbox 
            id="upload" 
            label="Upload" 
            checked={showUpload}
            uncheckedImage="icons/upload_unclicked.svg"
            checkedImage="icons/upload_clicked.svg"
            onChange={(id) => setShowUpload(!showUpload)}
          />
          <Checkbox 
            id="download" 
            label="Download" 
            checked={showDownload} 
            uncheckedImage="icons/download_unclicked.svg"
            checkedImage="icons/download_clicked.svg"
            onChange={(id) => setShowDownload(!showDownload)}
          />
          <Checkbox 
            id="ping" 
            label="Ping" 
            checked={showPing} 
            uncheckedImage="icons/ping_unclicked.svg"
            checkedImage="icons/ping_clicked.svg"
            onChange={(id) => setShowPing(!showPing)}
          />
<button onClick={getData} style={{width: '40px', height: '40px',  padding: '5px', marginLeft: '10px', marginTop: '10px'}}>
  <img src="icons/refresh.svg" alt="refresh" style={{width: '100%', height: '100%'}} />
</button>


        </div>


        {pointData.map(datapoint => (
  showUpload ? 
    <Marker 
      key={datapoint.time}
      latitude ={datapoint.latitude}
      longitude ={datapoint.longitude}
      offsetLeft={-40}

    >
      <button class = "marker-btn" onClick={(e) =>{
                      e.preventDefault();
                      setselectedPoint(datapoint);
                    }}>
                      <img src={datapoint.upload === user_up ?  "icons/upload_okay.svg" : datapoint.upload < user_up ? "icons/upload_bad.svg" : "icons/upload_good.svg"} alt = "upload Icon"/>
      </button>
    </Marker>
  : null
))}

{pointData.map(datapoint => (
  showDownload ? 
    <Marker 
    key={datapoint.time}
    latitude ={datapoint.latitude}
    longitude ={datapoint.longitude}
      offsetLeft={-20}

    >
      <button class = "marker-btn" onClick={(e) =>{
                      e.preventDefault();
                      setselectedPoint(datapoint);
                    }}>
                      <img src={datapoint.download === user_down ?  "icons/download_okay.svg" : datapoint.download < user_down ? "icons/download_bad.svg" : "icons/download_good.svg"} alt = "download Icon"/>
      </button>
    </Marker>
  : null
))}

{pointData.map(datapoint => (
  showPing ? 
    <Marker 
      key={datapoint.time}
      latitude ={datapoint.latitude}
      longitude ={datapoint.longitude}
    >
      <button class = "marker-btn" onClick={(e) =>{
                      e.preventDefault();
                      setselectedPoint(datapoint);
                    }}>
                      <img src={datapoint.ping === user_ping ?  "icons/ping_okay.svg" : datapoint.ping > user_ping ? "icons/ping_bad.svg" : "icons/ping_good.svg"} alt = "ping Icon"/>
      </button>
    </Marker>
  : null
))}
        
        {selectedPoint ? (
          <Popup 
            latitude ={selectedPoint.latitude}
            longitude ={selectedPoint.longitude}
            onClose={() => {
              setselectedPoint(null);
            }}
          >
            <div>
              <h2>{selectedPoint.time}</h2>
              <p>{"UPLOAD: "}{selectedPoint.upload}</p>
              <p>{"DOWNLOAD: "}{selectedPoint.download}</p>
              <p>{"PING: "}{selectedPoint.ping}</p>

            </div>
          </Popup>

        ): null}


        <GeolocateControl
          style={geolocateStyle}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserHeading={true}
        />
      {lat && lng && (
        <Marker latitude={lat} longitude={lng}
        offsetLeft={-34}
        offsetTop={-56}
        >
          <img
            src="icons/user.svg"
            alt="User Location"
            style={{ height: 60, width: 60}}
          />

        </Marker>
      )}
      
      </ReactMapGL>
    </div>
  );
}