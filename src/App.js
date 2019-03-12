import React, { Component } from 'react';
import { Admin, Resource } from 'react-admin';

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
import { createBrowserHistory } from 'history';

import dataProviderFactory from './dataProvider';
// import fakeServerFactory from './fakeServer';

const i18nProvider = locale => {
  // if (locale === 'fr') {
  //   return import('./i18n/fr').then(messages => messages.default);
  // }

  // Always fallback on english
  return englishMessages;
};

class App extends Component {
  // state = { dataProvider: null };
  constructor(props){
    super(props);
    this.state={dataProvider:null};
  }

  async componentWillMount() {
    const dataProvider = await dataProviderFactory(
     'rest'
    );
    this.setState({ dataProvider });
    // this.restoreFetch = await fakeServerFactory(
    //     'rest'
    // );

  }

  componentWillUnmount() {
    // this.restoreFetch();
  }

  render() {
    return (
      <Admin
        title=""
        dataProvider={this.state.dataProvider}
        customReducers={{ theme: themeReducer }}
        customSagas={sagas}
        customRoutes={customRoutes}
        authProvider={authProvider}
        dashboard={Dashboard}
        loginPage={Login}
        history={createBrowserHistory()}
        appLayout={Layout}
        menu={Menu}
        locale="en"
        i18nProvider={i18nProvider}
      >
        <Resource name="Notifications" {...visitors} />
        <Resource name="commands" {...orders} options={{ label: 'Orders' }} />
        <Resource name="invoices" {...invoices} />
        <Resource name="products" {...products} />
        <Resource name="categories" {...categories} />
        <Resource name="reviews" {...reviews} />
      </Admin>
    );
  }
}

export default App;
