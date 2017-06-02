import qs from 'querystring';
import crypto from 'crypto';
import https from 'https';
import xml2js from 'xml2js';
/*
* Constructor for the main MWS client interface used to make api calls and
* various data structures to encapsulate MWS requests, definitions, etc.
*
* @param {String} accessKeyId     Id for your secret Access Key (required)
* @param {String} secretAccessKey Secret Access Key provided by Amazon (required)
* @param {String} merchantId      Aka SellerId, provided by Amazon (required)
* @param {Object} options         Additional configuration options for this instance
*/

export class AmazonMwsClient {
  constructor(accessKeyId, secretAccessKey, merchantId, marketplaceId, options) {
    this.host = options.host || 'mws.amazonservices.in';
  	this.port = options.port || 443;
  	this.conn = options.conn || https;
  	this.creds = crypto.createCredentials(options.creds || {});
  	this.appName = options.appName || 'deck';
  	this.appVersion = options.appVersion || '0.1.0';
  	this.appLanguage = options.appLanguage || 'JavaScript';
  	this.accessKeyId = accessKeyId || null;
  	this.secretAccessKey = secretAccessKey || null;
  	this.merchantId = merchantId || null;
    this.marketplaceId = marketplaceId || null;
  }

  /**
   * The method used to invoke calls against MWS Endpoints. Recommended usage is
   * through the invoke wrapper method when the api call you're invoking has a
   * request defined in one of the submodules. However, you can use call() manually
   * when a lower level of control is necessary (custom or new requests, for example).
   *
   * @param  {Object}   api      Settings object unique to each API submodule
   * @param  {String}   action   Api `Action`, such as GetServiceStatus or GetOrder
   * @param  {Object}   query    Any parameters belonging to the current action
   * @param  {Function} callback Callback function to send any results recieved
   */

  call(api, action, query, callback) {
    if (this.secretAccessKey == null || this.accessKeyId == null || this.merchantId == null) {
  	  throw("accessKeyId, secretAccessKey, and merchantId must be set");
  	}

    // variables for storing data and format if any
    let body, bformat;

    // Check if we're dealing with a file (such as a feed) upload
    if (api.upload) {
      body = query._BODY_;
      bformat = query._FORMAT_;
      delete query._BODY_;
      delete query._FORMAT_;
    }

    // Add required parameters and sign the query
    query['Action'] = action;
    query['Version'] = api.version;
    query['Timestamp'] = (new Date()).toISOString();
    query['AWSAccessKeyId'] = this.accessKeyId;
    if (api.legacy) { query['Merchant'] = this.merchantId }
    else { query['SellerId'] = this.merchantId; }
    query['MWSAuthToken'] = this.marketplaceId;
    query = this.sign(api.path, query);

    // If it isn't an upload then create a queryString from the query
    if (!api.upload) {
      body = qs.stringify(query);
    }

    /* Testing body and query variables
    */
    console.log(`Testing body = ${JSON.stringify(body)} \n query = ${JSON.stringify(query)} `);

    // Setup the HTTP headers and connection options
    const headers = {
      'Host': this.host,
      'User-Agent': `${this.appName}/\/${this.appVersion}( Language=${this.appLanguage})`,
      'Content-Type': bformat || 'application/x-www-form-urlencoded; charset=utf-8',
      'Content-Length': body.length,
    };

    if (api.upload) {
  		headers['Content-MD5'] = cryto.createHash('md5').update(body).digest("base64");
  	}

    /* Testing headers
    */
    console.log(`Tesiting headers = ${JSON.stringify(headers)}`);

    // Seting up the options for AJAX call to amazon servers
    const options = {
      host: this.host,
      port: this.port,
      path: api.path + (api.upload ? `?${qs.stringify(query)}`: ''),
      method: "POST",
      headers: headers,
    };

    /* Testing headers
    */
    console.log(`Testing options = ${JSON.stringify(options)}`);

    // Make the initial request and define callbacks
    const req = this.conn.request(options, function (res) {

      let data = '';
      // Append each incoming chunk to data variable
      res.addListener('data', function reqEventListener(chunk) {
        data += chunk.toString();
      });
      // When response is complete, parse the XML and pass it to callback
      res.addListener('end', function endEventListener() {
        let parser = new xml2js.Parser();
        parser.addListener('end', function parserEndListener(result) {
          // Throw an error if there was a problem reported
          if (result.Error != null) {
            throw(`${result.Error.Code}:${result.Error.Message}`);
          }
          callback(result);
        });
        if (data.slice(0, 5) == '<?xml') {
          parser.parseString(data);
        }else {
          callback(data);
        }
      });
    });

    req.write(body);
    req.end();
  }

  /**
  * Calculates the HmacSHA256 signature and appends it with additional signature
  * paramaters to the provided query object.
  *
  * @param {String} path Path of API call (used to build the string to sign)
  * @param {Object} query Any non-signature paramters that will be sent
  * @param {Object} Finalized object used to build query string of request
  */

