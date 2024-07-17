const request = require('request');

function fetchData(query) {
  return new Promise((resolve, reject) => {
    request.get({
      url: 'https://api.calorieninjas.com/v1/nutrition?query=' + query,
      headers: {
        'X-Api-Key': 'C/aE49mYEDE7Jmxz9M7stg==LYGdHXVy9RNDXTlD'
      },
    }, (error, response, body) => {
      if (error) {
        reject('Request failed: ' + error);
      } else if (response.statusCode != 200) {
        reject('Error: ' + response.statusCode + ', ' + body.toString('utf8'));
      } else {
        resolve(body);
      }
    });
  });
}

// Usage:
fetchData('rice')
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
