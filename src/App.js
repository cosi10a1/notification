import React, { Component } from 'react';
import { Admin, Resource } from 'react-admin';
import { withRouter, Switch, Route, Redirect, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';

import authProvider from './authProvider';
import themeReducer from './themeReducer';
import { Login, Layout, Menu } from './layout';
import { Dashboard } from './dashboard';
import customRoutes from './routes';
import englishMessages from './i18n/en';

import notifications from './notifications';

import dataProviderFactory from './dataProvider';
import fakeServerFactory from './fakeServer';
import { signOut } from './stores/user/actions';
import { fetchEmployees } from './stores/employees/actions';
import Logout from './layout/Logout';
import categories from './categories';

const i18nProvider = locale => {
  if (locale === 'fr') {
    return import('./i18n/fr').then(messages => messages.default);
  }

  // Always fallback on english
  return englishMessages;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // dataProvider: null
    };
  }

  async componentWillMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className="app">
        {!this.props.user.check ? (
          <div className="loader-container">
            <div className="loader">Loading...</div>
          </div>
        ) : this.props.user.uid ? (
          <Admin
            title=""
            // dataProvider={dataProvider}
            customReducers={{ theme: themeReducer }}
            customRoutes={customRoutes}
            authProvider={() => Promise.resolve()}
            dashboard={Dashboard}
            loginPage={Login}
            appLayout={Layout}
            logoutButton={Logout}
            menu={Menu}
            locale="en"
            i18nProvider={i18nProvider}
            history={this.props.history}
          >
            <Resource name="notifications" {...notifications} />
          </Admin>
        ) : (
          <Redirect from="/" to="/login" />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  providers: state.providers,
  shops: state.shops.shops,
  employees: state.employees
});

const mapDispatchToProps = dispatch => {
  return {
    onFetchEmployees: () => dispatch(fetchEmployees()),
    signOut: () => dispatch(signOut())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
