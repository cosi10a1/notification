import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  Container,
  Row,
  Col,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
  ButtonDropdown
} from 'reactstrap';
import Page403 from '../Pages/403/403';
import OverlayLoader from 'react-overlay-loading/lib/OverlayLoader';

import AddEmployeeComponent from '../../components/AddEmployeeComponent';
import * as PermissionConstants from '../../constants/PermissionConstants';
import PermissionsSet from '../../components/PermissionsSet';
import ChooseShopDropdown from '../../components/ChooseShopDropdown';
import * as EmployeeAction from '../../stores/employees/actions';
class Permission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentShop: '',
      dropdownOpen: false
    };
    this.renderCurrentShop = this.renderCurrentShop.bind(this);
  }

  renderCurrentShop() {
    let _this = this;
    if (this.state.currentShop) {
      let shop = this.props.shops.find(function(el) {
        return el.shop_id == _this.state.currentShop;
      });
      if (shop != null) return shop.profile.name;
    }
    return 'Chọn cửa hàng';
  }

  renderListShop() {
    let _this = this;
    if (this.props.shops.length != 0) {
      return this.props.shops.map(function(item, index) {
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

  chooseShop(shop) {
    this.setState({
      currentShop: shop
    });
  }

  render() {
    let { user } = this.props;

    return (
      <div className="animated fadeIn" style={{ flex: 1 }}>
        {!user.profile ? (
          <OverlayLoader
            color={'red'} // default is white
            loader="ScaleLoader" // check below for more loaders
            text="Loading... Please wait!"
            active={true}
            backgroundColor={'black'} // default is black
            opacity=".4" // default is .9
          />
        ) : user.is_superuser ? (
          <Container fluid style={{ paddingTop: '20px' }}>
            <Row style={{ marginTop: '20px' }}>
              <AddEmployeeComponent
                currentShop={this.props.currentShop}
                position={PermissionConstants.STORE_MANAGER}
                title={'Cửa hàng trưởng'}
                chooseShop
                canPromote
              />
              <AddEmployeeComponent
                currentShop={this.props.currentShop}
                position={PermissionConstants.PROMOTION_ADMIN}
                title={'Quản lí khuyến mãi'}
                chooseShop
                canPromote
              />
            </Row>
            <Row>
              <PermissionsSet />
            </Row>
          </Container>
        ) : (
          <Page403 />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  shops: state.shops.shopsList,
  user: state.user,
  currentShop: state.shops.currentShop
});

export default withRouter(connect(mapStateToProps)(Permission));
