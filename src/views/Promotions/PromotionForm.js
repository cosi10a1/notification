import React, { Component } from 'react';
import {
  withRouter,
  Switch,
  Route,
  Redirect,
  NavLink,
  Link
} from 'react-router-dom';

import {
  Badge,
  Row,
  Button,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardSubtitle,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  FormGroup,
  Form,
  Label,
  FormText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Container
} from 'reactstrap';
import { connect } from 'react-redux';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import './react_dates_overrides.css';
import moment from 'moment';
import firebase from 'firebase';
import Select from 'react-select';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import config from '../../config';
import { numberFormat, numberWithCommas } from '../../helpers/number_helper';
import numeral from 'numeral';
import * as PermissionConstants from '../../constants/PermissionConstants';
import OverlayLoader from 'react-overlay-loading/lib/OverlayLoader';
import Page403 from '../Pages/403/403';
import * as PermissionHelpers from '../../helpers/permission-helpers';

class PromotionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      banner_url: '',
      branches: [],
      time: [],
      data: [],
      modal: false,
      promotion_id: this.props.match.params.promotion_id
        ? this.props.match.params.promotion_id
        : ''
    };
    this.renderShopCheckbox = this.renderShopCheckbox.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDeleteTime = this.handleDeleteTime.bind(this);
    this.handleTimeStart = this.handleTimeStart.bind(this);
    this.handleChangeProduct = this.handleChangeProduct.bind(this);
    this.handleDeleteProduct = this.handleDeleteProduct.bind(this);
    this.addMoreProduct = this.addMoreProduct.bind(this);
    this.addMoreTime = this.addMoreTime.bind(this);
    this.submitData = this.submitData.bind(this);
    this.validateInfomation = this.validateInfomation.bind(this);
    this.getShopName = this.getShopName.bind(this);
    this.updateSelectedShop = this.updateSelectedShop.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.options = {
      sortIndicator: true,
      hideSizePerPage: true,
      paginationSize: 3,
      sizePerPage: 5,
      hidePageListOnlyOnePage: true,
      clearSearch: true,
      alwaysShowAllBtns: false,
      withFirstAndLast: false
    };
  }

  componentDidMount() {
    this.getData();
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleDelete() {
    let _this = this;
    // firebase
    //   .database()
    //   .ref(`promotions/${config.env}/`)
    //   .child(this.state.promotion_id)
    //   .remove()
    //   .then(() => {
    //     this.props.history.push('/promotions');
    //   });

    firebase
      .database()
      .ref(`promotions/${config.env}/`)
      .transaction(current => {
        current.splice(_this.props.match.params.promotion_id, 1);

        return current;
      })
      .then(() => {
        _this.props.history.push('/promotions');
      });
  }

  getData() {
    if (this.props.match.params.promotion_id) {
      let promotions = this.props.promotions;
      if (promotions && promotions.length != 0) {
        let index = promotions.findIndex(
          el => el.key == this.props.match.params.promotion_id
        );
        if (index != -1) {
          this.setState({
            name: promotions[index].name,
            banner_url: promotions[index].banner_url,
            startDate: moment(promotions[index].date.startDate),
            endDate: moment(promotions[index].date.endDate),
            data: promotions[index].data
              ? Object.values(promotions[index].data)
              : [],
            time: promotions[index].time ? promotions[index].time : [],
            branches: promotions[index].branches
              ? promotions[index].branches
              : []
          });
        }
      } else {
        firebase
          .database()
          .ref(
            `/promotions/${config.env}` + this.props.match.params.promotion_id
          ) // Thay bằng config.env
          .on('value', snapshot => {
            let promotion = snapshot.val();
            this.setState({
              name: promotion.name,
              banner_url: promotion.banner_url,
              startDate: moment(promotion.date.startDate),
              endDate: moment(promotion.date.endDate),
              data: promotion.data ? Object.values(promotion.data) : [],
              time: promotion.time ? promotion.time : [],
              branches: promotion.branches ? promotion.branches : []
            });
          });
      }
    }
  }

  changeName(event) {
    this.setState({
      name: event.target.value
    });
  }

  changeImageUrl(event) {
    this.setState({
      banner_url: event.target.value
    });
  }

  handleChange(event) {
    let branches = this.state.branches;
    let value = event.target.value;

    if (event.target.checked) {
      branches.push(value);
    } else {
      let index = branches.indexOf(value);
      branches.splice(index, 1);
    }

    this.setState({
      branches: branches
    });
  }

  addMoreTime() {
    let time = this.state.time;
    this.setState({
      time: [...time, { startTime: 0, endTime: 0 }]
    });
  }

  handleDeleteTime(i) {
    let timeArray = [...this.state.time];
    timeArray.splice(i, 1);

    this.setState({
      time: timeArray
    });
  }

  handleDeleteProduct(i) {
    let data = [...this.state.data];
    data.splice(i, 1);
    this.setState({
      data: data
    });
  }

  handleSelectAllShop(e) {
    if (e.target.checked) {
      let shops = this.props.shops.map(item => item.profile.store_id);
      this.setState({ branches: shops });
    } else {
      this.setState({ branches: [] });
    }
  }

  addMoreProduct(onAdd) {
    let data = this.state.data;

    this.setState(
      {
        data: [...data, {}]
      },
      () => {
        onAdd && onAdd();
      }
    );
  }

  handleTimeStart(e, i) {
    let time = [...this.state.time];
    time[i].startTime = e.target.value;
    this.setState({
      time
    });
  }

  handleTimeEnd(e, i) {
    let time = [...this.state.time];
    time[i].endTime = e.target.value;
    this.setState({
      time
    });
  }

  handleChangeProduct(field, e, i) {
    let updateState = [...this.state.data];
    if (field == 'quantity') {
      updateState[i][field] = parseInt(e.target.value);
    } else {
      updateState[i][field] = e.target.value;
    }
    this.setState({ data: updateState });
  }

  renderShopCheckbox() {
    let _this = this;
    return this.props.shops.map(function(item, index) {
      return (
        <FormGroup key={item.profile.store_id} check className="checkbox">
          <Input
            className="form-check-input"
            type="checkbox"
            name="shop"
            value={item.profile.store_id}
            onChange={_this.handleChange.bind(this)}
          />
          <Label check className="form-check-label" htmlFor="checkbox3">
            {item.profile.name}
          </Label>
        </FormGroup>
      );
    });
  }

  getShopName(shops) {
    let shop_names = shops.map(item => ({
      label: item.profile.name,
      value: item.profile.store_id
    }));
  }

  updateSelectedShop(selectedShops) {
    this.setState({ branches });
  }

  submitData(e) {
    e.preventDefault();
    let _this = this;
    let data = [...this.state.data];
    data.map((item, index) => {
      if (item.promotionPrice.indexOf(',') > -1) {
        data[index].promotionPrice = numeral(data[index].promotionPrice)
          .value()
          .toString();
      }
    });
    if (this.validateInfomation()) {
      let editData = {
        name: this.state.name,
        banner_url: this.state.banner_url,
        branches: this.state.branches,
        date: {
          startDate: this.state.startDate.valueOf(),
          endDate: this.state.endDate.valueOf()
        },
        time: this.state.time,
        data: data.reduce(function(map, obj) {
          map[obj.sku] = obj;
          return map;
        }, {})
      };
      if (this.props.match.params.promotion_id) {
        let updates = {};
        updates[this.props.match.params.promotion_id] = editData;
        firebase
          .database()
          .ref(`/promotions/${config.env}`)
          .update(updates, function(e) {
            if (e) {
              Alert.error('Đã có lỗi xảy ra, vui lòng thử lại', {
                position: 'top-right',
                effect: 'jelly',
                timeout: 1000,
                offset: 100
              });
            } else {
              Alert.success('Sửa thành công', {
                position: 'top-right',
                effect: 'jelly',
                timeout: 3000,
                offset: 100,
                onClose: function() {
                  _this.props.history.push('/promotions');
                }
              });
            }
          });
      } else {
        firebase
          .database()
          .ref(`/promotions/${config.env}`)
          .transaction(current => {
            if (!current) {
              current = [editData];
            } else {
              current.push(editData);
            }

            return current;
          })
          .then(() => {
            Alert.success('Thêm chương trình thành công', {
              position: 'top-right',
              effect: 'jelly',
              timeout: 3000,
              offset: 100,
              onClose: function() {
                _this.props.history.push('/promotions');
              }
            });
          })
          .catch(e => {
            Alert.error('Đã có lỗi xảy ra, vui lòng thử lại', {
              position: 'top-right',
              effect: 'jelly',
              timeout: 1000,
              offset: 100
            });
          });
      }
    }
  }

  validateInfomation() {
    if (!this.state.startDate) {
      Alert.error('Chưa chọn ngày áp dụng', {
        position: 'top-right',
        effect: 'jelly',
        timeout: 1000,
        offset: 100
      });
      return false;
    } else if (this.state.data.length == 0) {
      Alert.error('Chọn sản phẩm khuyến mãi', {
        position: 'top-right',
        effect: 'jelly',
        timeout: 1000,
        offset: 100
      });
      return false;
    }
    return true;
  }

  getShopName() {
    let shop_names = this.props.shops.map(item => ({
      store_id: item.profile.store_id,
      name: item.profile.name
    }));
    if (this.state.branches) {
      this.state.branches.map(branch => {
        let shop_name = shop_names.find(x => x.store_id == branch);
        if (shop_names.indexOf(shop_name) > 0) {
          let index = shop_names.indexOf(shop_name);
          shop_names.unshift(shop_names.splice(index, 1)[0]);
        }
      });
    }
    return shop_names;
  }

  handleTab(e) {
    if (e.keyCode === 9) {
      let form = e.target.form;
      let index = Array.prototype.indexOf.call(form, e.target);

      this.addMoreProduct(() => {
        form.elements[index + 2].focus();
      });

      e.preventDefault();
    }
  }

  render() {
    moment.locale('vi');
    let shop_names = this.getShopName();
    const { match, location, history } = this.props;
    let canAdd =
      !this.props.match.params.promotion_id &&
      PermissionHelpers.havePermission(
        this.props.user,
        PermissionConstants.CREATE_PROMOTION
      );
    let canEdit =
      this.props.match.params.promotion_id &&
      PermissionHelpers.havePermission(
        this.props.user,
        PermissionConstants.EDIT_PROMOTION
      );
    let canView =
      this.props.match.params.promotion_id &&
      PermissionHelpers.havePermission(
        this.props.user,
        PermissionConstants.VIEW_PROMOTION
      );
    let canDelete =
      this.props.match.params.promotion_id &&
      PermissionHelpers.havePermission(
        this.props.user,
        PermissionConstants.DELETE_PROMOTION
      );

    return !this.props.user.profile ? (
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
    ) : canAdd || canEdit || canView ? (
      <Container fluid className="animated fadeIn" style={{ marginTop: '7px' }}>
        <Row>
          <Col sm="12" md={{ size: 10, offset: 1 }}>
            <Card>
              <Form onSubmit={this.submitData}>
                <CardHeader>
                  <i className="fa fa-align-justify" />{' '}
                  {canEdit ? 'Chỉnh sửa' : canAdd ? 'Thêm' : 'Xem'} chương trình
                  khuyến mãi
                  {canDelete ? (
                    <Button
                      color="danger"
                      size="md"
                      className="pull-right"
                      onClick={this.toggleModal}
                    >
                      <i className="fa fa-trash" /> Xóa
                    </Button>
                  ) : null}
                  {canEdit || canAdd ? (
                    <Button
                      color={
                        this.props.match.params.promotion_id
                          ? 'primary'
                          : 'success'
                      }
                      size="md"
                      className="pull-right"
                      style={{ marginRight: '20px' }}
                    >
                      <i className="fa fa-save" />
                      {this.props.match.params.promotion_id
                        ? ' Lưu'
                        : ' Tạo mới'}
                    </Button>
                  ) : null}
                  <Button
                    color="secondary"
                    size="md"
                    className="pull-right"
                    style={{ marginRight: '20px' }}
                    onClick={() => this.props.history.push('/promotions')}
                  >
                    <i className="fa fa-arrow-left" /> Quay lại
                  </Button>
                </CardHeader>
                <CardBody style={{ backgroundColor: '#ffffff' }}>
                  <FormGroup row>
                    <Col md="2">
                      <Label htmlFor="text-input">
                        Tên chương trình khuyến mãi
                      </Label>
                    </Col>
                    <Col xs="12" md="10">
                      <Input
                        type="text"
                        name="text-input"
                        placeholder="Tên chương trình khuyến mãi"
                        value={this.state.name}
                        required
                        onChange={e => this.setState({ name: e.target.value })}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="2">
                      <Label htmlFor="text-input">Banner URL</Label>
                    </Col>
                    <Col xs="12" md="10">
                      <Input
                        type="text"
                        name="text-input"
                        placeholder="Banner Url"
                        value={this.state.banner_url}
                        onChange={e =>
                          this.setState({ banner_url: e.target.value })
                        }
                        required
                      />
                    </Col>
                  </FormGroup>
                  <Row>
                    <Col md="2">
                      <Label>Ngày áp dụng</Label>
                    </Col>
                    <Col md="10">
                      <DateRangePicker
                        openDirection={'up'}
                        startDate={this.state.startDate}
                        startDatePlaceholderText={'Từ ngày'}
                        endDatePlaceholderText={'Đến ngày'}
                        startDateId="startDate"
                        endDate={this.state.endDate}
                        endDateId="endDate"
                        readOnly={true}
                        onDatesChange={({ startDate, endDate }) =>
                          this.setState({ startDate, endDate })
                        }
                        focusedInput={this.state.focusedInput}
                        onFocusChange={focusedInput =>
                          this.setState({ focusedInput })
                        }
                        orientation={'horizontal'}
                        openDirection={'down'}
                        displayFormat="DD/MM/YYYY"
                        monthFormat="MM/YYYY"
                      />
                    </Col>
                  </Row>
                  <FormGroup row style={{ marginTop: '20px' }}>
                    <Col md="2">
                      <Label>Khung giờ áp dụng</Label>
                    </Col>
                    <Col md="10">
                      {this.state.time.map((item, index) => {
                        if (item != null)
                          return (
                            <FormGroup key={'time_' + index} row>
                              <Col md="3">
                                <Input
                                  type="number"
                                  placeholder="Bắt đầu"
                                  min="0"
                                  max="24"
                                  value={
                                    this.state.time[index].startTime
                                      ? this.state.time[index].startTime
                                      : ''
                                  }
                                  onChange={e => this.handleTimeStart(e, index)}
                                />
                              </Col>

                              <Col md="3">
                                <Input
                                  type="number"
                                  placeholder="Kết thúc"
                                  min="0"
                                  max="59"
                                  value={
                                    this.state.time[index].endTime
                                      ? this.state.time[index].endTime
                                      : ''
                                  }
                                  onChange={e => this.handleTimeEnd(e, index)}
                                />
                              </Col>
                              <Col md="3">
                                {canAdd || canEdit ? (
                                  <Button
                                    size="md"
                                    color="danger"
                                    onClick={() => this.handleDeleteTime(index)}
                                  >
                                    <i className="fa fa-trash" /> Xoá
                                  </Button>
                                ) : null}
                              </Col>
                            </FormGroup>
                          );
                      })}
                      <Button
                        size="md"
                        color="success"
                        disabled={!canAdd && !canEdit}
                        onClick={() => this.addMoreTime()}
                      >
                        <i className="fa fa-plus" /> Thêm khung giờ
                      </Button>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="2">
                      <Label>Chi nhánh</Label>
                    </Col>
                    <Col md="10">
                      {' '}
                      <BootstrapTable
                        data={shop_names}
                        version="4"
                        hover
                        pagination
                        options={this.options}
                      >
                        <TableHeaderColumn
                          dataField="store_id"
                          width={'60px'}
                          dataFormat={(cell, row, formatExtraData, index) => {
                            return (
                              <FormGroup check className="checkbox">
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="shop"
                                  checked={this.state.branches.some(
                                    el => el == cell
                                  )}
                                  value={cell}
                                  onChange={this.handleChange.bind(this)}
                                />
                              </FormGroup>
                            );
                          }}
                        >
                          <FormGroup check className="checkbox">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              name="shop"
                              onChange={this.handleSelectAllShop.bind(this)}
                            />
                          </FormGroup>
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="store_id"
                          dataSort
                          width="150px"
                        >
                          Mã cửa hàng
                        </TableHeaderColumn>
                        <TableHeaderColumn isKey dataField="name">
                          Tên cửa hàng
                        </TableHeaderColumn>
                      </BootstrapTable>
                    </Col>
                  </FormGroup>

                  <FormGroup row style={{ marginTop: '20px' }}>
                    <Col md="2">
                      <Label>Sản phẩm khuyến mãi</Label>
                    </Col>
                    <Col md="10">
                      <p>
                        <i>
                          Tổng số sản phẩm:{' '}
                          <strong>{this.state.data.length}</strong>{' '}
                        </i>
                      </p>
                      {this.state.data.map((item, index) => {
                        if (item != null) {
                          return (
                            <FormGroup key={'product_' + index} row>
                              <Col md="3">
                                <Input
                                  type="text"
                                  placeholder="SKU"
                                  value={this.state.data[index].sku}
                                  onChange={e =>
                                    this.handleChangeProduct('sku', e, index)
                                  }
                                  required
                                />
                              </Col>

                              <Col md="3">
                                <Input
                                  type="text"
                                  placeholder="Giá khuyến mãi"
                                  value={numeral(
                                    this.state.data[index].promotionPrice
                                  ).format('0,0')}
                                  onChange={e =>
                                    this.handleChangeProduct(
                                      'promotionPrice',
                                      e,
                                      index
                                    )
                                  }
                                  required
                                />
                              </Col>

                              <Col md="3">
                                <Input
                                  type="number"
                                  placeholder="Số lượng"
                                  value={this.state.data[index].quantity}
                                  onChange={e =>
                                    this.handleChangeProduct(
                                      'quantity',
                                      e,
                                      index
                                    )
                                  }
                                  onKeyDown={e => this.handleTab(e)}
                                  required
                                />
                              </Col>

                              <Col md="3">
                                <Button
                                  size="md"
                                  color="danger"
                                  disabled={!canAdd && !canEdit}
                                  onClick={() =>
                                    this.handleDeleteProduct(index)
                                  }
                                >
                                  <i className="fa fa-trash" /> Xoá
                                </Button>
                              </Col>
                            </FormGroup>
                          );
                        }
                      })}
                      <Button
                        size="md"
                        color="success"
                        disabled={!canAdd && !canEdit}
                        onClick={this.addMoreProduct.bind(this)}
                      >
                        <i className="fa fa-plus" /> Thêm sản phẩm
                      </Button>
                    </Col>
                  </FormGroup>
                </CardBody>
              </Form>
            </Card>
            <Alert stack={{ limit: 3 }} />

            <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
              <ModalHeader toggle={this.toggleModal}>Kiểm tra</ModalHeader>
              <ModalBody>
                Bạn có chắc chắn muốn xóa chương trình này không?
              </ModalBody>
              <ModalFooter>
                <Button color="success" onClick={this.handleDelete.bind(this)}>
                  Có
                </Button>
                <Button color="secondary" onClick={this.toggleModal}>
                  Không
                </Button>
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
      </Container>
    ) : (
      <Page403 />
    );
  }
}

const mapStateToProps = state => ({
  shops: state.shops.shopsList,
  promotions: state.promotions,
  user: state.user
});

export default withRouter(connect(mapStateToProps)(PromotionForm));
