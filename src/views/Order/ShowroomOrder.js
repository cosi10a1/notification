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
  Button,
  Form,
  FormGroup
} from 'reactstrap';
import Select from 'react-select';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class ShowroomOrder extends Component {
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

  handleChange(e) {}

  render() {
    return (
      <div className="animated fadeIn" style={{ margin: '10px' }}>
        <Row>
          <Col xs="12" lg="2">
            <Card>
              <CardHeader>
                <strong>Tìm kiếm đơn hàng</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Input
                    type="text"
                    id="order_id"
                    placeholder="Mã đơn hàng"
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    id="customer_name"
                    placeholder="Tên khách hàng"
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    id="customer_phone"
                    placeholder="SĐT khách hàng"
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    id="saleman_name"
                    placeholder="Tên NV bán hàng"
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    id="saleman_id"
                    placeholder="Mã NV bán hàng"
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Select
                    autosize={false}
                    name="status"
                    clearable={false}
                    placeholder="Trạng thái đơn hàng"
                    // value={this.state.status}
                    options={[
                      { label: 'Tất cả', value: '' },
                      { label: 'Chờ xử lý', value: 'processing' },
                      { label: 'Đã xác nhận', value: 'confirmed' },
                      { label: 'Hủy', value: 'cancelled' }
                    ]}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup className="form-actions">
                  <Button
                    type="submit"
                    size="md"
                    color="primary"
                    style={{ float: 'right' }}
                  >
                    <i className="fa fa-search" /> Tìm kiếm
                  </Button>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" lg="10">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify" />{' '}
                <strong>ĐƠN HÀNG SHOWROOM</strong>
                <Link
                  to={{
                    pathname: '/showroom/detail'
                  }}
                >
                  <Button
                    type="submit"
                    size="md"
                    color="success"
                    style={{ float: 'right' }}
                  >
                    <i className="fa fa-plus" /> Tạo mới
                  </Button>
                </Link>
              </CardHeader>
              <CardBody>
                <BootstrapTable
                  version="4"
                  striped
                  hover
                  pagination
                  search
                  options={this.options}
                >
                  <TableHeaderColumn dataField="name" dataSort>
                    Mã ĐH
                  </TableHeaderColumn>
                  <TableHeaderColumn isKey dataField="email">
                    Tên KH
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="phone" dataSort>
                    SĐT
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="position" dataSort>
                    Địa chỉ
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="" dataSort>
                    Tổng ĐH
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="" dataSort>
                    Giảm giá
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="" dataSort>
                    Giá trị ĐH
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="" dataSort>
                    Trạng thái
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="" dataSort>
                    Mã NV sale
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="" dataSort>
                    Tên NV sale
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="" dataSort>
                    Ghi chú
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="" dataSort>
                    Ngày tạo
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="" dataSort>
                    Thu ngân
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="" dataSort>
                    Vận đơn
                  </TableHeaderColumn>
                </BootstrapTable>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect()(ShowroomOrder);
