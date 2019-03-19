import React, { Component } from 'react';
import { GET_LIST, GET_MANY, Responsive } from 'react-admin';

import dataProviderFactory from '../dataProvider';
import Page403 from '../views/Pages/403/403'

const styles = {
  flex: { display: 'flex' },
  flexColumn: { display: 'flex', flexDirection: 'column' },
  leftCol: { flex: 1, marginRight: '1em' },
  rightCol: { flex: 1, marginLeft: '1em' },
  singleCol: { marginTop: '2em', marginBottom: '2em' }
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }

  render() {
    return <Responsive medium={<Page403 pageTitle="403 Fobiden" pageContent="Tính năng đang trong quá trình phát triển"/>} />;
  }
}

export default Dashboard;
