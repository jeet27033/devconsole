// /**
//  * RenderRoute
//  */
// import React from 'react';
// import PropTypes from 'prop-types';
// import { Route } from 'react-router-dom';

// export const RenderRoute = ({ component: Component, ...rest }) => (
//   <Route {...rest} render={props => <Component {...props} />} />
// );

// RenderRoute.propTypes = {
//   component: PropTypes.any,
// };

// export default RenderRoute;

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

export const RenderRoute = ({ component: Component, routes, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <Component {...props}>
        <Switch>
          {routes &&
            routes.map((subRoute, index) => (
              <Route
                key={index}
                path={subRoute.path}
                exact={subRoute.exact}
                render={subProps => (
                  <subRoute.component {...subProps}>
                    {subRoute.routes && (
                      <RenderRoute routes={subRoute.routes} {...subProps} />
                    )}
                  </subRoute.component>
                )}
              />
            ))}
        </Switch>
      </Component>
    )}
  />
);

RenderRoute.propTypes = {
  component: PropTypes.any.isRequired,
  routes: PropTypes.array,
};

export default RenderRoute;
