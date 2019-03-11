import React, { Component } from 'react';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import {
  CardColumns,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Row,
  Col,
  Button
} from 'reactstrap';
import {
  sync_report_data,
  get_attendance_data
} from '../../stores/reports/actions';
import { connect } from 'react-redux';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import options from './visiblecolumn';
import Select from 'react-select';
import { setup_line_chart_data } from '../../helpers/setup_chart_data';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import 'react-datepicker/dist/react-datepicker.css';
import ChartTemplate from '../Reports/ChartTemplate';
import * as types from '../../stores/reports/action-types';
import OverlayLoader from 'react-overlay-loading/lib/OverlayLoader';
import agent from '../../helpers/agent';
import { fetchPromotions } from '../../stores/promotions/actions';
import Page403 from '../Pages/403/403';
import * as PermissionConstants from '../../constants/PermissionConstants';
import * as PermissionHelpers from '../../helpers/permission-helpers';
import { DateRangePicker } from 'react-dates';
import { numberWithCommas } from '../../helpers/number_helper';

import { get_redash_data } from '../../helpers/redash_helper';

class ShopInfo extends Component {
  constructor(props) {
    super(props);

    this.query_types = {
      day: 'ngày',
      month: 'tháng',
      week: 'tuần'
    };

    this.state = {
      top_product_detail: true,
      endDate: moment(),
      startDate: moment().subtract(7, 'day'),
      selectedShops: [],
      query_by: 'day',
      bestseller: [],
      data: {
        grand_total_detail: { column: [], value: [] },
        total_order_detail: { column: [], value: [] }
      },
      employeeOrder: [],
      currentShop: ''
    };
    this.getPromotionData = this.getPromotionData.bind(this);
  }

