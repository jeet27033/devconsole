import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose, bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { InternalIntouchLogin } from '@capillarytech/vulcan-react-sdk/components';
import endpoints from '../../../config/endpoints';
import * as actions from './actions';
import messages from './messages';
import { userIsNotAuthenticated } from '../../../utils/authWrapper';
import PageTemplate from '../../templates/PageTemplate';

const Login = (props) => {
  const { actions, intl: { formatMessage } = {}, history } = props;
  const { loginSuccess, loginFailure } = actions;
  const onSuccess = (response) => {
    loginSuccess(response);
    history.push('/');
  };
  const onFailure = (err) => {
    loginFailure(err);
  };

  return (
    <>
      <FormattedMessage {...messages.login}>
        {(message) => (
          <Helmet
            title={message}
            meta={[
              {
                name: 'description',
                content: <FormattedMessage {...messages.loginPage} />,
              },
            ]}
          />
        )}
      </FormattedMessage>
      <InternalIntouchLogin
        signInLabel={formatMessage(messages.signIn)}
        userNameLabel={formatMessage(messages.userName)}
        passwordLabel={formatMessage(messages.password)}
        apiEndPoint={`${endpoints.arya_endpoint}/auth/login`}
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

const withConnect = connect(null, mapDispatchToProps);

export default compose.apply(null, [
  withRouter,
  userIsNotAuthenticated,
  withConnect,
])(injectIntl(Login));
