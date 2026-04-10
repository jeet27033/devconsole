import React from 'react';
import { withStyles, getHostApplicationContext } from '@capillarytech/vulcan-react-sdk/utils';
import { Link, Outlet } from 'react-router-dom';
import styles from './styles';
import { CapRow, CapColumn } from '@capillarytech/cap-ui-library';
import PageTemplate from '../../templates/PageTemplate';

const Home = ({ className, history, appContext, ...rest }) => {
  // appContext is the prop that needs to be passed from the host application where this component is embedded
  // prepare the final context using SDK and use it in your app
  const finalContext = getHostApplicationContext(appContext);
  return (
    <PageTemplate>
      <div className={className}>
        <h3>This is your home page</h3>
        <br />
        <CapRow>
          <CapColumn span={4}>
            <Link to="/home/about">About</Link>
          </CapColumn>
          <CapColumn span={4}>
            <Link to="/home/contact">Contact</Link>
          </CapColumn>
          <CapColumn span={4}>
            <Link to="/">Back to dashboard</Link>
          </CapColumn>
        </CapRow>
        <div class="children-routes">{rest.children}</div>
      </div>
    </PageTemplate>
  );
};

export default withStyles(Home, styles);
