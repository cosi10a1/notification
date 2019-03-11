import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Switch, Route, Redirect, NavLink } from 'react-router-dom';
import { Container } from 'reactstrap';
import cookie from 'react-cookies';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import { signOut } from '../../stores/user/actions';
import firebase from 'firebase';

class LayoutWithSideBar extends Component {
  render() {
    let { providers, user } = this.props;

    return (
      <div>
        <Header
          provider={
            user.profile && providers[user.profile.default_provider]
              ? providers[user.profile.default_provider].name
              : ''
          }
          signOut={() =>
            this.props.signOut().then(() => {
              return firebase.auth().signOut();
            })
          }
          chooseShop
        />
        <div className="app-body">
          <Sidebar />

          <main className="main">{this.props.children}</main>
        </div>
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
  connect(mapStateToProps, mapDispatchToProps)(LayoutWithSideBar)
);