  componentDidMount() {
    if (this.props.promotions.length == 0) {
      this.props.onFetchPromotions();
    }

    let _this = this;
    if (this.props.currentShop != null) {
      let shop = this.props.shops.find(function(el) {
        return el.shop_id == _this.props.currentShop;
      });
      if (shop != null) {
        let startDate = this.state.startDate.format('YYYY-MM-DD');
        let endDate = this.state.endDate.format('YYYY-MM-DD');
        if (
          PermissionHelpers.havePermission(
            this.props.user,
            PermissionConstants.STORE_VIEW,
            this.props.currentShop
          )
        ) {
          this.getReportData(startDate, endDate, shop.profile.store_id);
          this.getBestSeller(startDate, endDate, shop.profile.store_id);
          this.getEmployeeOrder(startDate, endDate, shop.profile.store_id);
        }

        this.setState({
          currentShop: shop.profile.store_id
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    let _this = this;
    if (
      nextProps.currentShop != null &&
      nextProps.currentShop != this.props.currentShop
    ) {
      let shop = this.props.shops.find(function(el) {
        return el.shop_id == nextProps.currentShop;
      });
      if (shop != null) {
        let startDate = this.state.startDate.format('YYYY-MM-DD');
        let endDate = this.state.endDate.format('YYYY-MM-DD');
        if (
          PermissionHelpers.havePermission(
            this.props.user,
            PermissionConstants.STORE_VIEW,
            nextProps.currentShop
          )
        ) {
          this.getReportData(startDate, endDate, shop.profile.store_id);
          this.getBestSeller(startDate, endDate, shop.profile.store_id);
          this.getEmployeeOrder(startDate, endDate, shop.profile.store_id);
        }

        this.setState({
          currentShop: shop.profile.store_id
        });
      }
    }
  }

  async getReportData(start_date, end_date, stores, query_by = 'day') {
    try {
      let query_result = await agent.reports.get(
        start_date,
        end_date,
        stores,
        query_by
      );
      // grand_total_detail: { column: [], value: [] },
      // total_order_detail: { column: [], value: [] }
      let grand_total = [];
      let total_order = [];
      let column = [];
      if (query_result.length > 0) {
        query_result.map(item => {
          column.push(item.date_created);
          grand_total.push(item.grand_total);
          total_order.push(item.total_order);
        });
      }

      let data = {
        grand_total_detail: { column: column, value: grand_total },
        total_order_detail: { column: column, value: total_order }
      };
      this.setState({ data });
    } catch (error) {
      console.log(error);
    }
  }

  async getBestSeller(start_date, end_date, stores, query_by = 'day') {
    try {
      let query_result = await get_redash_data(
        start_date,
        end_date,
        stores,
        query_by,
        'best_seller'
      );

      this.setState({ bestseller: query_result });
    } catch (error) {
      console.log(error);
    }
  }

  async getEmployeeOrder(start_date, end_date, stores, query_by = 'day') {
    try {
      let query_result = await get_redash_data(
        start_date,
        end_date,
        stores,
        query_by,
        'employee_order'
      );
      this.setState({
        employeeOrder: query_result
      });
    } catch (error) {
      console.log(error);
    }
  }

  handlestartDateChange(startDate) {
    this.setState({
      startDate: startDate
    });
  }
  handleEndDateChange(endDate) {
    this.setState({
      endDate: endDate
    });
  }

  onSubmitDate() {
    let _this = this;
    if (this.props.currentShop != null) {
      let shop = this.props.shops.find(function(el) {
        return el.shop_id == _this.props.currentShop;
      });
      if (shop != null) {
        let startDate = this.state.startDate.format('YYYY-MM-DD');
        let endDate = this.state.endDate.format('YYYY-MM-DD');
        if (
          PermissionHelpers.havePermission(
            this.props.user,
            PermissionConstants.STORE_VIEW,
            this.props.currentShop
          )
        ) {
          this.getReportData(startDate, endDate, shop.profile.store_id);
          this.getBestSeller(startDate, endDate, shop.profile.store_id);
          this.getEmployeeOrder(startDate, endDate, shop.profile.store_id);
        }
      }
    }
  }

  getPromotionData() {
    let _this = this;
    let promotions = this.props.promotions;
    let shop = this.props.shops.find(function(el) {
      return el.shop_id == _this.props.currentShop;
    });

    if (shop != null) {
      promotions = this.props.promotions
        // .filter(item => Date.now() > item.date.endDate)
        .filter(item => item.branches.includes(shop.profile.store_id) == true);
      let promotion = promotions.map(function(promotion) {
        return {
          name: promotion.name,
          startDate: moment(promotion.date.startDate).format('DD/MM/YYYY'),
          endDate: moment(promotion.date.endDate).format('DD/MM/YYYY'),
          branches: promotion.branches
            ? promotion.branches.map(function(branch, i) {
                return branch;
              })
            : '',
          banner_url: promotion.banner_url,
          products: promotion.data,
          key: promotion.key
        };
      });
      return promotion;
    }
    return [];
  }

  formatData(cell, row, enumObject) {
    return numberWithCommas(cell);
  }

  render() {
    let promotionsData = this.getPromotionData();

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
      PermissionConstants.STORE_VIEW,
      this.props.currentShop
    ) ? (
      <div className="animated fadeIn">
        <div className="container-fluid" style={{ marginTop: '20px' }}>
          <div className="row">
            <div className="col-sm-12">
              <Card>
                <CardHeader>Báo cáo cửa hàng</CardHeader>
                <CardBody className="row">
                  <div className="col-sm-12 col-md-6">
                    <Bar
                      height={500}
                      data={{
                        labels: this.state.data.grand_total_detail.column,
                        datasets: [
                          {
                            label: 'Doanh số bán hàng ',
                            fill: true,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(75,192,192,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: this.state.data.grand_total_detail.value
                          }
                        ]
                      }}
                      options={{
                        scales: {
                          yAxes: [
                            {
                              ticks: {
                                beginAtZero: true
                              }
                            }
                          ],
                          xAxes: [
                            {
                              barPercentage: 0.4,
                              ticks: {
                                beginAtZero: true
                              }
                            }
                          ]
                        },
                        maintainAspectRatio: false
                      }}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6">
                    <Bar
                      height={500}
                      data={{
                        labels: this.state.data.total_order_detail.column,
                        datasets: [
                          {
                            label: 'Số đơn hàng ',
                            fill: true,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(75,192,192,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: this.state.data.total_order_detail.value
                          }
                        ]
                      }}
                      options={{
                        scales: {
                          yAxes: [
                            {
                              ticks: {
                                beginAtZero: true
                              }
                            }
                          ],
                          xAxes: [
                            {
                              barPercentage: 0.4,
                              ticks: {
                                beginAtZero: true
                              }
                            }
                          ]
                        },
                        maintainAspectRatio: false
                      }}
                    />
                  </div>
                </CardBody>
                <CardBody className="row">
                  <Col xs="12" md="12">
                    <DateRangePicker
                      startDate={this.state.startDate}
                      startDatePlaceholderText={'Từ ngày'}
                      endDatePlaceholderText={'Đến ngày'}
                      startDateId="startDate"
                      endDate={this.state.endDate}
                      endDateId="endDate"
                      readOnly={true}
                      onDatesChange={({ startDate, endDate }) =>
                        this.setState({ startDate, endDate })
                      }
                      focusedInput={this.state.focusedInput}
                      onFocusChange={focusedInput =>
                        this.setState({ focusedInput })
                      }
                      orientation={'horizontal'}
                      openDirection={'down'}
                      displayFormat="DD/MM/YYYY"
                      monthFormat="MM/YYYY"
                      isOutsideRange={() => false}
                      enableOutsideDays={true}
                    />
                    <Button
                      color={'primary'}
                      size="md"
                      onClick={this.onSubmitDate.bind(this)}
                      style={{ marginLeft: '20px' }}
                    >
                      Xem báo cáo
                    </Button>
                  </Col>
                </CardBody>
              </Card>
            </div>
          </div>

          <div className="row">
            <Col xs="12" sm="12" md="12">
              <Card>
                <CardHeader>Danh sách sản phẩm bán chạy</CardHeader>
                <CardBody className="card-body">
                  <div className="chart-wrapper">
                    <BootstrapTable
                      data={this.state.bestseller.map((item, index) => {
                        return { ...item, index: index + 1 };
                      })}
                      version="4"
                      striped
                      hover
                      pagination
                      search
                      options={this.options}
                    >
                      <TableHeaderColumn dataField="index" width="15%">
                        STT
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="sku"
                        width="15%"
                        isKey={true}
                      >
                        Mã SP
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="product"
                        tdStyle={{ whiteSpace: 'normal' }}
                      >
                        Tên Sản phẩm
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="quantity"
                        width="15%"
                        dataSort
                      >
                        Số lượng
                      </TableHeaderColumn>
                    </BootstrapTable>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="12">
              <Card>
                <CardBody className="card-body">
                  <div className="chart-wrapper">
                    <BootstrapTable
                      data={getEmployeeData(
                        this.state.employeeOrder.filter(
                          item => item.ma_bp == this.state.currentShop
                        )
                      )}
                      version="4"
                      striped
                      hover
                      pagination
                      search
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
                        width="10%"
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
                        width="25%"
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
                        dataSort
                        filter={{
                          placeholder: 'Cửa hàng',
                          type: 'TextFilter',
                          condition: 'like'
                        }}
                      >
                        Cửa hàng
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="total_order"
                        width="10%"
                        dataSort
                      >
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
                </CardBody>
              </Card>
            </Col>
            <Col xs="12" sm="12" md="12">
              <Card>
                <CardHeader>Chương trình khuyến mãi đang áp dụng</CardHeader>
                <CardBody className="card-body">
                  <div className="chart-wrapper">
                    <BootstrapTable
                      data={promotionsData}
                      version="4"
                      striped
                      hover
                      search
                      options={this.options}
                    >
                      <TableHeaderColumn
                        dataField="name"
                        tdStyle={{ whiteSpace: 'normal' }}
                        dataSort
                      >
                        Tên Chương trình
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="startDate"
                        tdStyle={{ whiteSpace: 'normal' }}
                        dataSort
                        isKey={true}
                      >
                        Ngày bắt đầu
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="endDate"
                        tdStyle={{ whiteSpace: 'normal' }}
                        dataSort
                      >
                        Ngày kết thúc
                      </TableHeaderColumn>
                    </BootstrapTable>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </div>
        </div>
      </div>
    ) : (
      <Page403 />
    );
  }
}

const getEmployeeData = data => {
  let employeeOrder = [];
  let employeeOrder_input = data;
  employeeOrder_input.map((item, index) => {
    employeeOrder.push({
      ...item,
      index: index + 1
    });
  });
  return employeeOrder;
};

const mapStateToProps = state => ({
  user: state.user,
  data: state.reports.data,
  shops: state.shops.shopsList,
  promotions: state.promotions,
  currentShop: state.shops.currentShop
});

const mapDispatchToProps = dispatch => {
  return {
    onLoadReportdata: (start_date, end_date, stores, query_by) =>
      dispatch(sync_report_data(start_date, end_date, stores, query_by)),
    onLoadAttendancedata: () => dispatch(get_attendance_data()),
    loadingData: () => dispatch({ type: types.LOADING_DATA }),
    finishedLoadingData: () => dispatch({ type: types.FINISHED_LOADING_DATA }),
    onFetchPromotions: () => dispatch(fetchPromotions())
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ShopInfo)
);
