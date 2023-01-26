import React, { useState } from "react";
import ReactMapGL, { Marker, Popup, GeolocateControl } from "react-map-gl";
import * as pointData from "./data/sample_data.json";

import Checkbox from "./checkbox.js";

let user_up = 50;
let user_down = 30;
let user_ping = 10;



export default function App() {
  const [viewport, setViewport] = useState({
    latitude: 28.063570,
    longitude: -80.623040,
    width: "100vw",
    height: "100vh",
    zoom: 16
  });

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
      display: "block", width:1500, paddingLeft:10
      }}>
      <h3>Current metrics</h3>
      <p>Upload: {user_up}</p>
      <p>Download: {user_down}</p>
      <p>Ping: {user_ping}</p>
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
            onChange={(id) => setShowUpload(!showUpload)}
          />
          <Checkbox 
            id="download" 
            label="Download" 
            checked={showDownload} 
            onChange={(id) => setShowDownload(!showDownload)}
          />
          <Checkbox 
            id="ping" 
            label="Ping" 
            checked={showPing} 
            onChange={(id) => setShowPing(!showPing)}
          />
        </div>


        {pointData.features.map(datapoint => (
  showUpload ? 
    <Marker 
      key={datapoint.properties.POINT_ID}
      latitude ={datapoint.geometry.coordinates[0]}
      longitude ={datapoint.geometry.coordinates[1]}
      offsetLeft={-40}

    >
      <button class = "marker-btn" onClick={(e) =>{
                      e.preventDefault();
                      setselectedPoint(datapoint);
                    }}>
                      <img src={datapoint.properties.UPLOAD === user_up ?  "icons/upload_okay.svg" : datapoint.properties.UPLOAD < user_up ? "icons/upload_bad.svg" : "icons/upload_good.svg"} alt = "upload Icon"/>
      </button>
    </Marker>
  : null
))}

{pointData.features.map(datapoint => (
  showDownload ? 
    <Marker 
      key={datapoint.properties.POINT_ID}
      latitude ={datapoint.geometry.coordinates[0]}
      longitude ={datapoint.geometry.coordinates[1]}
      offsetLeft={-20}

    >
      <button class = "marker-btn" onClick={(e) =>{
                      e.preventDefault();
                      setselectedPoint(datapoint);
                    }}>
                      <img src={datapoint.properties.DOWNLOAD === user_down ?  "icons/download_okay.svg" : datapoint.properties.DOWNLOAD < user_down ? "icons/download_bad.svg" : "icons/download_good.svg"} alt = "download Icon"/>
      </button>
    </Marker>
  : null
))}

{pointData.features.map(datapoint => (
  showPing ? 
    <Marker 
      key={datapoint.properties.POINT_ID}
      latitude ={datapoint.geometry.coordinates[0]}
      longitude ={datapoint.geometry.coordinates[1]}
    >
      <button class = "marker-btn" onClick={(e) =>{
                      e.preventDefault();
                      setselectedPoint(datapoint);
                    }}>
                      <img src={datapoint.properties.PING === user_ping ?  "icons/ping_okay.svg" : datapoint.properties.PING > user_ping ? "icons/ping_bad.svg" : "icons/ping_good.svg"} alt = "ping Icon"/>
      </button>
    </Marker>
  : null
))}



        
        {selectedPoint ? (
          <Popup 
            latitude={selectedPoint.geometry.coordinates[0]} 
            longitude={selectedPoint.geometry.coordinates[1]}
            onClose={() => {
              setselectedPoint(null);
            }}
          >
            <div>
              <h2>{selectedPoint.properties.name}</h2>
              <p>{"UPLOAD: "}{selectedPoint.properties.UPLOAD}</p>
              <p>{"DOWNLOAD: "}{selectedPoint.properties.DOWNLOAD}</p>
              <p>{"PING: "}{selectedPoint.properties.PING}</p>

            </div>
          </Popup>

        ): null}


        <GeolocateControl
          style={geolocateStyle}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />
      
      </ReactMapGL>
    </div>
  );
}