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
import store from './stores/configureStore';

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
// import * as admin from 'firebase-admin';

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
          <Route path="/" name="Home" component={App} />
        </Switch>
      </BrowserRouter>
    );
  }
}

const RootWithState = connect()(Root);

ReactDOM.render(
  <Provider store={store}>
    <RootWithState />
  </Provider>,
  document.getElementById('root')
);
