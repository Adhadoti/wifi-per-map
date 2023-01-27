import './App.css';
import { useState, useEffect } from 'react'
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

export default App;
