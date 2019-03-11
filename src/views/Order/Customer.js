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
import numeral from 'numeral';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './customer.css';
import Cart from '../Order/Cart';
import {
  fetchProvince,
  fetchDistrict,
  fetchCommune
} from '../../stores/carts/actions';

class Customer extends Component {
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
      carts: {},
      customer: {},
      delivery: {},
      order: {},
      payment: {},
      status: 0,
      cart_id: '',
      store_id: '',
      openDelivery: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChangeCustomer = this.handleChangeCustomer.bind(this);
    this.handleChangeDelivery = this.handleChangeDelivery.bind(this);
    this.handleChangeOrder = this.handleChangeOrder.bind(this);
    this.handleChangePayment = this.handleChangePayment.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.submitCustomerData = this.submitCustomerData.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.convertData = this.convertData.bind(this);
  }

  componentDidMount() {
    this.props.onFetchDistricts();
    this.props.onFetchProvinces();
    this.props.onFetchCommunes();
  }

  componentWillReceiveProps(nextProps) {
    let carts = {};
    let cart_id = '';
    let store_id = '';
    let currentShop = nextProps.user.profile.default_shop;
    let user_shop_index = nextProps.shops.findIndex(
      x => x.shop_id === currentShop
    );
    if (user_shop_index !== -1) {
      store_id = nextProps.shops[user_shop_index].profile.store_id;
    }

    let uid = this.props.user.uid;
    let customer = {};
    let delivery = {};
    let order = {};
    let payment = {};
    if (nextProps.carts != undefined) {
      carts = nextProps.carts;
      Object.entries(nextProps.carts).map(function([key, value]) {
        if (value.status.state == 2 && value.status.cashier_id == uid) {
          customer = value.info.customer;
          delivery = value.info.delivery;
          order = value.info.order;
          payment = value.info.payment;
          status = value.status.state;
          cart_id = key;
        }
      });
      this.setState({
        carts: carts,
        customer: customer,
        delivery: delivery,
        order: order,
        payment: payment,
        status: status,
        cart_id: cart_id,
        store_id: store_id
      });
    }
  }

  handleClick() {
    this.setState({
      openDelivery: !this.state.openDelivery
    });
  }

  handleChangeCustomer(field, e) {
    let updateCustomer = this.state.customer;
    updateCustomer[field] = e.target.value;
    this.setState({ customer: updateCustomer });
  }

  handleChangeDelivery(field, e) {
    let updateDelivery = this.state.delivery;
    updateDelivery[field] = e.target.value;
    this.setState({ delivery: updateDelivery });
  }

  handleSelectChange(field, data) {
    let updateDelivery = this.state.delivery;
    updateDelivery[field] = data.value;
    this.setState({ delivery: updateDelivery });
  }

  handleChangeOrder(field, e) {
    let updateOrder = this.state.order;
    updateOrder[field] = e.target.value;
    this.setState({ order: updateOrder });
  }

  handleCheckedChange(field, e) {
    let updateOrder = this.state.order;
    updateOrder[field] = e.target.checked;
    this.setState({ order: updateOrder });
  }

  handleRadioChange(field1, field2, value) {
    let updateItem = field1 == 'order' ? this.state.order : this.state.payment;
    updateItem[field2] = value;
    field1 == 'order'
      ? this.setState({ order: updateItem })
      : this.setState({ payment: updateItem });
  }

  handleChangePayment(field, e) {
    let value = e.target.value;
    if (value.indexOf(',') > -1) {
      value = numeral(value)
        .value()
        .toString();
    }
    let updatePayment = this.state.payment;
    updatePayment[field] = value;
    this.setState({ payment: updatePayment });
  }

  handleDateChange(payment_terms) {}

  submitCustomerData(e) {
    e.preventDefault();
    let info = {};
    info.customer = this.state.customer;
    info.delivery = this.state.delivery;
    info.order = this.state.order;
    info.payment = this.state.payment;
    firebase
      .database()
      .ref('carts/' + this.state.store_id + '/' + this.state.cart_id + '/info')
      .update(info);
  }

  convertData(data) {
    let convertedData = [];
    data.map(item => {
      convertedData.push({
        label: item.name,
        value: item.id
      });
    });
    return convertedData;
  }

  render() {
    let provinceData = this.convertData(this.props.provinces);
    let districtData = this.convertData(
      this.props.districts.filter(
        x => x.province_id == this.state.delivery.province
      )
    );
    let communeData = this.convertData(
      this.props.communes.filter(
        x => x.district_id == this.state.delivery.district
      )
    );
    let current_date = new Date().toLocaleDateString('en-GB');
    return (
      <div className="animated fadeIn" style={{ margin: '10px' }}>
        <Card>
          <CardHeader>
            <strong>THÔNG TIN ĐƠN HÀNG</strong>
          </CardHeader>
          <CardBody>
            <Form
              className="form-horizontal"
              onSubmit={this.submitCustomerData}
            >
              <FormGroup row>
                <Col xs="2" md="1">
                  <Label className="bottomLabel" htmlFor="prependedInput">
                    Đơn vị mua
                  </Label>
                </Col>
                <Col xs="2" md="1">
                  <Input
                    className="line_input"
                    type="text"
                    value={this.state.customer.company}
                    onChange={e => this.handleChangeCustomer('company', e)}
                  />
                </Col>
                <Col xs="4" md="4" />
                <Col xs="3" md="1">
                  <Label className="bottomLabel" htmlFor="prependedInput">
                    MS Thuế (H/Chiếu)
                  </Label>
                </Col>
                <Col xs="3" md="2">
                  <Input
                    className="line_input"
                    type="text"
                    value={this.state.customer.tax_code}
                    onChange={e => this.handleChangeCustomer('tax_code', e)}
                  />
                </Col>
                <Col xs="3" md="1">
                  <Label className="bottomLabel" htmlFor="prependedInput">
                    Ngày xuất
                  </Label>
                </Col>
                <Col xs="3" md="2">
                  <Input
                    className="line_input"
                    type="text"
                    value={current_date}
                    // onChange={e => this.handleChangeCustomer('tax_code', e)}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="6" md="1">
                  <Label className="bottomLabel" htmlFor="prependedInput">
                    Người mua
                  </Label>
                </Col>
                <Col xs="6" md="5">
                  <Input
                    className="line_input"
                    type="text"
                    value={this.state.customer.name}
                    onChange={e => this.handleChangeCustomer('name', e)}
                  />
                </Col>
                <Col xs="3" md="1">
                  <Label className="bottomLabel" htmlFor="prependedInput">
                    Điện thoại
                  </Label>
                </Col>
                <Col xs="3" md="2">
                  <Input
                    className="line_input"
                    type="text"
                    value={this.state.customer.phone}
                    onChange={e => this.handleChangeCustomer('phone', e)}
                  />
                </Col>
                <Col xs="3" md="1">
                  <Label className="bottomLabel" htmlFor="prependedInput">
                    Số phiếu
                  </Label>
                </Col>
                <Col xs="3" md="2">
                  <Input className="line_input" type="text" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="12" md="1">
                  <Label className="bottomLabel" htmlFor="prependedInput">
                    Địa chỉ
                  </Label>
                </Col>
                <Col xs="12" md="11">
                  <Input
                    className="line_input"
                    type="text"
                    value={this.state.customer.address}
                    onChange={e => this.handleChangeCustomer('address', e)}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="4" md="1">
                  <Label htmlFor="prependedInput">Số nhà/đường</Label>
                </Col>
                <Col xs="4" md="3">
                  <Input
                    className=""
                    type="text"
                    value={this.state.delivery.street}
                    onChange={e => this.handleChangeDelivery('street', e)}
                  />
                </Col>
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">Tỉnh/TP</Label>
                </Col>
                <Col xs="2" md="1">
                  <Select
                    // autosize={false}
                    name="province"
                    clearable={false}
                    placeholder="Chọn..."
                    value={this.state.delivery.province}
                    options={provinceData}
                    onChange={e => this.handleSelectChange('province', e)}
                  />
                </Col>
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">Q/Huyện</Label>
                </Col>
                <Col xs="2" md="1">
                  <Select
                    // autosize={false}
                    name="district"
                    clearable={false}
                    placeholder="Chọn..."
                    value={this.state.delivery.district}
                    options={districtData}
                    onChange={e => this.handleSelectChange('district', e)}
                  />
                </Col>
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">P/Xã</Label>
                </Col>
                <Col xs="2" md="1">
                  <Select
                    // autosize={false}
                    name="district"
                    clearable={false}
                    placeholder="Chọn..."
                    value={this.state.delivery.commune}
                    options={communeData}
                    onChange={e => this.handleSelectChange('commune', e)}
                  />
                </Col>
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">Km giao</Label>
                </Col>
                <Col xs="2" md="1">
                  <Input
                    className=""
                    type="text"
                    value={this.state.delivery.km}
                    onChange={e => this.handleChangeDelivery('km', e)}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">Bảng giá</Label>
                </Col>
                <Col xs="2" md="1">
                  <Input
                    className="line_input"
                    type="text"
                    value={this.state.order.price_type}
                    onChange={e => this.handleChangeOrder('price_type', e)}
                  />
                </Col>
                <Col xs="4" md="4" />
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">Số biên nhận</Label>
                </Col>
                <Col xs="2" md="1">
                  <Input className="line_input" type="text" />
                </Col>
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">Số Receipt</Label>
                </Col>
                <Col xs="2" md="1">
                  <Input
                    className="line_input"
                    type="text"
                    value={this.state.order.receipt_number}
                    onChange={e => this.handleChangeOrder('receipt_number', e)}
                  />
                </Col>
                <Col xs="2" md="2">
                  <Input
                    className="line_input"
                    type="checkbox"
                    value={this.state.order.debt_tranfer}
                    onChange={e => this.handleCheckedChange('debt_tranfer', e)}
                  />
                  Chuyển nợ
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">NVBH</Label>
                </Col>
                <Col xs="2" md="1">
                  <Input
                    className="line_input"
                    type="text"
                    value={this.state.order.saleman}
                    onChange={e => this.handleChangeOrder('saleman_name', e)}
                  />
                </Col>
                <Col xs="4" md="4" />
                {/* <Label htmlFor="prependedInput">Chi nhánh</Label>
                </Col>
                <Col xs="4" md="3">
                  <Input
                    className="line_input"
                    type="text"

                    // value={this.state.order.saleman}
                    // onChange={e => this.handleChangeOrder('saleman_name', e)}
                  />
                </Col> */}
                <Col xs="4" md="1">
                  <Label htmlFor="prependedInput">Số đơn hàng</Label>
                </Col>
                <Col xs="4" md="3">
                  <Input
                    className="line_input"
                    type="text"
                    value={this.state.order.order_code}
                    onChange={e => this.handleChangeOrder('order_code', e)}
                  />
                </Col>
                <Col xs="4" md="2">
                  <Input
                    className="line_input"
                    type="checkbox"
                    value={this.state.payment.card}
                    checked={this.state.payment.card}
                    onChange={e => this.handleChangePayment('card', e)}
                  />Thẻ
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="2" md="2" style={{ marginLeft: '20px' }}>
                  <Input
                    className="line_input"
                    type="checkbox"
                    value={this.state.order.delivery}
                    checked={this.state.order.delivery}
                    onChange={e => this.handleCheckedChange('delivery', e)}
                  />
                  Giao hàng
                </Col>
                <Col xs="1" md="1">
                  <Button color="secondary">G/H</Button>
                </Col>
                <Col xs="3" md="3" />
                <Col xs="1" md="1" />
                <Col xs="2" md="2" style={{ marginLeft: '105px' }}>
                  <Input
                    className="line_input"
                    type="checkbox"
                    value={this.state.order.voucher}
                    checked={this.state.order.voucher}
                    onChange={e => this.handleCheckedChange('voucher', e)}
                  />
                  Phiếu mua hàng
                </Col>
                <Col xs="1" md="1">
                  <Input
                    className="line_input"
                    type="checkbox"
                    value={this.state.order.print_before_tax}
                    checked={this.state.order.print_before_tax}
                    onChange={e =>
                      this.handleCheckedChange('print_before_tax', e)
                    }
                  />
                  In giá trước thuế
                </Col>
                <Col xs="1" md="1">
                  <Input
                    className="line_input"
                    type="checkbox"
                    disabled={this.state.order.print_before_tax ? false : true}
                    value={this.state.order.printed}
                    checked={this.state.order.printed}
                    onChange={e => this.handleCheckedChange('printed', e)}
                  />
                  Đã in
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="2" md="1">
                  <Label> Xuất h/đ sau</Label>
                </Col>
                <Col xs="2" md="1">
                  <Input
                    className=""
                    type="number"
                    value={this.state.order.invoice_after_days}
                    onChange={e =>
                      this.handleChangePayment('invoice_after_days', e)
                    }
                  />
                </Col>
                <Col xs="3" md="1">
                  <Input
                    className=""
                    type="radio"
                    // value={true}
                    checked={this.state.payment.full_paid == true}
                    onChange={() =>
                      this.handleRadioChange('payment', 'full_paid', true)
                    }
                  />
                  K/h nợ
                </Col>
                <Col xs="3" md="2">
                  <Input
                    className=""
                    type="radio"
                    // value={false}
                    checked={this.state.payment.full_paid == false}
                    onChange={() =>
                      this.handleRadioChange('payment', 'full_paid', false)
                    }
                  />
                  K/h thanh toán hết
                </Col>
                <Col xs="2" md="1">
                  <Label>Loại HĐ</Label>
                </Col>
                <Col xs="2" md="1">
                  <Input
                    className="line_input"
                    type="text"
                    value={this.state.order.invoice_type}
                    onChange={e => this.handleChangeOrder('invoice_type', e)}
                  />
                </Col>
                <Col xs="4" md="4">
                  <Button color="secondary" size="xs">
                    SM
                  </Button>{' '}
                  <Button color="secondary" size="xs">
                    In TTG/H
                  </Button>{' '}
                  <Button color="secondary" size="xs">
                    Lưu TT
                  </Button>{' '}
                  <Button color="secondary" size="xs">
                    Sửa TT
                  </Button>{' '}
                  <Button color="secondary" size="xs">
                    Lưu XHĐ
                  </Button>
                </Col>
              </FormGroup>

              <Cart carts={this.state.carts ? this.state.carts : {}} />

              <FormGroup row>
                <Col xs="1" md="1">
                  <Label htmlFor="prependedInput">H/T Bán</Label>
                </Col>
                <Col xs="3" md="3">
                  <Input
                    className=""
                    type="radio"
                    checked={this.state.order.sale_type === 1}
                    onChange={() =>
                      this.handleRadioChange('order', 'sale_type', 1)
                    }
                  />
                  <Label className="radioLabel">T/Tiếp</Label>
                  <Input
                    className=""
                    type="radio"
                    checked={this.state.order.sale_type === 2}
                    onChange={() =>
                      this.handleRadioChange('order', 'sale_type', 2)
                    }
                  />
                  <Label className="radioLabel">Online</Label>

                  <Input
                    className=""
                    type="radio"
                    checked={this.state.order.sale_type === 3}
                    onChange={() =>
                      this.handleRadioChange('order', 'sale_type', 3)
                    }
                  />
                  <Label className="radioLabel">Telesale</Label>

                  <Input
                    className=""
                    type="radio"
                    checked={this.state.order.sale_type === 4}
                    onChange={() =>
                      this.handleRadioChange('order', 'sale_type', 4)
                    }
                  />
                  <Label className="radioLabel">Agent</Label>
                </Col>
                <Col xs="1" md="1">
                  <Label htmlFor="prependedInput">Số lượng</Label>
                </Col>
                <Col xs="1" md="1">
                  <Input
                    className="line_input"
                    type="number"
                    value={this.state.payment.total_quantity}
                    onChange={e =>
                      this.handleChangePayment('total_quantity', e)
                    }
                  />
                </Col>
                <Col xs="1" md="1">
                  <Label htmlFor="prependedInput">Tiền hàng</Label>
                </Col>
                <Col xs="2" md="1">
                  <Input
                    className="line_input"
                    type="text"
                    value={numeral(this.state.payment.total_price).format(
                      '0,0'
                    )}
                    onChange={e =>
                      this.handleChangePayment('total_quantity', e)
                    }
                  />
                </Col>
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">
                    <Button color="secondary" size="xs" className="pull-right">
                      Tiền mặt
                    </Button>
                  </Label>
                </Col>
                <Col xs="2" md="1">
                  <Input
                    className="line_input"
                    type="text"
                    value={numeral(this.state.payment.cash).format('0,0')}
                    onChange={e => this.handleChangePayment('cash', e)}
                  />
                </Col>
                <Col xs="1" md="1">
                  <Label htmlFor="prependedInput">Hạn TT</Label>
                </Col>
                <Col xs="2" md="1">
                  {/* <DatePicker
                    dateFormat="YYYY/MM/DD"
                    selected={moment()}
                    onChange={this.handleDateChange()}
                  /> */}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">Mã thẻ</Label>
                </Col>
                <Col xs="2" md="1">
                  <Input type="text" />
                </Col>
                <Col xs="4" md="4" />
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">Tiền thuế</Label>
                </Col>
                <Col xs="2" md="1">
                  <Input
                    className="line_input"
                    type="text"
                    value={numeral(this.state.payment.tax).format('0,0')}
                    onChange={e => this.handleChangePayment('tax', e)}
                  />
                </Col>
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">
                    <Button color="secondary" size="xs" className="pull-right">
                      Thẻ
                    </Button>
                  </Label>
                </Col>
                <Col xs="2" md="1">
                  <Input
                    className="line_input"
                    type="text"
                    value={numeral(this.state.payment.card_money).format('0,0')}
                    onChange={e => this.handleChangePayment('card_money', e)}
                  />
                </Col>
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">Đã đặt cọc</Label>
                </Col>
                <Col xs="2" md="1">
                  <Input
                    className="line_input"
                    type="text"
                    value={numeral(this.state.payment.deposit).format('0,0')}
                    onChange={e => this.handleChangePayment('deposit', e)}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="1" md="1" />
                <Col xs="1" md="1">
                  <Button color="secondary" size="xs" className="pull-right">
                    Doanh số mua
                  </Button>
                </Col>
                <Col xs="2" md="2" />
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">TkGG</Label>
                </Col>
                <Col xs="2" md="1">
                  <Input className="line_input" type="text" />
                </Col>
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">Tiền GG</Label>
                </Col>
                <Col xs="2" md="1">
                  <Input className="line_input" type="text" />
                </Col>
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">
                    <Button color="secondary" size="xs" className="pull-right">
                      P mua hàng
                    </Button>
                  </Label>
                </Col>
                <Col xs="2" md="1">
                  <Input className="line_input" type="text" />
                </Col>
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">KH trả trước</Label>
                </Col>
                <Col xs="2" md="1">
                  <Input className="line_input" type="text" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="4" md="4" />
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">Tiền CG</Label>
                </Col>
                <Col xs="2" md="1">
                  <Input className="line_input" type="text" />
                </Col>
                <Col xs="2" md="1" offset="4">
                  <Label htmlFor="prependedInput">Tổng TT</Label>
                </Col>
                <Col xs="2" md="1">
                  <Input className="line_input" type="text" />
                </Col>
                <Col xs="2" md="1">
                  <Label htmlFor="prependedInput">
                    <Button color="secondary" size="xs" className="pull-right">
                      Chuyển nợ
                    </Button>
                  </Label>
                </Col>
                <Col xs="2" md="1">
                  <Input className="line_input" type="text" />
                </Col>
                <Col xs="2" md="1" offset="4">
                  <Label htmlFor="prependedInput">Còn phải thu</Label>
                </Col>
                <Col xs="2" md="1">
                  <Input className="line_input" type="text" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="6" md="6">
                  <Button type="submit" color="secondary" size="xs">
                    Lưu
                  </Button>{' '}
                  <Button color="secondary" size="xs">
                    Mới
                  </Button>{' '}
                  <Button color="secondary" size="xs">
                    In ctừ
                  </Button>{' '}
                  <Button color="secondary" size="xs">
                    Sửa
                  </Button>{' '}
                  <Button color="secondary" size="xs">
                    Xem
                  </Button>
                  <Button color="secondary" size="xs">
                    Tìm
                  </Button>{' '}
                  <Button color="secondary" size="xs">
                    Quay ra
                  </Button>{' '}
                  <Button color="secondary" size="xs">
                    In PĐC/PTN
                  </Button>{' '}
                  <Button color="secondary" size="xs">
                    In PTTNV
                  </Button>
                </Col>
                <Col xs="2" md="2" />
                <Col xs="4" md="4">
                  <Button color="secondary" size="xs">
                    Đăng kí trả góp
                  </Button>{' '}
                  <Button color="secondary" size="xs">
                    Thu nợ n/viên
                  </Button>{' '}
                  <Button color="secondary" size="xs">
                    T/toán các lần tiếp theo
                  </Button>
                </Col>
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  shops: state.shops.shopsList,
  user: state.user,
  provinces: state.order.provinces,
  districts: state.order.districts,
  communes: state.order.communes
});

const mapDispatchToProps = dispatch => {
  return {
    onFetchProvinces: () => dispatch(fetchProvince()),
    onFetchDistricts: () => dispatch(fetchDistrict()),
    onFetchCommunes: () => dispatch(fetchCommune())
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Customer)
);
