/**
 *
 * RadioWithInfo
 *
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@capillarytech/vulcan-react-sdk/utils';
import { injectIntl, intlShape, FormattedHTMLMessage } from 'react-intl';
import classnames from 'classnames';

import CapHeading from '@capillarytech/cap-ui-library/CapHeading';
import CapRow from '@capillarytech/cap-ui-library/CapRow';
import CapModal from '@capillarytech/cap-ui-library/CapModal';
import CapSnackBar from '@capillarytech/cap-ui-library/CapSnackBar';
import utilsSessionStorageApi from '@capillarytech/cap-ui-utils/utils/utilsSessionStorageApi';
import multipleOrgSwitch from '@capillarytech/cap-ui-utils/utils/multipleOrgSwitch';
import globalMessages from '../../pages/Cap/messages';
import messages from './messages';
import * as style from './style';

import * as constants from './constants';

const { styles, InlineStyle } = style;

const { ORG_REFRESH_SEC, ORG_CHANGED } = constants;

const {
  logNewTab,
  utilsGetOrgNameFromId,
  tabBeforeUnloadEventHandler,
  utilsHandleStorageChange,
} = multipleOrgSwitch;

const { loadSessionItem, saveSessionItem } = utilsSessionStorageApi;

const InlineHeading = withStyles(CapHeading, InlineStyle);

export const OrgChange = ({
  userData = {},
  className,
  selectedOrgId,
  changeOrgAction,
  navigateToDashboard,
  intl: { formatMessage },
}) => {
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [showOrgChangeModal, setShowOrgChangeModal] = useState(false);
  const [refreshSeconds, setRefreshSeconds] = useState(ORG_REFRESH_SEC);
  const [localStorageOrgInfo, setLocalStorageOrgInfo] = useState({
    oldValue: null,
    newValue: null,
  });

  useEffect(
    () => {
      setShowOrgChangeModal(!!selectedOrgId || selectedOrgId === 0);
    },
    [selectedOrgId],
  );

  const showOrgChangeSnackBar = currentOrgName => {
    saveSessionItem(ORG_CHANGED, false);
    CapSnackBar.warning({
      content: (
        <CapRow>
          {formatMessage(messages.orgChangedText)}
          <InlineHeading type="h3">
            {formatMessage(messages.newOrgName, {
              newOrgName: currentOrgName,
            })}
          </InlineHeading>
        </CapRow>
      ),
      showCloseIcon: true,
    });
  };

  const handleStorageChange = event => {
    const { oldValue, newValue } = event;
    if (utilsHandleStorageChange(event, 'orgID')) {
      const localStorageOrgInfo = { oldValue, newValue };
      setShowRefreshModal(true);
      handleVisibilityChange();
      setLocalStorageOrgInfo(localStorageOrgInfo);
    }
  };

  const orgChangeAddEventListener = () => {
    window.addEventListener('pageshow', logNewTab);
    window.addEventListener('pagehide', tabBeforeUnloadEventHandler);
    window.addEventListener('storage', handleStorageChange);
  };

  const orgChangeRemoveEventListener = () => {
    window.removeEventListener('pageshow', logNewTab);
    window.removeEventListener('pagehide', tabBeforeUnloadEventHandler);
    window.removeEventListener('storage', handleStorageChange);
  };

  const handleVisibilityChange = () => {
    const isHiddenDoc = document.hidden;
    let refreshSecondsCache = refreshSeconds;
    if (
      !isHiddenDoc &&
      showRefreshModal &&
      refreshSecondsCache === ORG_REFRESH_SEC
    ) {
      setRefreshSeconds(--refreshSecondsCache);
      const timer = setInterval(() => {
        setRefreshSeconds(--refreshSecondsCache);
      }, 1000);
      setTimeout(() => {
        clearInterval(timer);
        saveSessionItem(ORG_CHANGED, true);
        navigateToDashboard();
      }, (ORG_REFRESH_SEC - 1) * 1000);
    }
  };

  const getOrgNameFromId = orgId => {
    const {
      user: {
        proxyOrgList = [],
        orgName: defaultOrgName,
        orgID: defaultOrgID,
      } = {},
    } = userData;
    return utilsGetOrgNameFromId(
      orgId,
      proxyOrgList,
      defaultOrgID,
      defaultOrgName,
    );
  };

  const renderOrgRefreshModal = () => {
    const { oldValue: oldOrgId, newValue: newOrgId } = localStorageOrgInfo;
    const oldOrgName = getOrgNameFromId(Number(oldOrgId));
    const newOrgName = getOrgNameFromId(Number(newOrgId));
    handleVisibilityChange();
    return (
      <CapModal
        className={className}
        title={formatMessage(messages.orgRefreshText)}
        visible={showRefreshModal}
        closable={false}
        centered
        maskClosable={false}
        footer={null}
      >
        <CapRow className="modal-body">
          <FormattedHTMLMessage
            {...messages.refreshOrgText}
            values={{ oldOrgName, newOrgName }}
          />
          <CapRow className="content seconds-right">
            {`${formatMessage(messages.refreshText, {
              time: `${refreshSeconds}s`,
            })}...`}
          </CapRow>
        </CapRow>
      </CapModal>
    );
  };

  const handleOrgChangeOk = () => {
    if (selectedOrgId !== null) {
      changeOrgAction(selectedOrgId);
      closeOrgChangeModal();
    }
  };

  const closeOrgChangeModal = () => {
    setShowOrgChangeModal(false);
  };

  const renderOrgChangeModal = () => {
    const {
      currentOrgDetails: { basic_details: { name: oldOrgName } = {} } = {},
    } = userData;
    const newOrgName = getOrgNameFromId(selectedOrgId);
    return (
      <CapModal
        className={classnames(className, 'change-org-confirm')}
        title={formatMessage(globalMessages.areYouSureText)}
        visible={showOrgChangeModal}
        onOk={handleOrgChangeOk}
        onCancel={closeOrgChangeModal}
        centered
        okText={formatMessage(globalMessages.changeOk)}
        cancelText={formatMessage(globalMessages.cancel)}
      >
        <FormattedHTMLMessage
          {...messages.orgChangeText}
          values={{ oldOrgName, newOrgName }}
        />
      </CapModal>
    );
  };

  useEffect(() => {
    orgChangeAddEventListener();
    return () => {
      orgChangeRemoveEventListener();
    };
  }, []);

  useEffect(
    () => {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange,
        );
      };
    },
    [showRefreshModal, refreshSeconds],
  );

  useEffect(
    () => {
      const currentOrgName =
        userData?.currentOrgDetails?.basic_details?.name || null;
      if (currentOrgName && loadSessionItem(ORG_CHANGED)) {
        showOrgChangeSnackBar(currentOrgName);
      }
    },
    [userData],
  );

  return (
    <>
      {showRefreshModal && renderOrgRefreshModal()}
      {showOrgChangeModal && renderOrgChangeModal()}
    </>
  );
};

OrgChange.propTypes = {
  className: PropTypes.string,
  userData: PropTypes.object,
  selectedOrgId: PropTypes.any,
  changeOrgAction: PropTypes.func,
  navigateToDashboard: PropTypes.func,
  intl: intlShape.isRequired,
};

export default injectIntl(withStyles(OrgChange, styles));
