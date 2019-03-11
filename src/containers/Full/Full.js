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

// import Permission from '../Permission/';

import Dashboard from '../../views/Dashboard/';
import ShopInfo from '../../views/Shops/ShopInfo';
import Provider from '../../views/Provider';
import PromotionList from '../../views/Promotions/PromotionList';
import PromotionForm from '../../views/Promotions/PromotionForm';
import Employees from '../../views/Employees/Employees';
import EmployeeUpdate from '../../views/Employees/EmployeeUpdate';

import firebase from 'firebase';
import { signOut, setUserDefaultProvider } from '../../stores/user/actions';
import { fetchPromotions } from '../../stores/promotions/actions';
import { fetchUser, fetchEmployees } from '../../stores/employees/actions';
import AddEmployee from '../../views/Shops/AddEmployee';
import ShopList_new from '../../views/Shops/ShopList';
import OverlayLoader from 'react-overlay-loading/lib/OverlayLoader';
import Reports from '../../views/Reports/Reports';
import DashboardReport from '../../views/Reports/DashboardReport';
import KPIReport from '../../views/Reports/KPIReport';

import config from '../../config';
import ShowroomOrder from '../../views/Order/ShowroomOrder';
import ShowroomDetailOrder from '../../views/Order/ShowroomDetailOrder';
import Permission from '../../views/SuperUser/Permission';
import Layout from '../Layout/Layout';
import LayoutWithSideBar from '../Layout/LayoutWithSideBar';
import Cart from '../../views/Order/Cart';
import Orders from '../../views/Order/Orders';
import Customer from '../../views/Order/Customer';
import OrderManager from '../../views/Order/OrderManager';

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <Layout>
        <Component {...props} />
      </Layout>
    )}
  />
);

class Full extends Component {
  constructor(props) {
    super(props);
    this.isValidUser = false;
    this.state = {
      loading: true,
      url: '',
      isValidUser: true,
      check: false
    };
  }

  componentDidMount() {
    this.props.onFetchEmployees();
  }
  componentWillMount() { }

  componentWillReceiveProps(nextProps) {
    let { profile, uid, providers } = this.props.user;
    if (uid && profile && !profile.default_provider) {
      firebase.database().ref('users/' + uid + '/profile/default_provider');
    }
  }

  onDropDownClicked(url) {
    this.props.history.push(url);
  }

  render() {
    let { providers, user } = this.props;
    return (
      <div className="app">
        {!this.props.user.check ? (
          <OverlayLoader
            color={'red'} // default is white
            loader="ScaleLoader" // check below for more loaders
            text="Loading... Please wait!"
            active={true}
            backgroundColor={'black'} // default is black
            opacity=".4" // default is .9
          />
        ) : this.props.user.uid ? (
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
            <AppRoute
              path="/dashboard"
              name="Dashboard"
              layout={Layout}
              component={Dashboard}
            />
            <AppRoute
              layout={Layout}
              path="/su/permission"
              name="permission"
              component={Permission}
            />
            <AppRoute
              layout={Layout}
              exact
              path="/promotions"
              name="Promotion"
              component={PromotionList}
            />
            <AppRoute
              layout={Layout}
              exact
              path="/promotions/add_promotion/"
              name="Add Promotion"
              component={PromotionForm}
            />
            <AppRoute
              layout={Layout}
              path="/promotions/:promotion_id/edit"
              name="Edit Promotion"
              component={PromotionForm}
            />

            <Route path="/providers/:id" name="Provider" component={Provider} />
            <AppRoute
              layout={Layout}
              path="/reports"
              name="reports"
              component={Reports}
            />
            <Route
              path="/order/showroom"
              name="ShowroomOrder"
              component={ShowroomOrder}
            />
            <Route
              path="/order/detail"
              name="ShowroomDetailOrder"
              component={ShowroomDetailOrder}
            />
            <AppRoute
              layout={LayoutWithSideBar}
              exact
              path="/shops"
              name="Shops"
              component={ShopInfo}
            />
            <AppRoute
              layout={LayoutWithSideBar}
              exact
              path="/shops/:shopId"
              name="ShopEmployees"
              component={Employees}
            />
            <AppRoute
              layout={LayoutWithSideBar}
              exact
              path="/employees"
              name="Employees"
              component={Employees}
            />
            <AppRoute
              layout={LayoutWithSideBar}
              exact
              path="/add_employee"
              name="Add Employee"
              component={AddEmployee}
            />
            <AppRoute
              layout={LayoutWithSideBar}
              exact
              path="/shops/:shop_id/employees/:employee_id/edit"
              name="Employees"
              component={EmployeeUpdate}
            />
            <AppRoute
              layout={LayoutWithSideBar}
              exact
              path="/employees/:employee_id"
              name="Employees"
              component={EmployeeUpdate}
            />
            <AppRoute
              layout={LayoutWithSideBar}
              exact
              path="/employees/new"
              name="Employees"
              render={props => (
                <EmployeeUpdate
                  shops={this.props.shops}
                  employees={this.props.employees}
                />
              )}
            />
            <AppRoute
              layout={Layout}
              path="/su/*"
              name="Permission"
              component={Permission}
            />

            <AppRoute
              layout={Layout}
              path="/order/showroom"
              name="ShowroomOrder"
              component={ShowroomOrder}
            />
            <AppRoute
              layout={Layout}
              path="/showroom/detail"
              name="ShowroomDetailOrder"
              component={ShowroomDetailOrder}
            />
            <Route
              exact
              path="/order"
              name="OrderManager"
              render={props => (
                <Layout chooseShop>
                  <OrderManager /> />
                </Layout>
              )}
            />
            <AppRoute
              layout={Layout}
              path="/dashboard_report"
              name="DashboardReport"
              component={DashboardReport}
            />
            <AppRoute
              layout={Layout}
              path="/kpi_report"
              name="KPIReport"
              component={KPIReport}
            />
          </Switch>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Full));
