import React, { Component } from 'react';
import { Admin, Resource } from 'react-admin';
import { withRouter, Switch, Route, Redirect, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';

import authProvider from './authProvider';
import sagas from './sagas';
import themeReducer from './themeReducer';
import { Login, Layout, Menu } from './layout';
import { Dashboard } from './dashboard';
import customRoutes from './routes';
import englishMessages from './i18n/en';

import visitors from './visitors';
import orders from './orders';
import products from './products';
import invoices from './invoices';
import categories from './categories';
import reviews from './reviews';

import dataProviderFactory from './dataProvider';
import fakeServerFactory from './fakeServer';
import { createBrowserHistory } from 'history';
import { signOut } from './stores/user/actions';
import { fetchEmployees } from './stores/employees/actions';

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
      dataProvider: null
    };
  }

  async componentWillMount() {
    this.restoreFetch = await fakeServerFactory('rest');

    const dataProvider = await dataProviderFactory('rest');

    this.setState({ dataProvider });
  }

  componentWillUnmount() {
    this.restoreFetch();
  }

  render() {
    const { dataProvider } = this.state;

    if (!dataProvider) {
      return (
        <div className="loader-container">
          <div className="loader">Loading...</div>
        </div>
      );
    }

    return (
        <Admin
            title=""
            // dataProvider={dataProvider}
            customReducers={{ theme: themeReducer }}
            customSagas={sagas}
            customRoutes={customRoutes}
            // authProvider={authProvider}
            dashboard={Dashboard}
            loginPage={Login}
            appLayout={Layout}
            menu={Menu}
            locale="en"
            i18nProvider={i18nProvider}
            history = {createBrowserHistory()}
        >
            <Resource name="customers" {...visitors} />
            <Resource
                name="commands"
                {...orders}
                options={{ label: 'Orders' }}
            />
            <Resource name="invoices" {...invoices} />
            <Resource name="products" {...products} />
            <Resource name="categories" {...categories} />
            <Resource name="reviews" {...reviews} />
        </Admin>
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
