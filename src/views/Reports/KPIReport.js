import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Row, Col } from 'reactstrap';
import {
  sync_app_order_kpi,
  reset_report_data,
  syncKPIbyStore
} from '../../stores/reports/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import * as types from '../../stores/reports/action-types';
import OverlayLoader from 'react-overlay-loading/lib/OverlayLoader';
import GroupChartForKpi from './GroupChartForKpi';
import { fetchShops } from '../../stores/shops/actions';

class KPIReport extends Component {
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
      app_order: [],
      app_order_and_not_app_order: []
    };
    this.renderKpiForStore = this.renderKpiForStore.bind(this);
  }

  componentDidMount() {
    this.props.fetchShops();
    // this.props.syncKPIbyStore(
    //   this.state.startDate.format('YYYY-MM-DD'),
    //   this.state.endDate.format('YYYY-MM-DD'),
    //   ['CP12'],
    //   this.state.query_by
    // );
  }

  renderKpiForStore() {
    let _this = this;
    if (this.props.shopList) {
      return this.props.shopList.map(shop => {
        let id = shop.profile.store_id;
        let check =
          _this.props.kpiByStore &&
          _this.props.kpiByStore[shop.profile.store_id];
        // _this.props.kpiByStore[shop.shop_id].total_order &&
        // _this.props.kpiByStore[shop.shop_id].total_grand;

        return (
          <Col xs="12" sm="12" md="6" lg="4" xl="4" key={shop.shop_id}>
            <GroupChartForKpi
              legend={false}
              smallChart={true}
              chartShop={id}
              group_title={'Chi tiết KPI - ' + shop.profile.name}
              chart_type={'bar'}
              chart_name={['order_kpi', 'grand_total_kpi']}
              values={[
                check && _this.props.kpiByStore[id].total_order
                  ? _this.props.kpiByStore[id].total_order.data
                  : [],
                check && _this.props.kpiByStore[id].grand_total
                  ? _this.props.kpiByStore[id].grand_total.data
                  : []
              ]}
              title={['Đơn hàng', 'Doanh thu']}
              columns={[
                check &&
                _this.props.kpiByStore[id].total_order &&
                _this.props.kpiByStore[id].total_order.columns
                  ? _this.props.kpiByStore[id].total_order.columns
                  : [],
                check &&
                _this.props.kpiByStore[id].grand_total &&
                _this.props.kpiByStore[id].grand_total.columns
                  ? _this.props.kpiByStore[id].grand_total.columns
                  : []
              ]}
              note={[
                check &&
                _this.props.kpiByStore[id].total_order &&
                _this.props.kpiByStore[id].total_order.notes
                  ? _this.props.kpiByStore[id].total_order.notes
                  : '',
                check &&
                _this.props.kpiByStore[id].grand_total &&
                _this.props.kpiByStore[id].grand_total.notes
                  ? _this.props.kpiByStore[id].grand_total.notes
                  : ''
              ]}
              text_total={['Tổng số đơn hàng', 'Tổng doanh thu']}
              total_data={[
                check && _this.props.kpiByStore[id].total_order
                  ? _this.props.kpiByStore[id].total_order.total
                  : 0,
                check && _this.props.kpiByStore[id].grand_total
                  ? _this.props.kpiByStore[id].grand_total.total
                  : 0
              ]}
              sync_func={this.props.syncKPIbyStore}
              normalize_param={1}
              reset_type={['SYNC_ORDER_KPI', 'SYNC_GRAND_TOTAL_KPI']}
              stack_columns={[
                this.props.app_order_asia_kpi.stack_columns,
                this.props.app_grand_total_asia_kpi.stack_columns
              ]}
              horizontal_bar={false}
            />
          </Col>
        );
      });
    }
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
      <div className="animated fadeIn" className="col col-md-12">
        <Row>
          <Col md="12">
            <GroupChartForKpi
              group_title={'KPI (Không tính trả hàng)'}
              chart_type={'bar'}
              chart_name={['order_kpi', 'grand_total_kpi']}
              values={[
                this.props.app_order_asia_kpi.data
                  ? this.props.app_order_asia_kpi.data
                  : [],
                this.props.app_grand_total_asia_kpi.data
                  ? this.props.app_grand_total_asia_kpi.data
                  : []
              ]}
              title={['Đơn hàng', 'Doanh thu']}
              columns={[
                this.props.app_order_asia_kpi.columns,
                this.props.app_grand_total_asia_kpi.columns
              ]}
              note={[
                this.props.app_order_asia_kpi.notes,
                this.props.app_grand_total_asia_kpi.notes
              ]}
              text_total={['Tổng số đơn hàng', 'Tổng doanh thu']}
              total_data={[
                this.props.app_order_asia_kpi.total,
                this.props.app_grand_total_asia_kpi.total
              ]}
              sync_func={this.props.sync_app_order_kpi}
              normalize_param={1}
              reset_type={['SYNC_ORDER_KPI', 'SYNC_GRAND_TOTAL_KPI']}
              reset_func={[
                this.props.reset_report_data,
                this.props.reset_report_data
              ]}
              stack_columns={[
                this.props.app_order_asia_kpi.stack_columns,
                this.props.app_grand_total_asia_kpi.stack_columns
              ]}
            />
          </Col>
          {this.renderKpiForStore()}
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  data: state.reports.data,
  shops: state.shops.all_shops,
  shopList: state.shops.shopsList,
  is_loading: state.reports.is_loading,
  app_order_asia_kpi: state.reports.app_order_asia_kpi,
  app_grand_total_asia_kpi: state.reports.app_grand_total_asia_kpi,
  kpiByStore: state.reports.kpiByStore
});

const mapDispatchToProps = dispatch => {
  return {
    fetchShops: () => dispatch(fetchShops()),
    sync_app_order_kpi: (start_date, end_date, stores, query_by, onEnd) =>
      dispatch(
        sync_app_order_kpi(start_date, end_date, stores, query_by, onEnd)
      ),
    syncKPIbyStore: (start_date, end_date, stores, query_by, onEnd) => {
      dispatch(syncKPIbyStore(start_date, end_date, stores, query_by, onEnd));
    }
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(KPIReport)
);
