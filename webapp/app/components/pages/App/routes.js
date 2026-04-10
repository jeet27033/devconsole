import { lazy } from 'react';
const Home = lazy(() => import('../Home/Loadable'));
const routes = [
  {
    exact: true,
    path: `/accessForbidden`,
    component: lazy(() => import('@capillarytech/vulcan-react-sdk/components/AccessForbidden')),
  },
  // default route
  {
    exact: true,
    path: `/*`,
    component: Home,
  },
];

export default routes;
