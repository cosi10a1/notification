import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Nav,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
  ButtonDropdown
} from 'reactstrap';
import { setCurrentShop } from '../stores/shops/actions';

class ChooseShopDropdown extends Component {
  constructor(props) {
    super(props);
    this.renderCurrentShop = this.renderCurrentShop.bind(this);
  }

  componentDidMount() {
    let _this = this;
    if (!_this.props.currentShop) {
      let setShop = setInterval(function() {
        if (_this.props.userShops && !_this.props.currentShop) {
          if (_this.props.user.profile.default_shop) {
            _this.props.chooseShop(_this.props.user.profile.default_shop);
          } else {
            _this.props.chooseShop(_this.props.userShops[0]);
          }
          clearInterval(setShop);
        }
      }, 500);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.currentShop && nextProps.shopsList && nextProps.userShops) {
      this.props.chooseShop(nextProps.user.profile.default_shop);
    }
  }

  renderListShop() {
    let _this = this;
    if (this.props.shopsList.length != 0) {
      return this.props.shopsList.map(function(item, index) {
        return (
          <DropdownItem
            onClick={() => _this.chooseShop(item.shop_id)}
            key={item.shop_id}
          >
            {item.profile.name}
          </DropdownItem>
        );
      });
    }
  }

  renderCurrentShop() {
    let _this = this;
    if (this.props.currentShop) {
      let shop = this.props.shopsList.find(function(el) {
        return el.shop_id == _this.props.currentShop;
      });
      if (shop != null) return shop.profile.name;
    }
    return 'Chọn cửa hàng';
  }

  chooseShop(shop) {
    this.props.chooseShop(shop);
  }

  render() {
    return (
      <ButtonDropdown
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
        style={{ background: '#ffffff' }}
      >
        <DropdownToggle
          style={{ background: '#ffffff', border: '0 none' }}
          caret
        >
          {this.renderCurrentShop()}
        </DropdownToggle>
        <DropdownMenu style={{ background: '#ffffff' }}>
          {this.renderListShop()}
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

const mapStateToProps = state => ({
  userShops: state.user.shops,
  currentShop: state.shops.currentShop,
  shopsList: state.shops.shopsList,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  chooseShop: shop => dispatch(setCurrentShop(shop))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseShopDropdown);
