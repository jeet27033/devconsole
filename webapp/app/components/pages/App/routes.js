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
      {
        exact: true,
        path: `/mongodb-workbench`,
        type: 'dashboard',
        component: lazy(() => import('../../organisms/MongodbWorkbench')),
      },
      {
        exact: true,
        path: `/db-audit-log`,
        type: 'dashboard',
        component: lazy(() => import('../../organisms/DBAuditLog')),
      },{
        exact: true,
        path: `/alert-management/bugsnag/issues`,
        type: 'dashboard',
        component: lazy(() => import('../../organisms/BugsnagIssueListing')),
      },
      {
        exact: true,
        path: `/alert-management/bugsnag/configuration`,
        type: 'dashboard',
        component: lazy(() => import('../../organisms/BugsnagConfig')),
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
