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
  Label,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import firebase from 'firebase';
import moment from 'moment';
import Select from 'react-select';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import FilteredMultiSelect from 'react-filtered-multiselect';

const BOOTSTRAP_CLASSES = {
  filter: 'form-control',
  select: 'form-control',
  button: 'btn btn btn-block btn-default',
  buttonActive: 'btn btn btn-block btn-primary'
};

class Orders extends Component {
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
    this.state = {
      carts: [],
      selectedCart: [],
      note: [],
      temp_note: []
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.getCarts = this.getCarts.bind(this);
    this.getSelectedCart = this.getSelectedCart.bind(this);
    this.handleChangeNoteInput = this.handleChangeNoteInput.bind(this);
  }

  getCarts(nextPropsCarts) {
    let carts = [];
    let store_id = '';
    let currentShop = this.props.user.profile.default_shop;
    let user_shop_index = this.props.shops.findIndex(
      x => x.shop_id === currentShop
    );
    if (user_shop_index !== -1) {
      store_id = this.props.shops[user_shop_index].profile.store_id;
    }
    Object.entries(nextPropsCarts).map(function([key, value]) {
      if (value.status.state == 1) {
        let cart = value.customer;
        cart.id = key;
        cart.store_id = store_id;
        carts.push(cart);
      }
    });
    return carts;
  }

  getSelectedCart(nextPropsCarts) {
    let uid = this.props.user.uid;
    let selectedCart = [];
    let temp_note = [];
    let store_id = '';
    let currentShop = this.props.user.profile.default_shop;
    let user_shop_index = this.props.shops.findIndex(
      x => x.shop_id === currentShop
    );
    if (user_shop_index !== -1) {
      store_id = this.props.shops[user_shop_index].profile.store_id;
    }
    Object.entries(nextPropsCarts).map(function([key, value]) {
      if (value.status.state == 2 && value.status.cashier_id == uid) {
        let cart = value.customer;
        temp_note = value.note;
        cart.id = key;
        cart.store_id = store_id;
        selectedCart.push(cart);
      }
    });
    return [selectedCart, temp_note];
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.carts != nextProps.carts) {
      this.setState({
        carts: this.getCarts(nextProps.carts),
        selectedCart: this.getSelectedCart(nextProps.carts)[0],
        note: this.getSelectedCart(nextProps.carts)[1]
      });
    }
  }

  handleSelect(selectedCart) {
    let cart = this.state.carts.find(item => item.id == selectedCart[0].id);
    let index = this.state.carts.indexOf(cart);
    this.setState({
      carts: this.state.carts.filter(
        c => !selectedCart.filter(c1 => c1.id == c.id).length
      ),
      selectedCart: this.state.carts.filter(
        item => item.id == selectedCart[0].id
      )
    });
    firebase
      .database()
      .ref('carts/' + cart.store_id + '/' + cart.id + '/status/state')
      .set(2);
    firebase
      .database()
      .ref('carts/' + cart.store_id + '/' + cart.id + '/status/cashier_id')
      .set(this.props.user.uid);
  }

  handleCancel(cancelledCart) {
    let cart = cancelledCart[0];
    this.setState({ selectedCart: [] });
    firebase
      .database()
      .ref('carts/' + cart.store_id + '/' + cart.id + '/status/state')
      .set(1);
    firebase
      .database()
      .ref('carts/' + cart.store_id + '/' + cart.id + '/status')
      .child('cashier_id')
      .remove();
  }

  handleChangeNoteInput(e) {
    let updateNote = Array.from(this.state.note);
    updateNote.push({
      user: this.props.user.profile.email,
      content: e.target.value,
      time: Date.now()
    });
    this.setState({ temp_note: updateNote });
  }

  handleSubmitNote() {
    firebase
      .database()
      .ref(
        'carts/' +
          this.state.selectedCart.store_id +
          '/' +
          this.state.selectedCart.cart_id +
          '/note'
      )
      .update(this.state.temp_note);
  }

  render() {
    let note = this.state.note.map(item => {
      let time = moment(item.time).format('DD/MM/YYYY hh:mm:ss');
      return (
        <p>
          <strong style={{ color: '#365899' }}>{item.user}</strong>:{'\n'}
          {item.content}
          {'\n'}
          <i style={{ color: 'grey', fontSize: '0.65rem' }}>{time}</i>
          {'\n'}
        </p>
      );
    });
    return (
      <div className="animated fadeIn" style={{ margin: '10px' }}>
        <Card>
          <Card style={{ marginBottom: '0px' }}>
            <CardHeader>
              <strong>ĐƠN HÀNG CHỜ XỬ LÝ</strong>
            </CardHeader>
            <CardBody style={{ padding: '0px' }}>
              <FilteredMultiSelect
                buttonText=""
                buttonActive={false}
                placeholder="Tìm kiếm ..."
                classNames={BOOTSTRAP_CLASSES}
                options={this.state.carts}
                onChange={this.handleSelect}
                textProp="name"
                valueProp="id"
                size={25}
              />
            </CardBody>
          </Card>

          <Card style={{ marginBottom: '0px' }}>
            <CardHeader>
              <strong>ĐƠN HÀNG ĐANG XỬ LÝ</strong>
            </CardHeader>
            <CardBody style={{ padding: '0px' }}>
              <FilteredMultiSelect
                buttonText=""
                buttonActive={false}
                classNames={BOOTSTRAP_CLASSES}
                options={this.state.selectedCart}
                onChange={this.handleCancel}
                textProp="name"
                valueProp="id"
                showFilter={false}
                // size={10}
              />
            </CardBody>
          </Card>
          <Card
            style={{
              padding: '1.25rem',
              marginBottom: '0px',
              backgroundColor: '#f0f3f5'
            }}
          >
            <CardBody>
              <div>{note}</div>
              <div>
                <form>
                  <InputGroup>
                    <Input
                      style={{ borderRadius: '2px' }}
                      type="text"
                      placeholder="Ghi chú ..."
                      onChange={e => this.handleChangeNoteInput(e)}
                    />
                    <button
                      type="submit"
                      style={{
                        color: 'white',
                        fontSize: '0.65rem',
                        backgroundColor: '#4267b2',
                        borderRadius: '2px'
                      }}
                      onClick={this.handleSubmitNote}
                    >
                      <strong>Post</strong>
                    </button>
                  </InputGroup>
                </form>
              </div>
            </CardBody>
          </Card>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  shops: state.shops.shopsList,
  user: state.user
});

export default withRouter(connect(mapStateToProps, null)(Orders));
