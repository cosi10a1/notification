import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import ShopRow from './ShopRow';
import ShopDetail from './ShopDetail';
import firebase from 'firebase';
import Select from 'react-select';
import {
  Badge,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardBlock,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import { addShop, removeShop, updateShop } from '../../stores/shops/actions';
import {
  CLEAR_NEW_SHOP_FIELD,
  UPDATE_NEW_SHOP_FIELD
} from '../../stores/shops/action-types';
import store from '../../stores/configureStore';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import Employees from '../Employees/Employees';
import options from './visiblecolumn';
class ShopList extends Component {
  constructor(props) {
    super(props);
    this.toggleAdd = this.toggleAdd.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.isColumnVisible = this.isColumnVisible.bind(this);
    this.options = {
      sortIndicator: true,
      hideSizePerPage: true,
      paginationSize: 3,
      hidePageListOnlyOnePage: true,
      clearSearch: true,
      alwaysShowAllBtns: false,
      withFirstAndLast: false,
      expandRowBgColor: '#d9dadb',
      expanding: [1], // initially expanded
      onRowClick: function(row) {}
    };
    this.expandRow = this.expandRow.bind(this);
    this.isExpandableRow = this.isExpandableRow.bind(this);
    this.updateVisibaleColumns = this.updateVisibaleColumns.bind(this);
    this.state = {
      activeTab: '1',
      visibleColumns: [
        { value: 'store_id', label: 'Mã cửa hàng' },
        { value: 'store_name', label: 'Tên cửa hàng' },
        { value: 'store_address', label: 'Địa chỉ' },
        { value: 'store_phone', label: 'Số điện thoại' },
        { value: 'store_employee_num', label: 'Số nhân viên' },
        { value: 'store_status', label: 'Nhà cung cấp' }
      ],
      shop: {
        profile: {
          store_id: '',
          address: '',
          district_id: '',
          name: '',
          phone: ''
        }
      },
      modal: false,
      modalAdd: false
    };
  }

  componentDidMount() {}

  toggleModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleAdd() {
    this.setState({
      modalAdd: !this.state.modalAdd
    });
  }

  handleAddShopChange(field, e) {
    const updateState = { ...this.state };
    updateState.shop.profile[field] = e.target.value;
    this.setState(updateState);
  }

  handleAddShopSubmit(e) {
    e.preventDefault();
    this.props.onAddShop(this.state.shop);
  }

  updateVisibaleColumns(visibleColumns) {
    this.setState({ visibleColumns });
  }

  handleChange(field, e) {
    this.props.onUpdateNewShopFiled(field, e.target.value);
  }

  expandRow(row) {
    return <ShopDetail row={row} />;
  }

  isExpandableRow(row) {
    return true;
  }

  isColumnVisible(columnname) {
    let allVisibaleColumns = this.state.visibleColumns.map(a => a.value);
    return !allVisibaleColumns.includes(columnname);
  }

  convertStateToDatatabledata(shops) {
    return shops.length > 0
      ? shops.map(item => ({
          store_key: item.shop_id,
          store_id: item.profile.store_id,
          store_name: item.profile.name,
          store_address: item.profile.address,
          store_phone: item.profile.phone,
          store_employee_num: item.users ? Object.keys(item.users).length : 0,
          store_provider: item.profile.provider,
          store_district_id: item.profile.district_id
        }))
      : [];
  }

  render() {
    var shop = [];
    var remove = this.props.onRemove;
    var update = this.props.onUpdate;
    return (
      <div className="animated">
        <div className="container-fluid" style={{ marginTop: '20px' }}>
          <div className="row">
            <Card>
              <CardHeader>
                <Row>
                  <Col md="6">
                    <i className="fa fa-align-justify" /> Danh sách cửa hàng
                  </Col>
                  <Col md="6">
                    <Button
                      size="md"
                      color="danger"
                      style={{ float: 'right', fontWeight: 'bold' }}
                      onClick={this.toggleModal}
                    >
                      <i className="fa fa-list" />
                    </Button>
                    <Button
                      size="md"
                      color="success"
                      style={{ float: 'right', fontWeight: 'bold' }}
                      onClick={this.toggleAdd.bind(this)}
                    >
                      <i className="fa fa-plus" /> Thêm cửa hàng
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <Modal isOpen={this.state.modalAdd} toggle={this.toggleAdd}>
                <form onSubmit={this.handleAddShopSubmit.bind(this)} noValidate>
                  <ModalHeader toggle={this.toggleAdd}>
                    Thêm mới cửa hàng
                  </ModalHeader>
                  <ModalBody>
                    <Row>
                      <Col xs="6">
                        <div className="form-group">
                          <label
                            className="label-control"
                            style={{ fontWeight: 'bold' }}
                          >
                            Mã cửa hàng:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            onChange={this.handleAddShopChange.bind(
                              this,
                              'store_id'
                            )}
                          />
                          <label
                            className="label-control"
                            style={{ fontWeight: 'bold' }}
                          >
                            Tên cửa hàng:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            onChange={this.handleAddShopChange.bind(
                              this,
                              'name'
                            )}
                          />
                        </div>
                      </Col>
                      <Col xs="6">
                        <div className="form-group">
                          <label
                            className="label-control"
                            style={{ fontWeight: 'bold' }}
                          >
                            Điện thoại:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            onChange={this.handleAddShopChange.bind(
                              this,
                              'phone'
                            )}
                          />
                          <label
                            className="label-control"
                            style={{ fontWeight: 'bold' }}
                          >
                            Địa chỉ:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            onChange={this.handleAddShopChange.bind(
                              this,
                              'address'
                            )}
                          />
                        </div>
                      </Col>
                    </Row>
                  </ModalBody>
                  <ModalFooter>
                    <button
                      type="submit"
                      className="btn btn-success"
                      onClick={this.toggleAdd}
                    >
                      Tạo mới
                    </button>
                    <Button color="secondary" onClick={this.toggleAdd}>
                      Bỏ qua
                    </Button>
                  </ModalFooter>
                </form>
              </Modal>

              <CardBody>
                <BootstrapTable
                  expandableRow={this.isExpandableRow}
                  data={this.convertStateToDatatabledata(this.props.shop)}
                  version="4"
                  striped
                  hover
                  pagination
                  search
                  options={this.options}
                  expandComponent={this.expandRow}
                  expandColumnOptions={{ expandColumnVisible: true }}
                >
                  <TableHeaderColumn
                    dataField="store_id"
                    hidden={this.isColumnVisible('store_id')}
                    dataSort
                    isKey={true}
                  >
                    Mã cửa hàng
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="store_name"
                    hidden={this.isColumnVisible('store_name')}
                    dataSort
                  >
                    Tên
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="store_address"
                    hidden={this.isColumnVisible('store_address')}
                    dataSort
                  >
                    Địa chỉ
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="store_phone"
                    hidden={this.isColumnVisible('store_phone')}
                    dataSort
                  >
                    Số điện thoại
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="store_employee_num"
                    hidden={this.isColumnVisible('store_employee_num')}
                    dataSort
                  >
                    Số lượng người dùng
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="store_status"
                    hidden={this.isColumnVisible('store_status')}
                    dataSort
                  >
                    Trạng thái
                  </TableHeaderColumn>
                </BootstrapTable>
              </CardBody>
            </Card>
            <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
              <ModalHeader toggle={this.toggleModal}>
                Chỉnh sửa thông tin hiển thị
              </ModalHeader>
              <ModalBody>
                <Select
                  name="form-field-name2"
                  value={this.state.visibleColumns}
                  options={options}
                  onChange={this.updateVisibaleColumns}
                  multi
                />
              </ModalBody>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  shop: state.shops.shopsList,
  store_id: state.shops.store_id,
  shop_name: state.shops.shop_name,
  shop_address: state.shops.shop_address,
  shop_phone: state.shops.shop_phone,
  shop_district: state.shops.shop_district,
  shop_provider: state.shops.shop_provider
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onAddShop: shop => dispatch(addShop(shop)),
    onUpdateNewShopFiled: (key, value) =>
      dispatch({ type: UPDATE_NEW_SHOP_FIELD, key, value }),
    onClearNewShopField: () => dispatch({ type: CLEAR_NEW_SHOP_FIELD })
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ShopList)
);
