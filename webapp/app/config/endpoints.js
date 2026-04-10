import { endpointUtil } from "@capillarytech/vulcan-react-sdk/utils";
import { appName, appType, intouchBaseUrl } from "../../app-config";

/***
 * Partial endpoints (starting with /) resolve to window.location.origin as host
 * Absolote endpoints (starting with http/https) will hit exact url.
 */

const enviromentEndpoints = {
  // use this for storing fully qualified urls for following
  // development mode
  // test mode
  // standalone mode execution of apps
  // `intouchBaseUrl` is generated on app-config.js file based on `cluster` input given during project setup
  // you can choose to use the same or define your own endpoints for other APIs that you would want to call
  absoluteUrls: {
    // vulcan endpoint (Authenticate, I18n, Intouch, XAJA, Extension, Neo, Shield, Cortex APIs)
    vulcan_endpoint: `https://${intouchBaseUrl}/vulcan/api/v1`,
    // arya endpoint (arya, org-settings, creatives, insights Node API endpoints)
    arya_endpoint: `https://${intouchBaseUrl}/arya/api/v1`,
    // coupons Node API endpoint
    coupons_endpoint: `https://${intouchBaseUrl}/coupon/api/v1`,
    // loyalty Node API endpoint
    loyalty_endpoint: `https://${intouchBaseUrl}/loyalty/api/v1`,
    // membercare Node API endpoint
    membercare_endpoint: `https://${intouchBaseUrl}/member-care/api/v1`,
    // filservice API endpoint whitelisted via arya
    fileservice_endpoint: `https://${intouchBaseUrl}/v1/file-service`,
    // rewards core API endpoint whitelisted via arya
    rewards_endpoint: `https://${intouchBaseUrl}/core`,
    // marvel gamification API endpoint whitelisted via arya
    gamification_endpoint: `https://${intouchBaseUrl}/gamification`,
    // EMF API endpoint whitelisted via arya
    emf_endpoint: `https://${intouchBaseUrl}/loyalty/emf/v1`,
    // promo API endpoint whitelisted via arya
    promotion_endpoint: `https://${intouchBaseUrl}/v1/promotion-management`,
    // badges API endpoint whitelisted via arya
    badges_endpoint: `https://${intouchBaseUrl}/v1/badges`,
    // API Gateway endpoints whitelisted via vulcan
    gateway_endpoint: `https://${intouchBaseUrl}/vulcan/api/v1/gateway`,
  },
  // use this for partial urls added after current window.location.origin
  // production mode
  // embedded in capillary product  mode
  partialUrls: {
    // vulcan endpoint (Authenticate, I18n, Intouch, XAJA, Extension, Neo, Shield, Cortex APIs)
    vulcan_endpoint: '/vulcan/api/v1',
    // arya endpoint (arya, org-settings Node API endpoints)
    arya_endpoint: '/arya/api/v1',
    // coupons Node API endpoint
    coupons_endpoint: '/coupon/api/v1',
    // loyalty Node API endpoint
    loyalty_endpoint: '/loyalty/api/v1',
    // membercare Node API endpoint
    membercare_endpoint: '/member-care/api/v1',
    // filservice API endpoint whitelisted via arya
    fileservice_endpoint: '/v1/file-service',
    // rewards core API endpoint whitelisted via arya
    rewards_endpoint: '/core',
    // marvel gamification API endpoint whitelisted via arya
    gamification_endpoint: '/gamification',
    // EMF API endpoint whitelisted via arya
    emf_endpoint: '/loyalty/emf/v1',
    // promo API endpoint whitelisted via arya
    promotion_endpoint: '/v1/promotion-management',
    // badges API endpoint whitelisted via arya
    badges_endpoint: '/v1/badges',
    // API Gateway endpoints whitelisted via vulcan
    gateway_endpoint: '/vulcan/api/v1/gateway',
  },
};

const endpoints = endpointUtil(enviromentEndpoints, appName, appType);
export default endpoints;
