import React, { useState } from "react";
import ReactMapGL, { Marker, Popup, GeolocateControl } from "react-map-gl";
import * as pointData from "./data/sample_data.json";

import Checkbox from "./checkbox.js";

//Eduroam validation
import './App.css';

import axios from 'axios'

var ip_1 = 0;
var ip_2 = 0;
var ip_3 = 0;
var ip_4 = 0;

function App() {
    //creating IP state
    const [ip, setIP] = useState('');

    //creating function to load ip address from the API
    const getData = async () => {
        const res = await axios.get('https://geolocation-db.com/json/')
        console.log(res.data);
        setIP(res.data.IPv4)
    }

    useEffect(() => {
        //passing getData method to the lifecycle method
        getData()

    }, [])

    const ip_address = ip.split(".")
    ip_1 = parseInt(ip_address, 10);
    ip_2 = parseInt(ip_address[1], 10);
    ip_3 = parseInt(ip_address[2], 10);
    ip_4 = parseInt(ip_address[3], 10);


    if (ip_1 === 163 && ip_2 === 118 && ip_3 === 184 && (ip_4 >= 1 && ip_4 <= 254)) { //75.34.157.166
        return (
            <div className="App">
                <h2>Your IP Address is</h2>
                <h4>{ip}</h4>
            </div>
        );
    } else {
        return (
            <div className="App">
                <h2>Your IP Address is</h2>
                <h4>INVALID</h4>
            </div>
        );
    }

}

//Location validation

const App1 = () => {
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [status, setStatus] = useState(null);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setStatus('Geolocation is not supported by your browser');
        } else {
            setStatus('Locating...');
            navigator.geolocation.getCurrentPosition((position) => {
                setStatus(null);
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
            }, () => {
                setStatus('Unable to retrieve your location');
            });
        }

    }
    return (
        <div className="App1">
            <button onClick={getLocation}>Get Location</button>
            <h1>Coordinates</h1>
            <p>{status}</p>

            {lat && <p>Latitude: {lat}</p>}
            {lng && <p>Longitude: {lng}</p>}
        </div>
    );
}

//Speed test
const NetworkSpeed = require('network-speed');  // ES5
const testNetworkSpeed = new NetworkSpeed();

getNetworkDownloadSpeed();

async function getNetworkDownloadSpeed() {
    const baseUrl = 'https://eu.httpbin.org/stream-bytes/500000';
    const fileSizeInBytes = 300000;
    const speed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes);
    console.log("Upload");
    console.log(speed);
}

getNetworkUploadSpeed();

async function getNetworkUploadSpeed() {
    const options = {
        hostname: 'www.google.com',
        port: 80,
        path: '/catchers/544b09b45991d0200000289',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const fileSizeInBytes = 3000000
    const speed = await testNetworkSpeed.checkUploadSpeed(options, fileSizeInBytes);
    console.log("Download");
    console.log(speed);
}



let user_up = 50;
let user_down = 30;
let user_ping = 10;



export default function App2() {
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
                display: "block", width: 1500, paddingLeft: 10
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
                onViewportChange={viewport => {
                    setViewport(viewport)
                }}
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
                            latitude={datapoint.geometry.coordinates[0]}
                            longitude={datapoint.geometry.coordinates[1]}
                            offsetLeft={-40}

                        >
                            <button class="marker-btn" onClick={(e) => {
                                e.preventDefault();
                                setselectedPoint(datapoint);
                            }}>
                                <img src={datapoint.properties.UPLOAD === user_up ? "icons/upload_okay.svg" : datapoint.properties.UPLOAD < user_up ? "icons/upload_bad.svg" : "icons/upload_good.svg"} alt="upload Icon" />
                            </button>
                        </Marker>
                        : null
                ))}

                {pointData.features.map(datapoint => (
                    showDownload ?
                        <Marker
                            key={datapoint.properties.POINT_ID}
                            latitude={datapoint.geometry.coordinates[0]}
                            longitude={datapoint.geometry.coordinates[1]}
                            offsetLeft={-20}

                        >
                            <button class="marker-btn" onClick={(e) => {
                                e.preventDefault();
                                setselectedPoint(datapoint);
                            }}>
                                <img src={datapoint.properties.DOWNLOAD === user_down ? "icons/download_okay.svg" : datapoint.properties.DOWNLOAD < user_down ? "icons/download_bad.svg" : "icons/download_good.svg"} alt="download Icon" />
                            </button>
                        </Marker>
                        : null
                ))}

                {pointData.features.map(datapoint => (
                    showPing ?
                        <Marker
                            key={datapoint.properties.POINT_ID}
                            latitude={datapoint.geometry.coordinates[0]}
                            longitude={datapoint.geometry.coordinates[1]}
                        >
                            <button class="marker-btn" onClick={(e) => {
                                e.preventDefault();
                                setselectedPoint(datapoint);
                            }}>
                                <img src={datapoint.properties.PING === user_ping ? "icons/ping_okay.svg" : datapoint.properties.PING > user_ping ? "icons/ping_bad.svg" : "icons/ping_good.svg"} alt="ping Icon" />
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

                ) : null}


                <GeolocateControl
                    style={geolocateStyle}
                    positionOptions={{ enableHighAccuracy: true }}
                    trackUserLocation={true}
                />

            </ReactMapGL>
        </div>
    );
}