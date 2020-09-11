const express = require('express')
var request = require('request');
const bodyParser = require('body-parser');
const app = express()

const testHeader ={
  "content-length": "6549",
  "content-type": "application/json",
  "x-shopify-topic": "orders/create",
  "x-shopify-shop-domain": "derekmarketing.myshopify.com",
  "x-shopify-order-id": "820982911946154508",
  "x-shopify-test": "true",
  "x-shopify-hmac-sha256": "Kvbryq2XxM6A/jfBPNMRNbpZd/j8oRdjP1sjLfziv8A=",
  "x-shopify-api-version": "2020-07",
  "accept-encoding": "gzip;q=1.0,deflate;q=0.6,identity;q=0.3",
  "accept": "*/*",
  "user-agent": "Ruby"
}

app.use(bodyParser.json());


const admin = require('firebase-admin');
const serviceAccount = require('./marketing-289020-248f2fd671e7.json');
admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

function postToGCP(info){
  //data = getDataFromShopify(info)
  const new_order = db.collection('orders').doc('test');
  new_order.set(info);
}

function postToConversionAPI(data){
  const bizSdk = require('facebook-nodejs-business-sdk');
  const ServerEvent = bizSdk.ServerEvent;
  const EventRequest = bizSdk.EventRequest;
  const UserData = bizSdk.UserData;
  const CustomData = bizSdk.CustomData;
  const Content = bizSdk.Content;

  const access_token = 'EAANMDOEpbiYBACHaWk3BPYD8eZBtGnBUrltjPU5rqZC9BZBBMsmdPsvHo87d7LVSbZAZCfv64PHCeodQIzzi3ZBZClBTvrcw8nD6w77dQPzuZAOkGZCIRz22RO0DS0Ay5727aAZC5K40ln5nJ2rYtZBrO23UMA9jZCZBNcgCpyOdAsuppbZAeNw7hB6uIi';
  const pixel_id = '325781001814671';
  const api = bizSdk.FacebookAdsApi.init(access_token);

  let current_timestamp = Math.floor(new Date() / 1000);
  var firstName = data.UserData.FirstName
  var lastName = data.UserData.LastName
  var tel = data.UserData.tel
  var email = data.UserData.Email
  var ipAddress = data.UserData.IP
  var agent = data.UserData.agent


  var currency = data.customeData.Currency
  var totalPrice = data.customeData.TotalPrice
  var items = data.lineitem

  eventID = data.customeData.orderID


  const userData = (new UserData())
                  .setEmail(email)
                  .setPhone(tel)
                  .setLastName(lastName)
                  .setFirstName(firstName)
                  .setClientIpAddress(ipAddress)
                  .setClientUserAgent(agent)
                  .setFbp('fb.1.1558571054389.1098115397')
                  .setFbc('fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890');

  const customData = (new CustomData())
                  .setCurrency(currency)
                  .setOrderId(eventID)
                  .setContents()
                  .setValue(totalPrice);

  const serverEvent = (new ServerEvent())
                  .setEventName('Purchase_final')
                  .setEventTime(current_timestamp)
                  .setEventId(eventID)
                  .setUserData(userData)
                  .setCustomData(customData);

  const eventsData = [serverEvent];
  const eventRequest = (new EventRequest(access_token, pixel_id))
                  .setEvents(eventsData);


  eventRequest.execute();

}


app.post('/', (req, res) => {


  data = getDataFromShopify(req.body,req.headers)
  postToGCP(data)
  postToConversionAPI(data)
  console.log('Got body:', data);
  res.send(data);
});




app.get('/', (req, res) => {

  shopifyKey = ""
  shopifypw = ""
  url = "https://"+shopifyKey+":"+shopifypw+"@derekmarketing.myshopify.com/admin/api/2020-07/orders.json"
  /*
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)
      //res.send(info)
    }
  })
  */
  orderinfo = null
  data = getDataFromShopify(orderinfo,testHeader)
  postToGCP(data)
  postToConversionAPI(data)
  res.send(data)

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

  //var crypto = require('crypto');

  //var firstName = crypto.createHash('sha256').update(firstName).digest('hex');
  //var lastName = crypto.createHash('sha256').update(lastName).digest('hex');
  //var tel = crypto.createHash('sha256').update(tel).digest('hex');
  //var email = crypto.createHash('sha256').update(email).digest('hex');

/*
  const getMethods = (obj) => {
  let properties = new Set()
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)))
  return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}
  console.log(getMethods(serverEvent));
  */



})

