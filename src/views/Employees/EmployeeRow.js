import React, { Component } from 'react';
import moment from 'moment';
import { withRouter, Switch, Route, Redirect, NavLink, Link } from 'react-router-dom';
import {Button} from 'reactstrap';

class EmployeeRow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var employee = this.props.employee;
    var employeeId = this.props.id;
    var shops = this.props.shops;
    var shopId = employee.profile.default_shop;
    var shop = shops[shopId] ? shops[shopId] : {profile:{name:""}};
    return(
      <tr>
        <td>{employee.profile.displayName}</td>
        <td>{employee.profile.email}</td>
        <td>{employee.profile.phoneNumber}</td>
        <td>
        {shop.profile.name}
        </td>
        <td>{employee.profile.default_provider}</td>
        <td><Link to={{pathname: "/employees/edit", state: {employeeId: employeeId, employee: employee, shopId: shopId}}} className="btn btn-primary">Chỉnh sửa</Link></td>
      </tr>
    );
  }
}

export default EmployeeRow;