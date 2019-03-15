import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import cookie from 'react-cookies';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// Styles
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss';
// Temp fix for reactstrap
import '../scss/core/_dropdown-menu-right.scss';

// Redux
import configureStore from './stores/configureStore';

// Containers
import App from './App';
import Login from './views/Pages/Login/Login';

// Services
import firebase from 'firebase';

// Actions
import { setAuthenticatedUser } from './stores/user/actions';
import { syncFirebaseData } from './stores/actions';
import { verify_sso, verify_accessToken } from './helpers/verify_sso';
import * as types from './stores/user/action-types';
import config from './config';
import createHistory from 'history/createHashHistory';
import dataProviderFactory from './dataProvider';
import authProvider from './authProvider';
import restProvider from 'ra-data-simple-rest';
import { resolve } from 'q';



// import * as admin from 'firebase-admin';
// const dataProvider = restProvider('http://path.to.my.api/');


const history = createHistory();
const i18nProvider = locale => {
  if (locale === 'fr') {
    return import('./i18n/fr').then(messages => messages.default);
  }

  // Always fallback on english
  return englishMessages;
};


class Root extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    firebase.initializeApp(config.firebase_config);
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          let access_token = cookie.load('_uat');
          if (access_token) {
            this.props.dispatch(verify_accessToken(access_token, user));
          } else {
            let idToken = localStorage.getItem('idToken', '');
            if (idToken) {
              this.props.dispatch(verify_sso(idToken, user));
            } else {
              firebase.auth().signOut();
              this.props.dispatch({ type: types.FORCE_RELOGIN });
            }
          }
        } else {
          this.props.dispatch({ type: types.FORCE_RELOGIN });
        }
      }.bind(this)
    );
  }

  render() {
    return (
      <BrowserRouter basename={'#'}>
        <Switch>
          <Route exact path="/login" name="Login Page" component={Login} />
          <Route path="/" name="Home" render={(props)=><App {...props} history={history}/>}  />
        </Switch>
      </BrowserRouter>
    );
  }
}

const RootWithState = connect()(Root);

ReactDOM.render(
  <Provider store={configureStore(() => Promise.resolve(),dataProviderFactory('rest'),i18nProvider, history,)}>
    <RootWithState />
  </Provider>,
  document.getElementById('root')
);
