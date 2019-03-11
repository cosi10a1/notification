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
  Row,
  Col,
  CardColumns,
  Card,
  CardBody,
  CardHeader,
  CardBlock,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Jumbotron
} from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import _ from 'lodash';
import EmployeeSelect from './EmployeeSelect';
import * as PermissionHelpers from '../../helpers/permission-helpers';
import {
  addEmployeetoShop,
  removeEmployeefromShop,
  savePermission
} from '../../stores/shops/actions';
import * as EmployeeAction from '../../stores/employees/actions';

class PermissionsSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      permissionsData: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.getPermissionData = this.getPermissionData.bind(this);
    this.renderPemissionTable = this.renderPemissionTable.bind(this);
    this.setPermission = this.setPermission.bind(this);
    this.onSavePermission = this.onSavePermission.bind(this);
    this.renderPermissionColumn = this.renderPermissionColumn.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      !_.isEqual(nextProps.employees, this.props.employees) &&
      this.state.userId != ''
    ) {
      this.getPermissionData(nextProps);
    }
  }

  handleChange(e) {
    this.setState(
      {
        userId: e != null ? e.value : null
      },
      () => {
        if (this.state.userId) this.getPermissionData(this.props);
      }
    );
  }

  getPermissionData(props) {
    let _this = this;
    let permissionsData = [];
    let employees = props.employees;
    props.shops.map(shop => {
      let data = { id: shop.shop_id, name: shop.profile.name };
      Object.keys(props.permissionAndRoles.permissions).map(per => {
        if (
          employees[_this.state.userId].permissions &&
          employees[_this.state.userId].permissions[per] &&
          employees[_this.state.userId].permissions[per].includes(shop.shop_id)
        ) {
          data[per] = true;
        } else {
          data[per] = false;
        }
      });
      permissionsData.push(data);
    });
    this.setState({
      permissionsData: permissionsData
    });
  }

  setPermission(e, index, permission) {
    let data = this.state.permissionsData;
    data[index][permission] = e.target.checked;
    this.setState({
      permissionsData: data
    });
  }

  onSavePermission() {
    let { dispatch } = this.props;
    dispatch(
      savePermission(
        this.state.userId,
        this.state.permissionsData,
        this.onSuccess,
        this.onError
      )
    );
  }

  onSuccess() {
    Alert.success('Cập nhật thành công!', {
      position: 'top',
      effect: 'jelly',
      timeout: 2000,
      offset: 55
    });
  }

  onError() {
    Alert.error('Đã có lỗi xảy ra, vui lòng thử lại!', {
      position: 'top',
      effect: 'jelly',
      timeout: 2000,
      offset: 55
    });
  }

  renderPermissionColumn() {
    let data = this.props.permissionAndRoles.permissions;

    return Object.keys(data).map(key => {
      return (
        <TableHeaderColumn
          key={key}
          dataField={key}
          tdStyle={{ whiteSpace: 'normal' }}
          thStyle={{ whiteSpace: 'normal' }}
          dataFormat={(cell, row, formatExtraData, index) => {
            return (
              <FormGroup check>
                <Input
                  type="checkbox"
                  checked={cell}
                  onChange={e => this.setPermission(e, index, key)}
                />
              </FormGroup>
            );
          }}
        >
          {data[key].name}
        </TableHeaderColumn>
      );
    });
  }

  renderPemissionTable() {
    let _this = this;
    if (this.state.userId && this.state.permissionsData.length != 0) {
      return (
        <BootstrapTable
          data={this.state.permissionsData}
          version="4"
          striped
          hover
        >
          <TableHeaderColumn hidden dataField="id" isKey>
            id
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="name"
            width={'200px'}
            tdStyle={{ whiteSpace: 'normal' }}
            thStyle={{ whiteSpace: 'normal' }}
          >
            Cửa hàng
          </TableHeaderColumn>
          {this.renderPermissionColumn()}
        </BootstrapTable>
      );
    }
    return <Jumbotron style={{ background: '#ffffff' }} />;
  }

  updateAll() {
    let { dispatch } = this.props;
    dispatch(EmployeeAction.updateAllPermission(this.onSuccess, this.onError));
  }

  render() {
    return (
      <Col sm="12" md="12">
        <Card>
          <CardHeader>
            Phân quyền{' '}
            <Button
              onClick={this.updateAll.bind(this)}
              color="success"
              className={'pull-right'}
            >
              Đồng bộ
            </Button>
          </CardHeader>
          <CardBody>
            <Row>
              <Col xs="12" sm="12" md="12">
                <EmployeeSelect handleChange={this.handleChange} />
              </Col>
              <Col sm="12" md="12">
                {this.renderPemissionTable()}
                {this.state.userId && this.state.permissionsData.length != 0 ? (
                  <Button
                    color="primary"
                    onClick={this.onSavePermission}
                    style={{ float: 'right', marginTop: '20px' }}
                  >
                    Lưu
                  </Button>
                ) : null}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  employees: state.employees,
  shops: state.shops.shopsList,
  permissionAndRoles: state.permissions
});

export default connect(mapStateToProps)(PermissionsSet);
