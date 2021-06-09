const axios = require('axios');
const fs    =  require('fs');

const url = "http://localhost:2000/adapter";

/*
* function: Login Request
*/
axios
.post(url, {
    packet: '78 78 11 01 03 51 60 80 80 77 92 88 22 03 32 01 01 AA 53 36 0D 0A'
})
.then(async function(res) {

    if(res.status === 200) {
        /*
        * function: Heartbeat and GPS on interval basis
        */
        setInterval(await regularUpdates, 10000);
    } else {
        console.log("Server Error");
    }

})
.catch(error => {
    console.error(error)
});


/*
* function: Heartbeat and GPS data upload on interval basis
*/
function regularUpdates() {

    /*
    * Request: Heartbeat
    */
    const heartbeatRequest = axios.post(url, {
        packet: '78 78 0B 23 C0 01 22 04 00 01 00 08 18 72 0D 0A'
    });

    /*
    * Request: GPS
    */
    const gpsRequest = axios.post(url, {
        packet: '78 78 22 22 0F 0C 1D 02 33 05 C9 02 7A C8 18 0C 46 58 60 00 14 00 01 CC 00 28 7D 00 1F 71 00 00 01 00 08 20 86 0D 0A'
    });

    axios.all([heartbeatRequest, gpsRequest]).then(axios.spread((...responses) => {
        const heartbeatResponse = responses[0]
        const gpsResponse = responses[1]

        console.log(heartbeatResponse.data);
        console.log(gpsResponse.data);

        fs.readFile("./gps.json", "utf8", (err, jsonString) => {
            if (err) {
              console.log("Error reading file from disk:", err);
              return;
            }
            try {
                var gpsObj = JSON.parse(jsonString);
                gpsObj.push(gpsResponse.data);

                fs.writeFile("./gps.json", JSON.stringify(gpsObj), (err) => {
                    // Error checking
                    if (err) throw err;
                    console.log("GPS Location data added");
                });

            } catch (err) {
                console.log("Error parsing JSON string:", err);
            }
        });
    
    })).catch(errors => {
        console.log("Server Error");
    })

}