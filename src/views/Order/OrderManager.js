import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withRouter,
  Switch,
  Route,
  Redirect,
  NavLink,
  Link
} from 'react-router-dom';
import {
  Container,
  Badge,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Input,
  InputGroup,
  CardBlock,
  Button,
  Form,
  FormGroup,
  Label
} from 'reactstrap';
import firebase from 'firebase';
import Select from 'react-select';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Orders from '../Order/Orders';
import Cart from '../Order/Cart';
import Customer from '../Order/Customer';
import { syncCartsFromFirebase } from '../../stores/actions';
import * as PermissionConstants from '../../constants/PermissionConstants';
import OverlayLoader from 'react-overlay-loading/lib/OverlayLoader';
import Page403 from '../Pages/403/403';
import * as PermissionHelpers from '../../helpers/permission-helpers';
class OrderManager extends Component {
  constructor(props) {
    super(props);
    this.options = {
      sortIndicator: true,
      hideSizePerPage: true,
      paginationSize: 3,
      hidePageListOnlyOnePage: true,
      clearSearch: true,
      alwaysShowAllBtns: false,
      withFirstAndLast: false
    };
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.shop != this.props.shop) {
      firebase
        .database()
        .ref('/users/' + this.props.user.uid + '/profile/default_shop')
        .set(nextProps.shop);
    }
    if (
      (nextProps.user.profile &&
        nextProps.shops.length > this.props.shops.length) ||
      nextProps.shop != this.props.shop
    ) {
      this.props.dispatch(syncCartsFromFirebase());
    }
  }

  handleClick() {
    this.setState({
      openDelivery: !this.state.openDelivery
    });
  }

  render() {
    let { user, shop } = this.props;
    return !user.profile || !shop ? (
      <Container fluid>
        <div className="row justify-content-center">
          <div className="col col-lg-8 text-center">
            <OverlayLoader
              color={'red'} // default is white
              loader="ScaleLoader" // check below for more loaders
              text="Loading... Please wait!"
              active={true}
              backgroundColor={'black'} // default is black
              opacity=".4" // default is .9
            />
          </div>
        </div>
      </Container>
    ) : PermissionHelpers.havePermission(
      user,
      PermissionConstants.VIEW_CART,
      shop
    ) ? (
      <div className="animated fadeIn" style={{ margin: '10px' }}>
        <Row>
          <Col md="2" style={{ padding: '0px' }}>
            <Orders carts={this.props.carts} />
          </Col>
          <Col xs="12" md="10" style={{ padding: '0px' }}>
            <Customer carts={this.props.carts ? this.props.carts : {}} />
          </Col>
        </Row>
      </div>
    ) : (
      <Page403 />
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  shops: state.shops.shopsList,
  carts: state.order.carts,
  shop: state.shops.currentShop
});

export default withRouter(connect(mapStateToProps, null)(OrderManager));
