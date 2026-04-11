import { lazy } from 'react';
import DashboardLayout from '../../templates/DashboardLayout';

const routes = [
  {
    exact: true,
    path: `/accessForbidden`,
    component: lazy(() => import('@capillarytech/vulcan-react-sdk/components/AccessForbidden')),
  },
  {
    path: `/`,
    component: DashboardLayout,
    routes: [
      {
        exact: true,
        path: `/extensions-deployment`,
        type: 'dashboard',
        component: lazy(() => import('../../organisms/ExtensionsDeployment')),
      },
      {
        exact: true,  
        path: `/neo-debugger`,
        type: 'dashboard',
        component: lazy(() => import('../../molecules/NeoDebugger')),
      },
      // Default route
      {
        exact: true,
        path: `/`,
        component: lazy(() => import('../../organisms/ExtensionsDeployment')),
      },
    ],
  },
];

export default routes;
