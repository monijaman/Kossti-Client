// fetch-geoip-data.js
const geoip = require('geoip-lite');

// Accessing the geoip object will trigger the data download
console.log('Fetching GeoIP data...');
console.log(geoip.lookup('8.8.8.8')); // This is just a test IP address to trigger data download
