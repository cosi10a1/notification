import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import {
  sync_report_data,
  get_attendance_data,
  sync_app_order_data,
  sync_app_grand_total_data,
  sync_bestseller_data,
  reset_report_data,
  sync_total_order_data,
  sync_total_grand_total_data,
  sync_employee_order
} from '../../stores/reports/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import TopProductList from './TopProductList';
import * as types from '../../stores/reports/action-types';
import OverlayLoader from 'react-overlay-loading/lib/OverlayLoader';
import GroupChartTemplate from './GroupChartTemplate';
import EmployeeReport from './EmployeeReport';

class Reports extends Component {
  constructor(props) {
    super(props);
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
      startDate: moment().subtract(1, 'day'),
      endDate: moment().add(6, 'day'),
      selectedShops: [],
      query_by: 'day',
      top_products: [],
      app_order: [],
      app_order_and_not_app_order: [],
      best_seller: []
    };
  }

  render() {
    return this.props.is_loading ? (
      <OverlayLoader
        color={'red'} // default is white
        loader="ScaleLoader" // check below for more loaders
        text="Loading... Please wait!"
        active={true}
        backgroundColor={'black'} // default is black
        opacity=".4" // default is .9
      />
    ) : (
      <div className="animated fadeIn" className="container-fluid">
        <Row style={{ marginTop: '20px' }}>
          <Col md="12">
            <GroupChartTemplate
              group_title={'Báo cáo tổng hợp theo cửa hàng'}
              chart_type={'bar'}
              chart_name={['asia_total_order', 'asia_total_grand_total']}
              values={[
                this.props.total_order_asia.data
                  ? this.props.total_order_asia.data
                  : [],
                this.props.total_grand_total_asia.data
                  ? this.props.total_grand_total_asia.data
                  : []
              ]}
              title={[
                'Số đơn theo khoảng thời gian',
                'Doanh thu theo khoảng thời gian'
              ]}
              columns={[
                this.props.total_order_asia.columns,
                this.props.total_grand_total_asia.columns
              ]}
              note={['Số đơn hàng', 'Doanh thu']}
              text_total={['Số đơn', 'Tổng doanh thu']}
              total_data={[
                this.props.total_order_asia.total,
                this.props.total_grand_total_asia.total
              ]}
              user_shops={[this.state.selectedShops.length]}
              sync_func={[
                this.props.sync_total_order_data,
                this.props.sync_total_grand_total_data
              ]}
              normalize_param={[1, 1]}
              reset_type={['SYNC_TOTAL_ORDER', 'SYNC_TOTAL_GRAND_TOTAL']}
              reset_func={[
                this.props.reset_report_data,
                this.props.reset_report_data
              ]}
              sumary={true}
              showTimeRange={true}
              horizontal_bar={true}
              selectedShops={this.props.total_order_asia.store_codes}
            />
            <GroupChartTemplate
              group_title={'Báo cáo theo ngày'}
              chart_type={'line'}
              chart_name={['asia_order_by_day', 'asia_grand_total_by_day']}
              values={[
                this.props.app_order_asia.data
                  ? this.props.app_order_asia.data
                  : [],
                this.props.grand_total_asia.data
                  ? this.props.grand_total_asia.data
                  : []
              ]}
              title={['Đơn hàng theo ngày', 'Doanh thu theo ngày']}
              columns={[
                this.props.app_order_asia.columns,
                this.props.grand_total_asia.columns
              ]}
              note={[
                this.props.app_order_asia.notes,
                this.props.grand_total_asia.notes
              ]}
              text_total={['Tổng số đơn hàng', 'Tổng doanh thu']}
              total_data={[
                this.props.app_order_asia.total,
                this.props.grand_total_asia.total
              ]}
              user_shops={[this.state.selectedShops.length]}
              sync_func={[
                this.props.sync_app_order_data,
                this.props.sync_app_grand_total_data
              ]}
              normalize_param={[1, 1]}
              reset_type={['SYNC_ORDER', 'SYNC_GRAND_TOTAL']}
              reset_func={[
                this.props.reset_report_data,
                this.props.reset_report_data
              ]}
              sumary={false}
              showTimeRange={false}
              horizontal_bar={false}
              selectedShops={this.props.app_order_asia.store_codes}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: '20px' }}>
          <Col sm="12">
            <TopProductList
              sync_func={this.props.sync_bestseller_data}
              reset_func={this.props.reset_report_data}
              reset_type={'SYNC_BEST_SELLER'}
              selectedShops={this.props.bestseller_asia.store_codes}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: '20px' }}>
          <Col sm="12">
            <EmployeeReport sync_func={this.props.sync_employee_order} />
          </Col>
        </Row>
      </div>
    );
  }
}

const getBestSellerData = (state, from_asia) => {
  let bestseller = [];
  let bestseller_input = [];
  if (from_asia) {
    bestseller_input = state.reports.bestseller_asia;
  } else {
    bestseller_input = state.reports.bestseller;
  }
  let temp_item = {};
  bestseller_input.map((item, index) => {
    bestseller.push({
      ...item,
      index: index + 1
    });
  });
  return bestseller;
};

const mapStateToProps = state => ({
  user: state.user,
  data: state.reports.data,
  shops: state.shops.shopsList,
  attendances: state.reports.attendances,
  bestseller_asia: state.reports.bestseller_asia,
  is_loading: state.reports.is_loading,
  app_order_asia: state.reports.app_order_asia,
  grand_total_asia: state.reports.grand_total_asia,
  app_order: state.reports.app_order,
  grand_total: state.reports.grand_total,
  total_grand_total_asia: state.reports.total_grand_total_asia,
  total_order_asia: state.reports.total_order_asia
});

const mapDispatchToProps = dispatch => {
  return {
    onLoadReportdata: (start_date, end_date, stores, query_by, sub_type) =>
      dispatch(
        sync_report_data(start_date, end_date, stores, query_by, sub_type)
      ),
    onLoadAttendancedata: () => dispatch(get_attendance_data()),
    loadingData: () => dispatch({ type: types.LOADING_DATA }),
    finishedLoadingData: () => dispatch({ type: types.FINISHED_LOADING_DATA }),
    sync_app_order_data: (start_date, end_date, stores, query_by) =>
      dispatch(sync_app_order_data(start_date, end_date, stores, query_by)),
    sync_app_grand_total_data: (start_date, end_date, stores, query_by) =>
      dispatch(
        sync_app_grand_total_data(start_date, end_date, stores, query_by)
      ),
    sync_bestseller_data: (start_date, end_date, stores, query_by) =>
      dispatch(sync_bestseller_data(start_date, end_date, stores, query_by)),
    reset_report_data: sub_type => dispatch(reset_report_data(sub_type)),
    sync_total_order_data: (start_date, end_date, stores, query_by) =>
      dispatch(sync_total_order_data(start_date, end_date, stores, query_by)),
    sync_total_grand_total_data: (start_date, end_date, stores, query_by) =>
      dispatch(
        sync_total_grand_total_data(start_date, end_date, stores, query_by)
      ),
    sync_employee_order: (start_date, end_date, stores, query_by) =>
      dispatch(sync_employee_order(start_date, end_date, stores, query_by))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Reports)
);
