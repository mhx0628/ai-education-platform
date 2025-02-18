import http from 'http';

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/',
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    if (res.statusCode === 200) {
        console.log('Homepage is loading correctly.');
    } else {
        console.log('Homepage is not loading correctly.');
    }
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();