function getDataFromShopify(orderinfo, header){
  var orderbody

  if (orderinfo){
    orderbody = orderinfo
  }
  else{
  orderbody = {
  "id": 820982911946154500,
  "email": "jon@doe.ca",
  "closed_at": null,
  "created_at": "2020-09-10T04:26:51-04:00",
  "updated_at": "2020-09-10T04:26:51-04:00",
  "number": 234,
  "note": null,
  "token": "123456abcd",
  "gateway": null,
  "test": true,
  "total_price": "254.98",
  "subtotal_price": "244.98",
  "total_weight": 0,
  "total_tax": "0.00",
  "taxes_included": false,
  "currency": "USD",
  "financial_status": "voided",
  "confirmed": false,
  "total_discounts": "5.00",
  "total_line_items_price": "249.98",
  "cart_token": null,
  "buyer_accepts_marketing": true,
  "name": "#9999",
  "referring_site": null,
  "landing_site": null,
  "cancelled_at": "2020-09-10T04:26:51-04:00",
  "cancel_reason": "customer",
  "total_price_usd": null,
  "checkout_token": null,
  "reference": null,
  "user_id": null,
  "location_id": null,
  "source_identifier": null,
  "source_url": null,
  "processed_at": null,
  "device_id": null,
  "phone": null,
  "customer_locale": "en",
  "app_id": null,
  "browser_ip": null,
  "landing_site_ref": null,
  "order_number": 1234,
  "discount_applications": [
    {
      "type": "manual",
      "value": "5.0",
      "value_type": "fixed_amount",
      "allocation_method": "across",
      "target_selection": "explicit",
      "target_type": "line_item",
      "description": "Discount",
      "title": "Discount"
    }
  ],
  "discount_codes": [],
  "note_attributes": [],
  "payment_gateway_names": [
    "visa",
    "bogus"
  ],
  "processing_method": "",
  "checkout_id": null,
  "source_name": "web",
  "fulfillment_status": "pending",
  "tax_lines": [],
  "tags": "",
  "contact_email": "jon@doe.ca",
  "order_status_url": "https://derekmarketing.myshopify.com/48113811621/orders/123456abcd/authenticate?key=abcdefg",
  "presentment_currency": "USD",
  "total_line_items_price_set": {
    "shop_money": {
      "amount": "249.98",
      "currency_code": "USD"
    },
    "presentment_money": {
      "amount": "249.98",
      "currency_code": "USD"
    }
  },
  "total_discounts_set": {
    "shop_money": {
      "amount": "5.00",
      "currency_code": "USD"
    },
    "presentment_money": {
      "amount": "5.00",
      "currency_code": "USD"
    }
  },
  "total_shipping_price_set": {
    "shop_money": {
      "amount": "10.00",
      "currency_code": "USD"
    },
    "presentment_money": {
      "amount": "10.00",
      "currency_code": "USD"
    }
  },
  "subtotal_price_set": {
    "shop_money": {
      "amount": "244.98",
      "currency_code": "USD"
    },
    "presentment_money": {
      "amount": "244.98",
      "currency_code": "USD"
    }
  },
  "total_price_set": {
    "shop_money": {
      "amount": "254.98",
      "currency_code": "USD"
    },
    "presentment_money": {
      "amount": "254.98",
      "currency_code": "USD"
    }
  },
  "total_tax_set": {
    "shop_money": {
      "amount": "0.00",
      "currency_code": "USD"
    },
    "presentment_money": {
      "amount": "0.00",
      "currency_code": "USD"
    }
  },
  "line_items": [
    {
      "id": 487817672276298560,
      "variant_id": null,
      "title": "Aviator sunglasses",
      "quantity": 1,
      "sku": "SKU2006-001",
      "variant_title": null,
      "vendor": null,
      "fulfillment_service": "manual",
      "product_id": 788032119674292900,
      "requires_shipping": true,
      "taxable": true,
      "gift_card": false,
      "name": "Aviator sunglasses",
      "variant_inventory_management": null,
      "properties": [],
      "product_exists": true,
      "fulfillable_quantity": 1,
      "grams": 100,
      "price": "89.99",
      "total_discount": "0.00",
      "fulfillment_status": null,
      "price_set": {
        "shop_money": {
          "amount": "89.99",
          "currency_code": "USD"
        },
        "presentment_money": {
          "amount": "89.99",
          "currency_code": "USD"
        }
      },
      "total_discount_set": {
        "shop_money": {
          "amount": "0.00",
          "currency_code": "USD"
        },
        "presentment_money": {
          "amount": "0.00",
          "currency_code": "USD"
        }
      },
      "discount_allocations": [],
      "duties": [],
      "admin_graphql_api_id": "gid://shopify/LineItem/487817672276298554",
      "tax_lines": []
    },
    {
      "id": 976318377106520300,
      "variant_id": null,
      "title": "Mid-century lounger",
      "quantity": 1,
      "sku": "SKU2006-020",
      "variant_title": null,
      "vendor": null,
      "fulfillment_service": "manual",
      "product_id": 788032119674292900,
      "requires_shipping": true,
      "taxable": true,
      "gift_card": false,
      "name": "Mid-century lounger",
      "variant_inventory_management": null,
      "properties": [],
      "product_exists": true,
      "fulfillable_quantity": 1,
      "grams": 1000,
      "price": "159.99",
      "total_discount": "5.00",
      "fulfillment_status": null,
      "price_set": {
        "shop_money": {
          "amount": "159.99",
          "currency_code": "USD"
        },
        "presentment_money": {
          "amount": "159.99",
          "currency_code": "USD"
        }
      },
      "total_discount_set": {
        "shop_money": {
          "amount": "5.00",
          "currency_code": "USD"
        },
        "presentment_money": {
          "amount": "5.00",
          "currency_code": "USD"
        }
      },
      "discount_allocations": [
        {
          "amount": "5.00",
          "discount_application_index": 0,
          "amount_set": {
            "shop_money": {
              "amount": "5.00",
              "currency_code": "USD"
            },
            "presentment_money": {
              "amount": "5.00",
              "currency_code": "USD"
            }
          }
        }
      ],
      "duties": [],
      "admin_graphql_api_id": "gid://shopify/LineItem/976318377106520349",
      "tax_lines": []
    }
  ],
  "fulfillments": [],
  "refunds": [],
  "total_tip_received": "0.0",
  "original_total_duties_set": null,
  "current_total_duties_set": null,
  "admin_graphql_api_id": "gid://shopify/Order/820982911946154508",
  "shipping_lines": [
    {
      "id": 271878346596884000,
      "title": "Generic Shipping",
      "price": "10.00",
      "code": null,
      "source": "shopify",
      "phone": null,
      "requested_fulfillment_service_id": null,
      "delivery_category": null,
      "carrier_identifier": null,
      "discounted_price": "10.00",
      "price_set": {
        "shop_money": {
          "amount": "10.00",
          "currency_code": "USD"
        },
        "presentment_money": {
          "amount": "10.00",
          "currency_code": "USD"
        }
      },
      "discounted_price_set": {
        "shop_money": {
          "amount": "10.00",
          "currency_code": "USD"
        },
        "presentment_money": {
          "amount": "10.00",
          "currency_code": "USD"
        }
      },
      "discount_allocations": [],
      "tax_lines": []
    }
  ],
  "billing_address": {
    "first_name": "Bob",
    "address1": "123 Billing Street",
    "phone": "555-555-BILL",
    "city": "Billtown",
    "zip": "K2P0B0",
    "province": "Kentucky",
    "country": "United States",
    "last_name": "Biller",
    "address2": null,
    "company": "My Company",
    "latitude": null,
    "longitude": null,
    "name": "Bob Biller",
    "country_code": "US",
    "province_code": "KY"
  },
  "shipping_address": {
    "first_name": "Steve",
    "address1": "123 Shipping Street",
    "phone": "555-555-SHIP",
    "city": "Shippington",
    "zip": "40003",
    "province": "Kentucky",
    "country": "United States",
    "last_name": "Shipper",
    "address2": null,
    "company": "Shipping Company",
    "latitude": null,
    "longitude": null,
    "name": "Steve Shipper",
    "country_code": "US",
    "province_code": "KY"
  },
  "customer": {
    "id": 115310627314723950,
    "email": "john@test.com",
    "accepts_marketing": false,
    "created_at": null,
    "updated_at": null,
    "first_name": "John",
    "last_name": "Smith",
    "orders_count": 0,
    "state": "disabled",
    "total_spent": "0.00",
    "last_order_id": null,
    "note": null,
    "verified_email": true,
    "multipass_identifier": null,
    "tax_exempt": false,
    "phone": null,
    "tags": "",
    "last_order_name": null,
    "currency": "USD",
    "accepts_marketing_updated_at": null,
    "marketing_opt_in_level": null,
    "admin_graphql_api_id": "gid://shopify/Customer/115310627314723954",
    "default_address": {
      "id": 715243470612851200,
      "customer_id": 115310627314723950,
      "first_name": null,
      "last_name": null,
      "company": null,
      "address1": "123 Elm St.",
      "address2": null,
      "city": "Ottawa",
      "province": "Ontario",
      "country": "Canada",
      "zip": "K2H7A8",
      "phone": "123-123-1234",
      "name": "",
      "province_code": "ON",
      "country_code": "CA",
      "country_name": "Canada",
      "default": true
    }
  }
}
}



/*

Line Items – Product ID, Quantity
Order Id
Total Price
Currency Code
Customer Email, First Name, Last Name, Phone Number
User Agent
Browser IP address

*/
var orderID = '2698385424549'
shopifyKey = ""
shopifypw = ""
url = "https://"+shopifyKey+":"+shopifypw+"@derekmarketing.myshopify.com/admin/api/2020-07/orders/"+orderID+".json"

/*
request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    orderbody = JSON.parse(body)
    //res.send(info)
  }
})
*/

var email = orderbody.customer.email
var firstName = orderbody.customer.first_name
var lastName = orderbody.customer.last_name
var tel = orderbody.customer.phone
var orderID = orderbody.order_number
var totalPrice = orderbody.total_price
var currency = orderbody.currency
var agent =header['user-agent']
var ipAddress = orderbody.browser_ip
var line_items = orderbody.line_items

function extractLineItemInfo(item){
  return {'id':item.product_id, 'quantity':item.quantity}
}

new_line_items = line_items.map(extractLineItemInfo);

userData ={'FirstName': firstName, 'LastName': lastName, 'tel':tel, 'Email':email,'IP':ipAddress,'agent':agent}
customData = {'orderID':orderID, 'TotalPrice':totalPrice,'Currency':currency,'lineitem':new_line_items}

data ={'UserData':userData, 'customeData':customData}


const new_order = db.collection('orders').doc('test');

new_order.set(data);



  return data

}



const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
