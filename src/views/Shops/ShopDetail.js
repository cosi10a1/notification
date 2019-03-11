import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';
import classnames from 'classnames';
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import Employees from '../../views/Employees/Employees';
import { updateShop, removeShop, addShop } from '../../stores/shops/actions';
import { white } from 'material-ui/styles/colors';

class ShopDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalUpdate: false,
      modalDelete: false,
      activeTab: '1',
      storeKey: '',
      shopProfile: {
        store_id: '',
        address: '',
        district_id: '',
        name: '',
        phone: ''
      }
    };
    this.toggleTab.bind(this);
    this.toggleUpdate = this.toggleUpdate.bind(this);
    this.toggleDelete = this.toggleDelete.bind(this);
  }

  componentDidMount() {
    var row = this.props.row;
    var storeKey = row.store_key;
    var shop = {
      store_id: row.store_id,
      address: row.store_address,
      district_id: row.store_district_id,
      name: row.store_name,
      phone: row.store_phone
    };
    this.setState({ ...this.state, shopProfile: shop, storeKey: storeKey });
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  toggleUpdate() {
    this.setState({
      modalUpdate: !this.state.modalUpdate
    });
  }

  toggleDelete() {
    this.setState({
      modalDelete: !this.state.modalDelete
    });
  }

  handleChange(field, e) {
    const updateState = { ...this.state };
    updateState.shopProfile[field] = e.target.value;
    this.setState(updateState);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.storeKey) {
      this.props.onUpdateShop(this.state.storeKey, this.state.shopProfile);
    }
  }

  handleDelete(e) {
    e.preventDefault();
    this.props.onDeleteShop(this.state.storeKey);
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Nav tabs>
          <NavItem>
            <NavLink
              to=""
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => {
                this.toggleTab('1');
              }}
            >
              Thông tin
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to=""
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => {
                this.toggleTab('2');
              }}
            >
              Nhân viên
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col md="6">
                <Row>
                  <Col md="3">
                    <Label>Tên chi nhánh:</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <strong className="form-control-static">
                      {this.props.row.store_name}
                    </strong>
                  </Col>
                </Row>
                <Row>
                  <Col md="3">
                    <Label>Điện thoại:</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <strong className="form-control-static">
                      {this.props.row.store_phone}
                    </strong>
                  </Col>
                </Row>
                <Row>
                  <Col md="3">
                    <Label>Email:</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <strong className="form-control-static">{}</strong>
                  </Col>
                </Row>
              </Col>

              <Col md="6">
                <Row>
                  <Col md="3">
                    <Label>Địa chỉ:</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <strong className="form-control-static">
                      {this.props.row.store_address}
                    </strong>
                  </Col>
                </Row>
                <Row>
                  <Col md="3">
                    <Label>Khu vực:</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <strong className="form-control-static">{}</strong>
                  </Col>
                </Row>
                <Row>
                  <Col md="3">
                    <Label>Phường xã:</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <strong className="form-control-static">{}</strong>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={{ size: 4, offset: 6 }}>
                <Button
                  size="md"
                  color="primary"
                  style={{ float: 'right', fontWeight: 'bold' }}
                  onClick={this.toggleUpdate}
                >
                  <i className="fa fa-edit" /> Chỉnh sửa
                </Button>
              </Col>

              {/* <Col sm={{ size: 2}}>
                 <button className="btn btn-primary fa fa-lock" style={{backgroundColor:"red ",color:"white", float:"right", border:"0px"}} >Ngừng hoạt động</button>
                 </Col> */}

              <Col xs={{ size: 1 }}>
                <Button
                  size="md"
                  color="danger"
                  style={{ float: 'right', fontWeight: 'bold' }}
                  onClick={this.toggleDelete}
                >
                  <i className="fa fa-trash" /> Xóa
                </Button>

                <Modal
                  isOpen={this.state.modalDelete}
                  toggle={this.toggleDelete}
                  className={this.props.className}
                >
                  <ModalHeader toggle={this.toggleDelete}>Kiểm tra</ModalHeader>
                  <ModalBody>Bạn có chắc chắn muốn xóa cửa hàng này?</ModalBody>
                  <ModalFooter>
                    <Button
                      color="success"
                      onClick={this.handleDelete.bind(this)}
                    >
                      Có
                    </Button>
                    <Button color="secondary" onClick={this.toggleDelete}>
                      Không
                    </Button>
                  </ModalFooter>
                </Modal>
              </Col>

              <Modal isOpen={this.state.modalUpdate} toggle={this.toggleUpdate}>
                <form onSubmit={this.handleSubmit.bind(this)} noValidate>
                  <ModalHeader toggle={this.toggleUpdate}>
                    Chỉnh sửa thông tin cửa hàng
                  </ModalHeader>
                  <ModalBody>
                    <Row>
                      <Col xs="6">
                        <div className="form-group">
                          <label
                            className="label-control"
                            style={{ fontWeight: 'bold' }}
                          >
                            Tên cửa hàng:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={this.state.shopProfile.name}
                            onChange={this.handleChange.bind(this, 'name')}
                          />

                          <label
                            className="label-control"
                            style={{ fontWeight: 'bold' }}
                          >
                            Điện thoại:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={this.state.shopProfile.phone}
                            onChange={this.handleChange.bind(this, 'phone')}
                          />
                        </div>
                      </Col>
                      <Col xs="6">
                        <div className="form-group">
                          <label
                            className="label-control"
                            style={{ fontWeight: 'bold' }}
                          >
                            Địa chỉ:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={this.state.shopProfile.address}
                            onChange={this.handleChange.bind(this, 'address')}
                          />
                        </div>
                      </Col>
                    </Row>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      size="md"
                      color="secondary"
                      onClick={this.toggleUpdate}
                    >
                      <i className="fa fa-arrow-left" /> Quay lại
                    </Button>
                    <Button
                      type="submit"
                      size="md"
                      color="primary"
                      onClick={this.toggleUpdate}
                    >
                      <i className="fa fa-save" /> Lưu
                    </Button>
                  </ModalFooter>
                </form>
              </Modal>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Employees shop_id={this.props.row.store_key} />
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUpdateShop: (id, data) => dispatch(updateShop(id, data)),
    onAddShop: data => dispatch(addShop(data)),
    onDeleteShop: id => dispatch(removeShop(id))
  };
};

export default connect(null, mapDispatchToProps)(ShopDetail);
