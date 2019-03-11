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
import moment from 'moment';
import Select from 'react-select';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import numeral from 'numeral';
import firebase from 'firebase';

class Cart extends Component {
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
    this.cellEditProp = {
      mode: 'click',
      blurToSave: true,
      afterSaveCell: this.handleChangeDiscount.bind(this)
    };
    this.state = {
      cart_id: '',
      store_id: '',
      toggle: false,
      sku: '',
      orderlines: []
    };
    this.handleChangeDiscount = this.handleChangeDiscount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateOrderlines = this.updateOrderlines.bind(this);
    this.handleDeleteProduct = this.handleDeleteProduct.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let uid = this.props.user.uid;
    let temp_orderlines = [];
    let temp_note = [];

    let cart_id = '';
    let store_id = '';
    let currentShop = nextProps.user.profile.default_shop;
    let user_shop_index = nextProps.shops.findIndex(
      x => x.shop_id === currentShop
    );
    if (user_shop_index !== -1) {
      store_id = nextProps.shops[user_shop_index].profile.store_id;
    }
    if (nextProps.carts != undefined) {
      Object.entries(nextProps.carts).map(function([key, value]) {
        if (value.status.state == 2 && value.status.cashier_id == uid) {
          temp_orderlines = value.orderlines;
          temp_note = value.note;
          cart_id = key;
        }
      });
      this.setState({
        orderlines: temp_orderlines,
        note: temp_note,
        cart_id: cart_id,
        store_id: store_id
      });
    }
  }

  handleChangeDiscount(row, cellName, cellValue) {
    let updateOrderlines = this.state.orderlines;
    let index = updateOrderlines.findIndex(x => x.product == row.product);

    updateOrderlines[index][cellName] = numeral(cellValue).value();
    updateOrderlines[index].price =
      updateOrderlines[index].quantity * updateOrderlines[index].unit_price -
      updateOrderlines[index].quantity * updateOrderlines[index].discount;
    this.setState({ orderlines: updateOrderlines });
    this.updateOrderlines(this.state.orderlines);
  }

  handleChange(row, type, e) {
    let updateOrderlines = this.state.orderlines;
    let index = updateOrderlines.findIndex(x => x.product == row.product);
    if (type == 'add') {
      updateOrderlines[index].quantity += 1;
    } else {
      if (updateOrderlines[index].quantity > 0) {
        updateOrderlines[index].quantity -= 1;
      }
    }
    updateOrderlines[index].price =
      updateOrderlines[index].quantity * updateOrderlines[index].unit_price -
      updateOrderlines[index].quantity * updateOrderlines[index].discount;
    this.setState({ orderlines: updateOrderlines });
    this.updateOrderlines(this.state.orderlines);
  }

  handleDeleteProduct(row) {
    let updateOrderlines = this.state.orderlines.filter(
      x => x.product != row.product
    );
    this.setState({ orderlines: updateOrderlines });
    this.updateOrderlines(this.state.orderlines);
  }

  updateOrderlines(orderlines) {
    firebase
      .database()
      .ref(
        'carts/' +
          this.state.store_id +
          '/' +
          this.state.cart_id +
          '/orderlines'
      )
      .update(orderlines);
  }

  render() {
    let price_total = 0;
    this.state.orderlines.map(item => (price_total += item.price));
    return (
      // <div className="animated fadeIn" style={{ margin: '10px' }}>
      <Card>
        <Card style={{ marginBottom: '0px' }}>
          {/* <CardHeader>
            <Col md="5">
              <InputGroup>
                <Input
                  type="text"
                  // size="md"
                  placeholder="Nhập thông tin sản phẩm"
                />
                <Button type="submit">
                  <i className="fa fa-search" />
                </Button>
              </InputGroup>
            </Col>
          </CardHeader> */}
          <CardBody>
            <BootstrapTable
              data={this.state.orderlines}
              version="4"
              pagination
              search={false}
              bordered={false}
              options={this.options}
              cellEdit={this.cellEditProp}
            >
              <TableHeaderColumn
                isKey={true}
                dataField="product"
                // width="10px"
                dataFormat={(cell, row, formatExtraData, index) => {
                  return (
                    <Label>
                      <strong>{cell}</strong>
                    </Label>
                  );
                }}
              >
                Mã hàng
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField=""
                dataSort
                // width="30px"
                editable={false}
              >
                Tên hàng
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField=""
                dataSort
                // width="30px"
                editable={false}
              >
                % Thuế
              </TableHeaderColumn>

              <TableHeaderColumn
                dataField=""
                dataSort
                // width="30px"
                editable={false}
              >
                Tổng tồn
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField=""
                dataSort
                // width="30px"
                editable={false}
              >
                Mã kho
              </TableHeaderColumn>

              <TableHeaderColumn
                dataField=""
                dataSort
                // width="30px"
                editable={false}
              >
                Tồn kho
              </TableHeaderColumn>

              <TableHeaderColumn
                dataField="quantity"
                dataSort
                // width="16px"
                editable={false}
                dataFormat={(cell, row, formatExtraData, index) => {
                  return (
                    <InputGroup>
                      <Button
                        type="submit"
                        bssize="sm"
                        color="light"
                        onClick={() => this.handleChange(row, 'sub')}
                      >
                        <i className="fa fa-window-minimize" />
                      </Button>
                      <Input type="text" value={cell} size="sm" />
                      <Button
                        type="submit"
                        bssize="sm"
                        color="light"
                        onClick={() => this.handleChange(row, 'add')}
                      >
                        <i className="fa fa-plus" />
                      </Button>
                    </InputGroup>
                  );
                }}
              >
                SL
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField=""
                // width="10px"
                editable={false}
                dataFormat={(cell, row, formatExtraData, index) => {
                  return <Label>{numeral(cell).format('0,0')}</Label>;
                }}
              >
                Báo giá
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField=""
                dataSort
                // width="30px"
                editable={false}
              >
                Thuế
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="discount"
                dataSort
                // width="15px"
                dataFormat={(cell, row, formatExtraData, index) => {
                  return (
                    <Input
                      type="text"
                      value={numeral(cell).format('0,0')}
                      size="sm"
                      style={{ justifyContent: 'right' }}
                    />
                  );
                }}
              >
                Giảm giá
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="unit_price"
                dataSort
                // width="15px"
                editable={false}
                dataFormat={(cell, row, formatExtraData, index) => {
                  return <Label>{numeral(cell).format('0,0')}</Label>;
                }}
              >
                Giá bán
              </TableHeaderColumn>

              <TableHeaderColumn
                dataField="price"
                dataSort
                // width="15px"
                editable={false}
                dataFormat={(cell, row, formatExtraData, index) => {
                  return <Label>{numeral(cell).format('0,0')}</Label>;
                }}
              >
                Thành tiền
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField=""
                // width="5px"
                dataFormat={(cell, row, formatExtraData, index) => {
                  return (
                    <Button
                      type="submit"
                      bssize="lg"
                      style={{ backgroundColor: 'white', border: '0 none' }}
                      onClick={() => this.handleDeleteProduct(row)}
                    >
                      <i className="fa fa-trash" />
                    </Button>
                  );
                }}
              />
            </BootstrapTable>
          </CardBody>
        </Card>

        <Card style={{ marginBottom: '0px' }}>
          <CardBody>
            <FormGroup row>
              <Col md="10">
                <Label>
                  <strong>TỔNG TIỀN:</strong>
                </Label>
              </Col>
              <Col xs="12" md="2">
                <Label>
                  <strong>{numeral(price_total).format('0,0')} VNĐ</strong>
                </Label>
              </Col>
            </FormGroup>
          </CardBody>
        </Card>
      </Card>
      // </div>
    );
  }
}

const mapStateToProps = state => ({
  shops: state.shops.shopsList,
  user: state.user
});

export default withRouter(connect(mapStateToProps, null)(Cart));
