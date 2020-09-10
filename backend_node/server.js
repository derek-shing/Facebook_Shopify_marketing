const express = require('express')
var request = require('request');
const bodyParser = require('body-parser');
const app = express()

app.use(bodyParser.json());


app.post('/', (req, res) => {
  const bizSdk = require('facebook-nodejs-business-sdk');
  const ServerEvent = bizSdk.ServerEvent;
  const EventRequest = bizSdk.EventRequest;
  const UserData = bizSdk.UserData;
  const CustomData = bizSdk.CustomData;
  const Content = bizSdk.Content;

  const access_token = '';
  const pixel_id = '';
  const api = bizSdk.FacebookAdsApi.init(access_token);

  let current_timestamp = Math.floor(new Date() / 1000);
  var firstName = "Derek"
  var lastName = "Shing"
  var tel = "123456789"
  var email = "mary@example.com"
  var ipAddress = "127.0.0.1"
  var agent = "Marketing"





  const userData = (new UserData())
                  .setEmail(email)
                  .setFbp('fb.1.1558571054389.1098115397')
                  .setFbc('fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890');

  const customData = (new CustomData())
                  .setCurrency('usd')
                  .setValue(123.45);

  const serverEvent = (new ServerEvent())
                  .setEventName('container_Purchases')
                  .setEventTime(current_timestamp)
                  .setUserData(userData)
                  .setCustomData(customData);

  const eventsData = [serverEvent];
  const eventRequest = (new EventRequest(access_token, pixel_id))
                  .setEvents(eventsData);


  eventRequest.execute();






  console.log('Got body:', req.body);
  res.send(req.body);
});

app.get('/', (req, res) => {

  shopifyKey = ""
  shopifypw = ""
  url = "https://"+shopifyKey+":"+shopifypw+"@derekmarketing.myshopify.com/admin/api/2020-07/orders.json"

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)
      //res.send(info)
    }
  })








  'use strict';
  const bizSdk = require('facebook-nodejs-business-sdk');
  const ServerEvent = bizSdk.ServerEvent;
  const EventRequest = bizSdk.EventRequest;
  const UserData = bizSdk.UserData;
  const CustomData = bizSdk.CustomData;
  const Content = bizSdk.Content;

  const access_token = '';
  const pixel_id = '';
  const api = bizSdk.FacebookAdsApi.init(access_token);

  let current_timestamp = Math.floor(new Date() / 1000);
  /*
  Server Event Parameters

  Event Name – call it ‘Purchase’
  Event Time – let it be the real time value
  Event Id – generate this dynamically


  User Data Parameters (please note some of these parameters must be hashed / encrypted)

  First Name (hash) – get from shopify API
  Last Name (hash) – get from Shopify API
  Telephone number (hash) – get from Shopify API
  Email (hash) – get from Shopify API
  Client IP Address (Do not hash) – get from Shopify API
  Client User Agent (Do Not Hash) – get from Shopify API

  */


  var firstName = "Derek"
  var lastName = "Shing"
  var tel = "123456789"
  var email = "mary@example.com"
  var ipAddress = "127.0.0.1"
  var agent = "Marketing"

  var crypto = require('crypto');

  //var firstName = crypto.createHash('sha256').update(firstName).digest('hex');
  //var lastName = crypto.createHash('sha256').update(lastName).digest('hex');
  //var tel = crypto.createHash('sha256').update(tel).digest('hex');
  //var email = crypto.createHash('sha256').update(email).digest('hex');



  const userData = (new UserData())
                  .setEmail(email)
                  .setFbp('fb.1.1558571054389.1098115397')
                  .setFbc('fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890');

  const customData = (new CustomData())
                  .setCurrency('usd')
                  .setValue(123.45);

  const serverEvent = (new ServerEvent())
                  .setEventName('Purchases')
                  .setEventTime(current_timestamp)
                  .setUserData(userData)
                  .setCustomData(customData);

  const eventsData = [serverEvent];
  const eventRequest = (new EventRequest(access_token, pixel_id))
                  .setEvents(eventsData);


  eventRequest.execute();

  res.send('Hello World!!! '+email )


})

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
