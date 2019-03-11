import React, { Component } from 'react';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import {
  Form,
  FormGroup,
  Label,
  Row,
  Col,
  Input,
  Button,
  Card,
  CardHeader,
  CardBody
} from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import { DateRangePicker } from 'react-dates';
import { numberWithCommas } from '../../helpers/number_helper';
import _ from 'lodash';
import { LoadingOverlay, Loader } from 'react-overlay-loader';

class EmployeeReport extends Component {
  constructor(props) {
    super(props);
    this.sync_data = this.sync_data.bind(this);
    this.options = {
      hideSizePerPage: true,
      paginationSize: 5,
      hidePageListOnlyOnePage: true,
      clearSearch: true,
      alwaysShowAllBtns: false,
      withFirstAndLast: false,
      expandRowBgColor: '#d9dadb',
      expanding: [1], // initially expanded,
      paginationShowsTotal: true,
      sizePerPageList: [
        {
          text: '5',
          value: 5
        },
        {
          text: '10',
          value: 10
        }
      ] // you can change the dropdown list for size per page
    };
    this.state = {
      startDate: moment().subtract(7, 'day'),
      endDate: moment(),
      query_by: 'day',
      is_loading: false,
      show_type: 'employee-store'
    };
  }

  updateShowType(e) {
    e.preventDefault();
    this.setState({ show_type: e.target.value });
  }

  async sync_data() {
    this.setState({ is_loading: true });
    await this.props.sync_func(
      this.state.startDate.format('YYYY-MM-DD'),
      this.state.endDate.format('YYYY-MM-DD'),
      ' ',
      this.state.query_by
    );
    this.setState({ is_loading: false });
  }

  async componentWillMount() {
    this.sync_data();
  }

  formatData(cell, row, enumObject) {
    return numberWithCommas(cell);
  }

  render() {
    return (
      <Card style={{ marginTop: '0px', marginBottom: '1px' }}>
        <CardHeader>Doanh số của từng nhân viên</CardHeader>
        <CardBody className="card-body">
          <LoadingOverlay
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'trans'
            }}
          >
            <div>
              <h1> </h1>
            </div>
            <div className="chart-wrapper">
              <BootstrapTable
                data={
                  this.state.show_type == 'employee'
                    ? this.props.employeeOrderGroupbyEmployeeID
                    : this.props.employeeOrder
                }
                version="4"
                striped
                hover
                pagination
                search
                options={this.options}
              >
                <TableHeaderColumn
                  dataField="index"
                  width="5%"
                  dataSort
                  isKey={true}
                >
                  STT
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="ma_nvien"
                  width="5%"
                  dataSort
                  filter={{
                    placeholder: 'Mã nhân viên',
                    type: 'TextFilter',
                    condition: 'like'
                  }}
                >
                  Mã nhân viên
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="ten_nv"
                  tdStyle={{ whiteSpace: 'normal' }}
                  dataSort
                  width="30%"
                  filter={{
                    placeholder: 'Tên nhân viên',
                    type: 'TextFilter',
                    condition: 'like'
                  }}
                >
                  Tên nhân viên
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="ma_bp"
                  width="10%"
                  hidden={this.state.show_type == 'employee' ? true : false}
                  dataSort
                  filter={{
                    placeholder: 'Cửa hàng',
                    type: 'TextFilter',
                    condition: 'like'
                  }}
                >
                  Cửa hàng
                </TableHeaderColumn>
                <TableHeaderColumn dataField="total_order" width="10%" dataSort>
                  Số đơn
                </TableHeaderColumn>

                <TableHeaderColumn
                  dataField="grand_total"
                  width="30%"
                  dataSort
                  dataFormat={this.formatData}
                  filter={{
                    placeholder: 'Doanh số',
                    type: 'NumberFilter',
                    numberComparators: ['=', '>', '<', '>=', '<=']
                  }}
                >
                  Doanh số
                </TableHeaderColumn>
              </BootstrapTable>
            </div>
            <FormGroup row>
              <Col md="3" sm="12">
                <Label>Khoảng thời gian: {'\u00A0'}</Label>
                <div>
                  <DateRangePicker
                    openDirection={'up'}
                    startDate={this.state.startDate}
                    startDatePlaceholderText={'Từ ngày'}
                    endDatePlaceholderText={'Đến ngày'}
                    startDateId="startDate"
                    endDate={this.state.endDate}
                    endDateId="endDate"
                    onDatesChange={({ startDate, endDate }) => {
                      this.setState({ startDate, endDate });
                    }}
                    focusedInput={this.state.focusedInput}
                    onFocusChange={focusedInput =>
                      this.setState({ focusedInput })
                    }
                    orientation={'horizontal'}
                    displayFormat="YYYY/MM/DD"
                    monthFormat="MM/YYYY"
                    isOutsideRange={() => false}
                    minimumNights={0}
                  />
                </div>
              </Col>
              <Col md="3" sm="12">
                <Label>Hiển thị theo: {'\u00A0'}</Label>

                <Input type="select" onChange={e => this.updateShowType(e)}>
                  <option value="employee-store">Nhân viên - Cửa hàng</option>
                  <option value="employee">Nhân viên</option>
                </Input>
              </Col>
              <Col md="6" sm="12">
                <Label> {'\u00A0'} </Label>
                <div>
                  <Button color="primary" onClick={this.sync_data}>
                    <i className="fa fa-refresh" />
                    {'\u00A0'} Refresh
                  </Button>
                </div>
              </Col>
            </FormGroup>
            <Loader loading={this.state.is_loading} />
          </LoadingOverlay>
        </CardBody>
      </Card>
    );
  }
}

const getEmployeeOrder = state => {
  let employeeOrder = [];
  let employeeOrder_input = state.reports.employee_order;
  employeeOrder_input.map((item, index) => {
    employeeOrder.push({
      ...item,
      index: index + 1
    });
  });
  return employeeOrder;
};

const getEmployeeOrderGroupByEmployeeID = state => {
  let employeeOrder = [];
  let employeeOrder_input = _.groupBy(state.reports.employee_order, 'ma_nvien');
  let employeeOrderwithTotalOrder = Object.keys(employeeOrder_input).map(
    (key, index) => {
      return {
        index: index + 1,
        ma_nvien: key,
        ten_nv: employeeOrder_input[key][0].ten_nv,
        grand_total: employeeOrder_input[key].reduce((a, b) => {
          return a + b.grand_total;
        }, 0),
        total_order: employeeOrder_input[key].reduce((a, b) => {
          return a + b.total_order;
        }, 0)
      };
    }
  );
  return employeeOrderwithTotalOrder;
};

const mapStateToProps = state => ({
  employeeOrder: getEmployeeOrder(state),
  employeeOrderGroupbyEmployeeID: getEmployeeOrderGroupByEmployeeID(state)
});

export default connect(mapStateToProps, null)(EmployeeReport);
