var express = require('express');
var app = express();
var request = require('request');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/static'));

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/unauthorized', function(req, res) {
  request('https://api.cloud-elements.com/elements/api-v2/elements/googledrive/oauth/url?apiKey=439748860947-saecsj0o1gnvr3rveckug5do0hjp53f7.apps.googleusercontent.com&apiSecret=BKHH5_kZ7dzEjmd86L4Z8FUZ&callbackUrl=https://232c9f72.ngrok.io/oauthcallback&state=googledrive', function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var info = JSON.parse(body);
      res.writeHead(302, {
        'Location': info.oauthUrl
      });
      res.end();
    } else {
      console.log(body);;
      res.send(503, 'Cannot process OAuth Request');
    }
  });
});

app.get('/oauthcallback', function(req, res) {
  console.log(req.originalUrl);
  var instance = {
    element: {
      key: "googledrive"
    },
    providerData: {
      code: req.query.code
    },
    configuration: {
      "oauth.api.key": "439748860947-saecsj0o1gnvr3rveckug5do0hjp53f7.apps.googleusercontent.com",
      "oauth.api.secret": "BKHH5_kZ7dzEjmd86L4Z8FUZ",
      "oauth.callback.url": "https://232c9f72.ngrok.io/oauthcallback"
    },
    name: "Thinkful"
  }
  request.post(
    {url: 'https://api.cloud-elements.com/elements/api-v2/instances',
    headers: {'Authorization' : 'Organization 7ded9bdd3382aabb7309eebbba91cf38, User DkGdePCO45Txh743GPRefTOfdKIDi47trqkX1HXFQfw='},
    json: instance
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        res.writeHead(302, {
          'Location': '/',
          'set-cookie': 'element=' + body.token
        });
        res.end();
      } else {
        console.log(body);;
        res.send(503, 'Cannot process OAuth Request');
      }
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
