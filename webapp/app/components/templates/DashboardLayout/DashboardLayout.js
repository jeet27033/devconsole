import React from 'react';
import { withStyles } from '@capillarytech/vulcan-react-sdk/utils';
import CapRow from '@capillarytech/cap-ui-library/CapRow';
import CapColumn from '@capillarytech/cap-ui-library/CapColumn';
import PageTemplate from '../PageTemplate';
import CustomSidebar from '../../organisms/CustomSidebar';
import styles from './styles';

const DashboardLayout = ({ className, children }) => (
  <PageTemplate>
    <CapRow className={className}>
      <CapColumn span={4} className="sidebar-column">
        <CustomSidebar />
      </CapColumn>
      <CapColumn span={20} className="content-column">
        {children}
      </CapColumn>
    </CapRow>
  </PageTemplate>
);

export default withStyles(DashboardLayout, styles);
