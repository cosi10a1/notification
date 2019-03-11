import React, { Component } from 'react';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import { Row, Col } from 'reactstrap';
import {
  sync_app_order_data,
  sync_app_grand_total_data,
  sync_total_order_data,
  sync_total_grand_total_data
} from '../../stores/reports/actions';
import { fetchShops } from '../../stores/shops/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import * as types from '../../stores/reports/action-types';
import GroupChartForDashboard from './GroupChartForDashboard';

class DashboardReport extends Component {
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
      expanding: [1],
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
      ]
    };
    this.timer = this.timer.bind(this);
    this.state = {
      startDate: moment().startOf('month'),
      endDate: moment(),
      selectedShops: [],
      query_by: 'day',
      top_products: [],
      app_order: [],
      app_order_and_not_app_order: [],
      is_com1: true
    };
  }

  timer() {
    this.setState({ is_com1: !this.state.is_com1 });
  }

  componentWillMount() {
    this.props.fetchShops();
    // this.sync_data();
    // set time to sync_shop
    clearInterval(this.state.interval);
  }

  componentDidMount() {
    var interval = setInterval(this.timer, 15000);
    this.setState({ interval: interval });
  }

  sync_data(stores) {
    this.props.sync_app_order_data(
      this.state.startDate.format('YYYY-MM-DD'),
      this.state.endDate.format('YYYY-MM-DD'),
      stores,
      'day',
      true
    );
    this.props.sync_app_grand_total_data(
      this.state.startDate.format('YYYY-MM-DD'),
      this.state.endDate.format('YYYY-MM-DD'),
      stores,
      'day',
      true
    );
    this.props.sync_total_grand_total_data(
      this.state.startDate.format('YYYY-MM-DD'),
      this.state.endDate.format('YYYY-MM-DD'),
      stores,
      'day',
      true
    );
    this.props.sync_total_order_data(
      this.state.startDate.format('YYYY-MM-DD'),
      this.state.endDate.format('YYYY-MM-DD'),
      stores,
      'day',
      true
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.shops != nextProps.shops) {
      let stores = this.getShopName(nextProps.shops)
        .map(item => item.value)
        .join();
      //Update data here
      this.sync_data(stores);
    }
  }

  getShopName(shops) {
    let shop_names = shops.map(item => ({
      label: item.profile.name,
      value: item.profile.store_id
    }));

    return shop_names;
  }

  render() {
    return (
      <div className="animated fadeIn" className="container-fluid">
        <Row style={{ marginTop: '20px' }}>
          <Col md="12">
            {this.state.is_com1 ? (
              <GroupChartForDashboard
                group_title={'Báo cáo tổng hợp theo cửa hàng trong tháng'}
                chart_type={'bar'}
                chart_name={['asia_total_order', 'asia_total_grand_total']}
                update_every_seconds={true}
                values={[
                  this.props.total_order_asia_dashboard.data
                    ? this.props.total_order_asia_dashboard.data
                    : [],
                  this.props.total_grand_total_asia_dashboard.data
                    ? this.props.total_grand_total_asia_dashboard.data
                    : []
                ]}
                title={[
                  'Số đơn theo khoảng thời gian',
                  'Doanh thu theo khoảng thời gian'
                ]}
                columns={[
                  this.props.total_order_asia_dashboard.columns,
                  this.props.total_grand_total_asia_dashboard.columns
                ]}
                note={['Số đơn hàng', 'Doanh thu']}
                text_total={['Số đơn', 'Tổng doanh thu']}
                total_data={[
                  this.props.total_order_asia_dashboard.total,
                  this.props.total_grand_total_asia_dashboard.total
                ]}
                user_shops={[this.state.selectedShops.length]}
                sync_func={[
                  this.props.sync_total_order_data,
                  this.props.sync_total_grand_total_data
                ]}
                normalize_param={[1, 1]}
                sumary={true}
                showTimeRange={true}
                horizontal_bar={true}
              />
            ) : (
              <GroupChartForDashboard
                group_title={'Báo cáo theo ngày'}
                chart_type={'line'}
                chart_name={['asia_order_by_day', 'asia_grand_total_by_day']}
                update_every_seconds={true}
                values={[
                  this.props.app_order_asia_dashboard.data
                    ? this.props.app_order_asia_dashboard.data
                    : [],
                  this.props.grand_total_asia_dashboard.data
                    ? this.props.grand_total_asia_dashboard.data
                    : []
                ]}
                title={['Đơn hàng theo ngày', 'Doanh thu theo ngày']}
                columns={[
                  this.props.app_order_asia_dashboard.columns,
                  this.props.grand_total_asia_dashboard.columns
                ]}
                note={[
                  this.props.app_order_asia_dashboard.notes,
                  this.props.grand_total_asia_dashboard.notes
                ]}
                text_total={['Tổng số đơn hàng', 'Tổng doanh thu']}
                total_data={[
                  this.props.app_order_asia_dashboard.total,
                  this.props.grand_total_asia_dashboard.total
                ]}
                user_shops={[this.state.selectedShops.length]}
                sync_func={[
                  this.props.sync_app_order_data,
                  this.props.sync_app_grand_total_data
                ]}
                normalize_param={[1, 1]}
                sumary={false}
                showTimeRange={false}
                horizontal_bar={false}
              />
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  shops: state.shops.all_shops,
  is_loading: state.reports.is_loading,
  app_order_asia_dashboard: state.reports.app_order_asia_dashboard,
  grand_total_asia_dashboard: state.reports.grand_total_asia_dashboard,
  total_grand_total_asia_dashboard:
    state.reports.total_grand_total_asia_dashboard,
  total_order_asia_dashboard: state.reports.total_order_asia_dashboard
});

const mapDispatchToProps = dispatch => {
  return {
    fetchShops: () => dispatch(fetchShops()),
    loadingData: () => dispatch({ type: types.LOADING_DATA }),
    finishedLoadingData: () => dispatch({ type: types.FINISHED_LOADING_DATA }),
    sync_app_order_data: (
      start_date,
      end_date,
      stores,
      query_by,
      from_dashboard_report
    ) =>
      dispatch(
        sync_app_order_data(
          start_date,
          end_date,
          stores,
          query_by,
          from_dashboard_report
        )
      ),
    sync_app_grand_total_data: (
      start_date,
      end_date,
      stores,
      query_by,
      from_dashboard_report
    ) =>
      dispatch(
        sync_app_grand_total_data(
          start_date,
          end_date,
          stores,
          query_by,
          from_dashboard_report
        )
      ),
    sync_total_order_data: (
      start_date,
      end_date,
      stores,
      query_by,
      from_dashboard_report
    ) =>
      dispatch(
        sync_total_order_data(
          start_date,
          end_date,
          stores,
          query_by,
          from_dashboard_report
        )
      ),
    sync_total_grand_total_data: (
      start_date,
      end_date,
      stores,
      query_by,
      from_dashboard_report
    ) =>
      dispatch(
        sync_total_grand_total_data(
          start_date,
          end_date,
          stores,
          query_by,
          from_dashboard_report
        )
      )
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DashboardReport)
);
