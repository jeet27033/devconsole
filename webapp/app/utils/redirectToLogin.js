import { EXTERNAL } from '../components/pages/App/constants';
import { loginPageUrl } from "../config/path";
import { prefix, appType, appName } from '../../app-config';

const redirectToLogin = (history) => {
  const loginStateUrl = loginPageUrl();
  const isEmbedded = 
    appType !== EXTERNAL && 
    process.env.NODE_ENV === 'production' && 
    localStorage.getItem(`${appName}__isStandalone`) !== 'true';
  if (isEmbedded) {
    // changing window location href as app is embedded in Intouch UI
    window.location.href = loginStateUrl;
  } else {
    // setting login URL to history and navigating via router as app is in standalone mode
    history.push(loginStateUrl.replace(prefix, ''));
  }
};

export default redirectToLogin;
