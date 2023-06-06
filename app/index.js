const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const apiEndpoints = [
  'http://api1.com',
  'http://api2.com',
  'http://api3.com',
  'http://api4.com',
  'http://api5.com'
];
let currentApiIndex = 0;

app.use(express.static('public'));

// Enable CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/api', (req, res) => {
  const currentEndpoint = apiEndpoints[currentApiIndex];

  axios.get(currentEndpoint)
    .then(response => {
      console.log(response.data); // Handle the API response here

      currentApiIndex++;
      if (currentApiIndex >= apiEndpoints.length) {
        currentApiIndex = 0;

        // Hide labels when starting over
        res.send({ data: response.data, hideLabels: true });
      } else {
        res.send({ data: response.data, hideLabels: false });
      }
    })
    .catch(error => {
      console.error(error); // Handle API call errors here

      currentApiIndex++;
      if (currentApiIndex >= apiEndpoints.length) {
        currentApiIndex = 0;

        // Hide labels when starting over
        res.status(500).send({ error: 'Error occurred while calling the API', hideLabels: true });
      } else {
        res.status(500).send({ error: 'Error occurred while calling the API', hideLabels: false });
      }
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
