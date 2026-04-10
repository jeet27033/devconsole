/**
 *
 * Asynchronously loads the component for Contact
 *
 */

import React, { Suspense } from 'react';
import { loadable } from '@capillarytech/cap-ui-utils';
import CapSpin from '@capillarytech/cap-ui-library/CapSpin';
const LoadableComponent = loadable(() => import('./Cap'));

export default () => (
  <Suspense fallback={<CapSpin />}>
    <LoadableComponent />
  </Suspense>
);
