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
import EmployeeRow from './EmployeeRow';
import {
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
  CardBlock,
  Button
} from 'reactstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { fetchEmployees } from '../../stores/employees/actions';

class Employees extends Component {
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
  }

  getData() {
    var data = [];
    if (!this.props.employees) {
      return [];
    }
    let employees = this.props.employees;

    if (this.props.currentShop) {
      let shop_id = this.props.currentShop;
      let shop = this.props.shops.find(x => x.shop_id == shop_id);
      data =
        shop && shop.users
          ? Object.keys(shop.users).map(id => ({
              name: employees[id].profile.displayName,
              email: employees[id].profile.email,
              phone: employees[id].profile.phoneNumber,
              position: shop.users[id],
              edit: id
            }))
          : [];
    }
    return data;
  }

  render() {
    var employees = this.props.employees;
    var addEmployeeLink = this.props.currentShop ? (
      <Link to={{ pathname: '/add_employee' }} style={{ float: 'right' }}>
        Thay đổi danh sách nhân viên
      </Link>
    ) : null;
    var data = this.getData();
    var shoplist = this.props.shops;
    return (
      <div className="animated fadeIn">
        <div className="container-fluid" style={{ marginTop: '20px' }}>
          <div className="row">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify" /> Danh sách nhân viên cửa
                hàng
                {addEmployeeLink}
              </CardHeader>
              <CardBody>
                <BootstrapTable
                  data={data}
                  version="4"
                  striped
                  hover
                  pagination
                  search
                  options={this.options}
                >
                  <TableHeaderColumn dataField="name" dataSort>
                    Tên
                  </TableHeaderColumn>
                  <TableHeaderColumn isKey dataField="email">
                    Email
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="phone" dataSort>
                    Số điện thoại
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="position" dataSort>
                    Nhóm quyền
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="" dataSort>
                    Trạng thái
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField="edit"
                    dataFormat={(cell, row, formatExtraData, index) => {
                      return this.props.currentShop ? (
                        <Link
                          to={{
                            pathname:
                              '/shops/' +
                              this.props.currentShop +
                              '/employees/' +
                              cell +
                              '/edit'
                          }}
                          key={cell}
                          className="btn btn-primary"
                          style={{ fontWeight: 'bold' }}
                        >
                          <i className="fa fa-edit" /> Chỉnh sửa
                        </Link>
                      ) : (
                        <Link
                          to={{
                            pathname: '/employees/' + cell
                          }}
                          key={cell}
                          className="btn btn-primary"
                          style={{ fontWeight: 'bold' }}
                        >
                          <i className="fa fa-edit" /> Chỉnh sửa
                        </Link>
                      );
                    }}
                    dataSort
                  >
                    Edit
                  </TableHeaderColumn>
                </BootstrapTable>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  employees: state.employees,
  shops: state.shops.shopsList,
  currentShop: state.shops.currentShop
});

export default withRouter(connect(mapStateToProps)(Employees));
