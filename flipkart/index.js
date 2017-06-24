import request from 'request';

export class FlipkartClient {
  constructor(appId, appSecret, options) {
    this.host = options.host || 'https://api.flipkart.net/sellers/v2/';
    this.uri = options.uri || 'orders/search';
    this.method = options.method || 'POST';
    this.appName = options.appName || 'EASy';
    this.appLanguage = options.appLanguage || 'JavaScript';
    this.applicationId = appId || null;
    this.applicationSecret = appSecret || null;
    this.result = null;
  }

  fetchResource(options) {
    return new Promise(function(resolve, reject) {
      function callback(error, response, body) {
          if (!error && response.statusCode == 200) {
              resolve(body);
          } else {
            reject(response);
          }

      }
      // Making XMHTTPAjax Request here
      request(options, callback);
    });
  }


  call(api, action, query, callback) {
    if (this.applicationId === null || this.applicationSecret === null) {
      throw("applicationId, applicationSecret must be set");
    }
//     var options = {
//     url: 'https://api.flipkart.net/oauth-service/oauth/token\?grant_type\=client_credentials\&scope=Seller_Api',
//     auth: {
//         'user': 'b8017b67395562aa8414756131252249343b',
//         'pass': '16eb488edececfbd505232d7f012110de'
//     }
// };
//
// function callback(error, response, body) {
//     if (!error && response.statusCode == 200) {
//         console.log(body);
//         return body;
//     } else {
//       console.log(error);
//     }
// }
//
// request(options, callback);

  var headers = {
      'Authorization': 'Bearer 147fd8c0-eca2-4493-b54e-c01b208872e6',
      'Content-Type': 'application/json'
  };

  var dataString = {
"filter" : {
  }
};



    // "orderDate": {
    //   "fromDate": "2017-05-10T18:30:00.000Z",
    //   "toDate": "2017-06-16T18:30:00.000Z"
    // }
  const orderSearch = `${this.host}${this.uri}`;
  // const orderItemSearch = 'https://api.flipkart.net/sellers/v2/orders/3820303707267100'

  let options = {
      url: orderSearch,
      method: this.method,
      headers: headers,
      body: JSON.stringify(dataString),
  };



  const getResource = async (options) => {
    const response = await this.fetchResource(options);
    console.log('In getResource function response');
    console.log(response);
    return response;
  }

  this.result = getResource(options);

  return this.result;
  // If the response hasMore as true
  // Use nextPageUrl as uri for new field and make a request to get response
  // Use a variable to store data and repeat process till it works

}


//   var options = {
//     url: 'https://sandbox-api.flipkart.net/oauth-service/oauth/token\?grant_type\=client_credentials\&scope=Seller_Api',
//     auth: {
//         'user': '19b53a1b21',
//         'pass': '38fff0'
//     }
// };

}
