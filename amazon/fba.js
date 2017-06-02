/**
* Fulfillment API requests and definitions for Amazon's MWS web services.
* Currently untested,
*
*/

import { AmazonMwsRequest } from './index';

/**
 * Construct a mws fulfillment api request for mws.Client.invoke()
 * @param {String} group  Group name (category) of request
 * @param {String} path   Path of associated group
 * @param {String} action Action request will be calling
 * @param {Object} params Schema of possible request parameters
 */
class FulfillmentRequest {
  constructor(group, path, action, params) {
    const opts = {
        name: 'Fulfillment',
        group: group,
        path: path,
        version: '2010-10-01',
        legacy: false,
        action: action,
        params: params
    };
    return new AmazonMwsRequest(opts);
  }
}

function FbaInboundRequest(action, params) {
    return FulfillmentRequest('Inbound Shipments', '/FulfillmentInboundShipment/2010-10-01', action, params);
}

function FbaInventoryRequest(action, params) {
    return FulfillmentRequest('Inventory', '/FulfillmentInventory/2010-10-01', action, params);
}

function FbaOutboundRequest(action, params) {
    return FulfillmentRequest('Outbound Shipments', '/FulfillmentOutboundShipment/2010-10-01', action, params);
}

/**
 * Initialize and create an add function for ComplexList parameters. You can create your
 * own custom complex parameters by making an object with an appendTo function that takes
 * an object as input and directly sets all of the associated values manually.
 *
 *  Need to read documentation and then write the code
 */
