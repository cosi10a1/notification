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
  Label,
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

class ShowroomDetailOrder extends Component {
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

  render() {
    return (
      // <Form>
      <div className="animated fadeIn" style={{ margin: '15px' }}>
        <Row>
          <Col md="3" style={{ fontSize: '20px' }}>
            <strong>
              Đơn hàng 123456 | {new Date().toLocaleDateString('en-GB')}{' '}
              {new Date().toLocaleTimeString()}{' '}
            </strong>
          </Col>
          <Col xs="12" md="9">
            <Button
              className="pull-right"
              type="submit"
              size="md"
              color="success"
              style={{ marginRight: '15px' }}
            >
              <i className="fa fa-print" /> In chứng từ
            </Button>
            <Button
              className="pull-right"
              type="submit"
              size="md"
              color="danger"
              style={{ marginRight: '10px' }}
            >
              <i className="fa fa-ban" /> Hủy
            </Button>
            <Button
              className="pull-right"
              type="submit"
              size="md"
              color="primary"
              style={{ marginRight: '10px' }}
            >
              <i className="fa fa-edit" /> Sửa
            </Button>
            <Button
              className="pull-right"
              type="submit"
              size="md"
              color="secondary"
              style={{ marginRight: '10px' }}
            >
              <i className="fa fa-arrow-left" /> Quay lại
            </Button>
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col xs="12" lg="5">
            <Card>
              <CardHeader>
                <strong>THÔNG TIN KHÁCH HÀNG</strong>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" className="form-horizontal">
                  <FormGroup row>
                    <Col xs="6" md="2">
                      <Label htmlFor="prependedInput">Mã KH/Gcafe</Label>
                    </Col>
                    <Col xs="6" md="4">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                    <Col xs="6" md="2">
                      <Label htmlFor="prependedInput">SĐT</Label>
                    </Col>
                    <Col xs="6" md="4">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="prependedInput">Tên KH</Label>
                    <Input type="text" id="" placeholder="" />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="prependedInput">Địa chỉ</Label>
                    <Input type="text" id="" placeholder="" />
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <strong>THÔNG TIN ĐƠN HÀNG</strong>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" className="form-horizontal">
                  <FormGroup row>
                    <Col xs="6" md="2">
                      <Label htmlFor="prependedInput">Mã đơn hàng</Label>
                    </Col>
                    <Col xs="6" md="4">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                    <Col xs="6" md="2">
                      <Label htmlFor="prependedInput">Ngày mua</Label>
                    </Col>
                    <Col xs="6" md="4">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="6" md="2">
                      <Label htmlFor="prependedInput">NVBH</Label>
                    </Col>
                    <Col xs="6" md="4">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                    <Col xs="6" md="2">
                      <Label htmlFor="prependedInput">Trạng thái</Label>
                    </Col>
                    <Col xs="6" md="4">
                      <Select
                        autosize={false}
                        name="status"
                        clearable={false}
                        // value={this.state.status}
                        options={[
                          { label: 'Tất cả', value: '' },
                          { label: 'Chờ xử lý', value: 'processing' },
                          { label: 'Đã xác nhận', value: 'confirmed' },
                          { label: 'Hủy', value: 'cancelled' }
                        ]}
                        // onChange={this.handleChange}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="6" md="2">
                      <Label htmlFor="prependedInput">Kênh bán/Chi nhánh</Label>
                    </Col>
                    <Col xs="6" md="4">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                    <Col xs="6" md="2">
                      <Label htmlFor="prependedInput">Ghi chú</Label>
                    </Col>
                    <Col xs="6" md="4">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>

          <Col xs="12" lg="7">
            <Card>
              <CardHeader>
                <strong>CHI TIẾT ĐƠN HÀNG</strong>
              </CardHeader>

              <CardBody>
                <Form action="" method="post" className="form-horizontal">
                  <FormGroup row>
                    <Col xs="3" md="2">
                      <Label htmlFor="prependedInput">Giao hàng</Label>
                    </Col>
                    <Col xs="3" md="1">
                      <Input type="checkbox" id="" placeholder="" />
                    </Col>
                    <Col xs="5" md="2">
                      <Label htmlFor="prependedInput">Địa chỉ nhận hàng</Label>
                    </Col>
                    <Col xs="5" md="3">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                    <Col xs="4" md="2">
                      <Label htmlFor="prependedInput">
                        Ngày giao hàng dự kiến
                      </Label>
                    </Col>
                    <Col xs="4" md="2">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="3" md="2">
                      <Label htmlFor="prependedInput">Hóa đơn VAT</Label>
                    </Col>
                    <Col xs="3" md="1">
                      <Input type="checkbox" id="" placeholder="" />
                    </Col>
                    <Col xs="9" md="2">
                      <Label htmlFor="prependedInput">
                        Thông tin xuất hóa đơn
                      </Label>
                    </Col>
                    <Col xs="9" md="7">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="3" md="2">
                      <Label htmlFor="prependedInput">Đặt cọc</Label>
                    </Col>
                    <Col xs="3" md="1">
                      <Input type="checkbox" id="" placeholder="" />
                    </Col>
                    <Col xs="4" md="2">
                      <Label htmlFor="prependedInput">Tiền đặt cọc</Label>
                    </Col>
                    <Col xs="4" md="2">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                    <Col xs="3" md="2">
                      <Label htmlFor="prependedInput">Lắp đặt</Label>
                    </Col>
                    <Col xs="3" md="1">
                      <Input type="checkbox" id="" placeholder="" />
                    </Col>
                    <Col xs="2" md="1">
                      <Label htmlFor="prependedInput">Thẻ</Label>
                    </Col>
                    <Col xs="2" md="1">
                      <Input type="checkbox" id="" placeholder="" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="4" md="2">
                      <Label htmlFor="prependedInput">Tiền thanh toán</Label>
                    </Col>
                    <Col xs="4" md="2">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                    <Col xs="4" md="2">
                      <Label htmlFor="prependedInput">Phiếu mua hàng</Label>
                    </Col>
                    <Col xs="4" md="2">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                    <Col xs="4" md="2">
                      <Label htmlFor="prependedInput">Mã phiếu</Label>
                    </Col>
                    <Col xs="4" md="2">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="prependedInput">
                        Ghi chú khi xử lí giao dịch
                      </Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <strong>TỔNG GIÁ TRỊ</strong>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" className="form-horizontal">
                  <FormGroup row>
                    <Col xs="6" md="2">
                      <Label htmlFor="prependedInput">Thành tiền</Label>
                    </Col>
                    <Col xs="6" md="4">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                    <Col xs="6" md="2">
                      <Label htmlFor="prependedInput">Phí vận chuyển</Label>
                    </Col>
                    <Col xs="6" md="4">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="6" md="2">
                      <Label htmlFor="prependedInput">KH trả trước</Label>
                    </Col>
                    <Col xs="6" md="4">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                    <Col xs="6" md="2">
                      <Label htmlFor="prependedInput">Phải thu</Label>
                    </Col>
                    <Col xs="6" md="4">
                      <Input type="text" id="" placeholder="" />
                    </Col>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify" />{' '}
                <strong>SẢN PHẨM ĐƠN HÀNG</strong>
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
                    Mã SKU
                  </TableHeaderColumn>
                  <TableHeaderColumn isKey dataField="email">
                    Sản phẩm
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="phone" dataSort>
                    Số lượng
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="position" dataSort>
                    Tồn kho
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="" dataSort>
                    Cảnh báo
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="" dataSort>
                    Giá bán lẻ
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="" dataSort>
                    Giảm giá
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="" dataSort>
                    Thành tiền
                  </TableHeaderColumn>
                </BootstrapTable>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      // </Form>
    );
  }
}

export default connect()(ShowroomDetailOrder);
