import { endpointUtil } from "@capillarytech/vulcan-react-sdk/utils";
import { appName, appType, intouchBaseUrl } from "../../app-config";

const enviromentEndpoints = {
  absoluteUrls: {
    devconsole_endpoint: `http://localhost:3000/devconsole/api`,
    vulcan_endpoint: `https://${intouchBaseUrl}/vulcan/api/v1`,
    arya_endpoint: `https://${intouchBaseUrl}/arya/api/v1`,
  },
  partialUrls: {
    vulcan_endpoint: '/vulcan/api/v1',
    arya_endpoint: '/arya/api/v1',
    devconsole_endpoint: '/devconsole/api',
  },
};

const endpoints = endpointUtil(enviromentEndpoints, appName, appType);
export default endpoints;
