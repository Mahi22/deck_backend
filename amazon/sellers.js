import { AmazonMwsRequest } from './index';
/**
* Sellers API requests and definitions for Amazon's MWS web services.
* For information on using, please see examples folder.
*
*/

class SellersRequest {

  /**
  * Construct a Sellers API request for AmazonMwsClient.invoke()
  *
  * @param {String} action Action parameter of request
  * @param {Object} params Schemas for all supported parameters
  */

  constructor(action, params) {
    const opts = {
      name: 'Sellers',
      group: 'Sellers Retrieval',
      path: '/Sellers/2011-07-01',
      version: '2011-07-01',
      legacy: false,
      action: action,
      params: params
    };

    return new AmazonMwsRequest(opts);
  }
}

/**
* A collection of currently supported request constructors. Once created and
* configured, the returned requests can be passed to an mws client `invoke` call
* @type Functions
*/


/**
* Requests the operational status of the Sellers API section.
*/
export function GetServiceStatus() {
  return new SellersRequest('GetServiceStatus', {});
}

export function ListMarketplaceParticipations() {
  return new SellersRequest('ListMarketplaceParticipations', {});
}

export function ListMarketplaceParticipationsByNextToken() {
  return new SellersRequest('ListMarketplaceParticipationsByNextToken', {
    NextToken: { name: 'NextToken', required: true },
  });
}
