import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Container, Row } from 'reactstrap';
import AddEmployeeComponent from '../../components/AddEmployeeComponent';
import * as PermissionConstants from '../../constants/PermissionConstants';
import * as PermissionHelpers from '../../helpers/permission-helpers';
import Page403 from '../Pages/403/403';
import OverlayLoader from 'react-overlay-loading/lib/OverlayLoader';

class AddEmployee extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return !this.props.user.profile || !this.props.currentShop ? (
      <OverlayLoader
        color={'red'} // default is white
        loader="ScaleLoader" // check below for more loaders
        text="Loading... Please wait!"
        active={true}
        backgroundColor={'black'} // default is black
        opacity=".4" // default is .9
      />
    ) : PermissionHelpers.havePermission(
      this.props.user,
      PermissionConstants.USER_MANAGE,
      this.props.currentShop
    ) ? (
      <Container
        className={'animated fadeIn'}
        fluid
        style={{ paddingTop: '20px' }}
      >
        <Row>
          <AddEmployeeComponent
            currentShop={this.props.currentShop}
            position={PermissionConstants.SALEMAN}
            title={'Danh sách nhân viên bán hàng'}
          />
          <AddEmployeeComponent
            currentShop={this.props.currentShop}
            position={PermissionConstants.CASHIER}
            title={'Danh sách nhân viên thu ngân '}
          />
        </Row>
      </Container>
    ) : (
      <Page403 />
    );
  }
}

const mapStateToProps = state => ({
  currentShop: state.shops.currentShop,
  user: state.user
});

export default withRouter(connect(mapStateToProps)(AddEmployee));