  sign(path, query) {
    let keys = [];
    const sorted = {};
    const hash = crypto.createHmac("sha256", this.secretAccessKey);

    // Configure the query signature method/version
    query["SignatureMethod"] = "HmacSHA256";
    query["SignatureVersion"] = "2";

    // Copy query keys, sort them, then copy over the values
    for (var key in query) {
      if (query.hasOwnProperty(key)) {
          keys.push(key);
      }
    }

    keys = keys.sort();

    for (var n in keys) {
      if (keys.hasOwnProperty(n)) {
        const key = keys[n];
        sorted[key] = query[key];
      }
    }

    let stringToSign = ["POST", this.host, path, qs.stringify(sorted)].join("\n");

    // An RFC (cannot remember which one) requires these characters also be changed:
  	stringToSign = stringToSign.replace(/'/g,"%27");
  	stringToSign = stringToSign.replace(/\*/g,"%2A");
  	stringToSign = stringToSign.replace(/\(/g,"%28");
  	stringToSign = stringToSign.replace(/\)/g,"%29");

    query['Signature'] = hash.update(stringToSign).digest("base64");

    /* Testing query['Signature']
    */
    console.log(`Testing query['Signature'] = ${query['Signature']}`);

    return query;
  }

  /**
  * Suggested method for invoking a pre-defined mws request object.
  *
  * @param {Object} request An instance of AmazonMwsRequest with params, etc.
  * @param {Function} callback Callback function used to process results/errors
  */

  invoke(request, callback) {
    this.call(request.api, request.action, request.query(), callback);
  }
}

/********************************

  AmazonMwsRequest class - wrapped by api submodules to keep
  things DRY, yet familiar despite whichever api is implemented

*/

export class AmazonMwsRequest {
  /**
  * Contructor for general MWS request objects,
  *
  * @param {Object} options Settings to apply to new request instance.
  */
  constructor(options) {
    this.api = {
      path: options.path || '/',
      version: options.version || '2010-10-01',   //'2009-01-01'
      legacy: options.legacy || false,
    };
    this.action = options.action || 'GetServiceStatus';
    this.params = options.params || {};
  }

  /**
  * Handles the casting, renaming, and setting of individual request params.
  *
  * @params {String} param Key of paramter (not ALWAYS the same as the param name!)
  * @param {Mixed} value Value to assign to paramaters
  * @return {Object} Current instance to allow function chaining
  */

  set(param, value) {

    /** Testing param and value
    */
    // console.log(this.params[param]);

    console.log('Calling set function for', param, value);

    let p = this.params[param];
    let v = p.value = {};

    // Hanldes the actual setting based on type
    const setValue = function setValue(name, val) {
      if (p.type == 'Timestamp') {
        v[name] = val.toISOString();
      } else if (p.type == 'Boolean') {
        v[name] = val ? 'true' : 'false';
      } else {
        v[name] = val;
      }
    }

    // Lists need to be sequentially numbered and we
    if (p.list) {
      let i = 0;
      if ((typeof(value) == 'string') || (typeof(value) == 'number')) {
        setValue(`${p.name}.1`, value);
      }
      if (typeof(value) == 'object') {
        if (Array.isArray(value)) {
          for (i = value.length - 1; i >= 0; i--) {
            setValue(`${p.name}.${i+1}`, value[i]);
          }
        } else {
          for (var key in value) {
            if (value.hasOwnProperty(key)) {
              setValue(`${p.name}.${++i}`, value[key]);
            }
          }
        }
      }
    } else {
      setValue(p.name, value);
    }

    return this;
  }

  /**
  * Builds a query object and checks for required parameters.
  *
  * @return {Object} KvP's of all provided parameters (used by invoke())
  */
  query() {
    const q = {};
    for (var param in this.params) {
      if (this.params.hasOwnProperty(param)) {
        const value = this.params[param].value;
        const name = this.params[param].name;
        const complex = (this.params[param].type === 'Complex');
        const required = this.params[param].required;

        /* Testing value, name, required
        */
        console.log(`value = ${value} \n name = ${name} \n required = ${required}`);
        if ((value !== undefined) && (value !== null)) {
          if (complex) {
            value.appendTo(q);
          } else {
            for (var val in value) {
              if (value.hasOwnProperty(val)) {
                q[val] = value[val];
              }
            }
          }
        } else {
          if (param.required === true) {
            throw("ERROR: Missing required parameter, " + name + "!");
          }
        }
      }
    }
    return q;
  }
}

/*************************

  EnumType Class - Useful hen you need to make
  programmatic updates to an enumerated data type or
  wish to encapsulate enum states in a handy,
  re-usable variable.

*/

export class EnumType {
  /**
  * Constructor for objects used to represent enumeration states.
  *
  * @param {Array} choices An array of any possible values (choices)
  */
  constructor(choices) {
    for (var choice in choices) {
      if (choices.hasOwnProperty(choice)) {
        this[choices[choice]] = false;
      }
      this._choices = choices
    }
  }

}
