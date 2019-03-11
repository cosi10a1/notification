import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  withRouter,
  Switch,
  Route,
  Redirect,
  NavLink,
  Link
} from 'react-router-dom';
// import {removeShop} from '../../stores/shops/actions'
import {
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';

import { removeShop } from '../../stores/shops/actions';
class ShopRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      update: false,
      store_id: this.props.shop.store_id,
      shop_name: this.props.shop.name,
      shop_address: this.props.shop.address,
      shop_phone: this.props.shop.phone,
      shop_district: this.props.shop.district_id,
      shop_provider: this.props.shop.provider
    };
    this.toggle = this.toggle.bind(this);
    this.update = this.update.bind(this);
    this.update_shop = this.update_shop.bind(this);
  }

  update() {
    this.setState({
      update: !this.state.update
    });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleRemoveshop(e, id) {
    e.preventDefault();
    this.props.onRemove(id);
  }
  update_shop(e) {
    e.preventDefault();
    var id = this.props.identifier;
    var store_id = this.state.store_id;
    var shop_name = this.state.shop_name;
    var shop_address = this.state.shop_address;
    var shop_phone = this.state.shop_phone;
    var shop_district = this.state.shop_district;
    var shop_provider = this.state.shop_provider;
    this.props.onUpdate(
      id,
      store_id,
      shop_name,
      shop_address,
      shop_phone,
      shop_district,
      shop_provider
    );
    this.update();
  }

  handleChange(field, e) {
    const updateState = { ...this.state };
    updateState[field] = e.target.value;
    this.setState(updateState);
  }

  render() {
    var shop = this.props.shop;
    var users = this.props.users;
    var shopId = this.props.identifier;
    if (!this.state.update) {
      return (
        <tr>
          <td>{shop.store_id}</td>
          <td>
            <Link
              to={{
                pathname: '/shops/' + shopId,
                state: { usersState: users, shopId: shopId }
              }}
            >
              {shop.name}
            </Link>
          </td>
          <td>{shop.address}</td>
          <td>{shop.phone}</td>
          <td>{shop.district_id}</td>
          <td>{shop.provider}</td>
          <td>
            <Button
              color="primary"
              className="fa fa-edit"
              onClick={this.update}
            >
              Chỉnh sửa
            </Button>
          </td>
          <td />
          <td>
            <Button
              color="primary"
              className="fa fa-remover"
              onClick={this.toggle}
            >
              Xóa
            </Button>
          </td>
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
            className={this.props.className}
          >
            <ModalHeader toggle={this.toggle}>Kiểm tra</ModalHeader>
            <ModalBody>Bạn có chắc chắn muốn xóa shop này</ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={e => this.handleRemoveshop(e, this.props.identifier)}
              >
                Có
              </Button>{' '}
              <Button color="primary" onClick={this.toggle}>
                Không
              </Button>
            </ModalFooter>
          </Modal>
        </tr>
      );
    } else {
      return (
        <tr>
          <td>
            <input
              onChange={this.handleChange.bind(this, 'store_id')}
              value={this.state.store_id}
              type="text"
              placeholder="Mã cửa hàng"
              required
            />
          </td>
          <td>
            {' '}
            <input
              onChange={this.handleChange.bind(this, 'shop_name')}
              value={this.state.shop_name}
              type="text"
              placeholder="Tên shop"
              required
            />
          </td>
          <td>
            {' '}
            <input
              onChange={this.handleChange.bind(this, 'shop_address')}
              value={this.state.shop_address}
              type="text"
              placeholder="Địa chỉ"
              required
            />
          </td>
          <td>
            <input
              onChange={this.handleChange.bind(this, 'shop_phone')}
              value={this.state.shop_phone}
              type="text"
              placeholder="Số điện thoại"
              required
            />
          </td>
          <td>
            <input
              onChange={this.handleChange.bind(this, 'shop_district')}
              value={this.state.shop_district}
              type="text"
              placeholder="Quận huyện"
              required
            />
          </td>
          <td>
            <input
              onChange={this.handleChange.bind(this, 'shop_provider')}
              value={this.state.shop_provider}
              type="text"
              placeholder="Nhà cung cấp"
              required
            />
          </td>
          <td>
            <Button
              color="primary"
              className="fa fa-remover"
              onClick={e => this.update_shop(e)}
            >
              Cập nhật
            </Button>
          </td>
          <td>
            <Button
              color="primary"
              className="fa fa-remover btn btn-primary"
              onClick={this.update}
            >
              Hủy
            </Button>
          </td>
          <td>
            <Button
              color="primary"
              className="fa fa-remover btn btn-primary"
              onClick={this.toggle}
            >
              Xóa
            </Button>
          </td>
        </tr>
      );
    }
  }
}

export default connect()(ShopRow);
