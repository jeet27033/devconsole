import { gtmInitializer } from '@capillarytech/vulcan-react-sdk/utils';
import appConfig from '../../app-config';
import { isEmpty } from 'lodash';

const { gtm: { useGTM, trackingId } = {}, appName } = appConfig;

export const pushDataToGTM = (eventType, eventObject = {}, userData) => {
  if (useGTM) {
    if (!isEmpty(eventType)) {
      const gtmInstance = gtmInitializer({
        gtmTrackingId: trackingId,
        appName: appName,
        userDetails: userData
      });
      gtmInstance.push(eventType, eventObject);
    }
  }
};