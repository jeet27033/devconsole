/**
 * NavigationBar
 */
import React, { useMemo, useCallback, Suspense } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import CapSpin from '@capillarytech/cap-ui-library/CapSpin';
import { Switch, withRouter } from 'react-router-dom';
import CapNavigation from '@capillarytech/cap-ui-library/CapNavigation';
import { withStyles, localStorageApi, gtmInitializer } from '@capillarytech/vulcan-react-sdk/utils';
import { NotFoundPage } from '@capillarytech/vulcan-react-sdk/components';
import RenderRoute from '../../atoms/RenderRoute';
import appConfig from '../../../../app-config';
import messages from './messages';
import styles from './style';
import * as constants from './constants';
import componentRoutes from '../../pages/App/routes'

const { DEFAULT_MODULE } = constants;
const gtmConfig = appConfig.gtm;

export const NavigationBar = ({
  className,
  sidebarMenuData,
  sidebarMenuItemsPosition,
  showSecondaryTopBar,
  topbarMenuData = [],
  userData,
  secondaryTopBarActionHandler,
  intl: { formatMessage = () => { } } = {},
  ...props
}) => {
  const onTopMenuClick = ({ link }) =>
    props.history.push(link);

  const topbarMenuDataModified = useMemo(
    () =>
      topbarMenuData.map(menu => ({
        ...menu,
        onClickHandler: onTopMenuClick,
      })),
    [topbarMenuData],
  );

  const getDropdownMenu = () => [
    {
      label: formatMessage(messages.orgSettings),
      key: formatMessage(messages.orgSettings),
      onClickHandler: onOrgSettingsClick,
    },
    {
      label: formatMessage(messages.logout),
      key: formatMessage(messages.logout),
      onClickHandler: props.logout,
    },
  ];
  const onOrgSettingsClick = () => {
    const { orgSettingsUrl } = props;
    if (orgSettingsUrl) {
      window.open(orgSettingsUrl, '_blank');
    }
  };

  const getTopbarIcons = () => [
    {
      iconType: 'notifications',
      key: 'notifications',
      onClickHandler: onNotificationIconClick,
    },
    {
      iconType: 'help',
      key: 'help',
      onClickHandler: onHelpIconClick,
    },
    {
      iconType: 'settings',
      key: 'settings',
      disabled: true,
      placement: 'bottomRight',
      className: 'navigation-setting-icon',
      toolTip: formatMessage(messages.noProductSetting),
    },
  ];

  const onNotificationIconClick = () => {
    const { notificationUrl } = props;
    if (notificationUrl) {
      props.history.push(notificationUrl);
    }
  };

  const onHelpIconClick = () => {
    const { helpUrl } = props;
    if (helpUrl) {
      window.open(helpUrl, '_blank');
    }
  };

  const changeOrgEntity = orgId => {
    const selectedOrg = localStorageApi.loadItem('orgID');
    if (selectedOrg !== orgId) {
      props.changeOrg(orgId);
    }
  };

  const sidebarMenuItemClick = item => {
    const { history } = props;
    history.push(item.link, { code: item.key });
  };

  const topbarIcons = getTopbarIcons();
  const dropdownMenuProps = getDropdownMenu();

  const renderSuspenseBlock = useCallback(
    () => (
      <Suspense fallback={<CapSpin />}>
        <Switch>
          {componentRoutes.map(routeProps => (
            <RenderRoute {...routeProps} key={routeProps.path} />
          ))}
          <RenderRoute component={NotFoundPage} />
        </Switch>
      </Suspense>
    ),
    [],
  );

  return (
    <div className={className}>
      {appConfig?.useNavigationComponent ? (
        <CapNavigation
          className={className}
          showContent
          userData={userData}
          loadStorageItem={localStorageApi.loadItem}
          changeOrgEntity={changeOrgEntity}
          topbarMenuData={topbarMenuDataModified}
          topbarSelectedMenuData={[DEFAULT_MODULE]}
          dropdownMenuProps={dropdownMenuProps}
          topbarIcons={topbarIcons}
          sidebarMenuData={sidebarMenuData}
          sidebarMenuItemsPosition={sidebarMenuItemsPosition}
          sidebarMenuItemClick={sidebarMenuItemClick}
          defaultSelectedProduct={formatMessage(messages.selectedProductDefault)}
          showSecondaryTopBar={showSecondaryTopBar}
          secondaryTopBarActionHandler={secondaryTopBarActionHandler}
          skipStateForStorage
        >
          {renderSuspenseBlock()}
        </CapNavigation>
      ) : (
        <div className="centered-div">
          {renderSuspenseBlock()}
        </div>
      )}
    </div>
  );
};

NavigationBar.propTypes = {
  className: PropTypes.string,
  userData: PropTypes.object,
  topbarMenuData: PropTypes.array,
  showSecondaryTopBar: PropTypes.bool,
  sidebarMenuItemsPosition: PropTypes.string,
  orgSettingsUrl: PropTypes.string,
  settingsUrl: PropTypes.string,
  notificationUrl: PropTypes.string,
  helpUrl: PropTypes.string,
  changeOrg: PropTypes.func,
  logout: PropTypes.func,
  secondaryTopBarActionHandler: PropTypes.func,
  history: PropTypes.object.isRequired,
  sidebarMenuData: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
};

export default withRouter(injectIntl(withStyles(NavigationBar, styles)));
