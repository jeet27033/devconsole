import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { withStyles, injectSaga, injectReducer } from '@capillarytech/vulcan-react-sdk/utils';
import CapRow from '@capillarytech/cap-ui-library/CapRow';
import CapColumn from '@capillarytech/cap-ui-library/CapColumn';
import PageTemplate from '../PageTemplate';
import CustomSidebar from '../../organisms/CustomSidebar';
import styles from './styles';
import extensionsSagas from '../../organisms/Extensions/saga';
import extensionsReducer from '../../organisms/Extensions/reducer';
import { getExtensionsList } from '../../organisms/Extensions/action';
import { REDUCER_KEY as EXTENSIONS_REDUCER_KEY } from '../../organisms/Extensions/constants';

const DashboardLayout = ({ className, children, actions: boundActions }) => {
  useEffect(() => {
    boundActions.getExtensionsList();
  }, [boundActions]);

  return (
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
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ getExtensionsList }, dispatch),
});

const withConnect = connect(null, mapDispatchToProps);

const withExtensionsSaga = extensionsSagas.map((saga, index) =>
  injectSaga({ key: `${EXTENSIONS_REDUCER_KEY}-${index}`, saga }),
);

const withExtensionsReducer = injectReducer({
  key: EXTENSIONS_REDUCER_KEY,
  reducer: extensionsReducer,
});

export default compose(
  ...withExtensionsSaga,
  withExtensionsReducer,
  withConnect,
)(withStyles(DashboardLayout, styles));
