import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Label,
  Row,
  Col,
  Input,
  Button,
  Form
} from 'reactstrap';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  setup_line_chart_data,
  setup_bar_chart_data
} from '../../helpers/setup_chart_data';
import { numberWithCommas } from '../../helpers/number_helper';
import { LoadingOverlay, Loader } from 'react-overlay-loader';
import { DateRangePicker } from 'react-dates';
import ChartTemplate from './ChartTemplate';

class GroupChartForDashboard extends Component {
  constructor(props) {
    super(props);
    this.sync_data = this.sync_data.bind(this);
    if (this.props.sumary) {
      this.state = {
        quick_query: 'last7day',
        chart_type: this.props.chart_type ? this.props.chart_type : 'line',
        startDate: moment().startOf('month'),
        endDate: moment(),
        selectedShops: [],
        query_by: 'day',
        is_loading: false,
        custom: false,
        is_sync: false
      };
    } else {
      this.state = {
        quick_query: 'last7day',
        chart_type: this.props.chart_type ? this.props.chart_type : 'line',
        startDate: moment().subtract(7, 'day'),
        endDate: moment(),
        selectedShops: [],
        query_by: 'day',
        is_loading: false,
        custom: false,
        is_sync: []
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.shops != nextProps.shops) {
      this.updateSelectedShop(this.getShopName(nextProps.shops), true);
    }
  }

  componentDidMount() {
    if (this.props.chartShop) {
      this.sync_data();
    }
  }

  updateSelectedShop(selectedShops, sync) {
    this.setState({ selectedShops }, () => {
      if (sync) {
        this.sync_data();
      }
    });
  }

  getShopName(shops) {
    let shop_names = shops.map(item => ({
      label: item.profile.name,
      value: item.profile.store_id
    }));
    return shop_names;
  }

  sync_data() {
    this.setState({ is_loading: true }, () => {
      let list_stores = this.state.selectedShops.map(item => item.value).join();
      if (this.props.chartShop) {
        this.props.sync_func(
          this.state.startDate.format('YYYY-MM-DD'),
          this.state.endDate.format('YYYY-MM-DD'),
          this.props.chartShop ? [this.props.chartShop] : list_stores,
          this.state.query_by,
          () => this.setState({ is_loading: false })
        );
      } else {
        this.props.sync_func(
          this.state.startDate.format('YYYY-MM-DD'),
          this.state.endDate.format('YYYY-MM-DD'),
          this.props.chartShop ? [this.props.chartShop] : list_stores,
          this.state.query_by,
          () => this.setState({ is_loading: false })
        );
      }
    });
  }

  render() {
    let shop_names = this.getShopName(this.props.shops);
    if (this.state.chart_type === 'line') {
      var chart1 = setup_line_chart_data(
        this.props.values[0],
        this.props.columns[0],
        this.props.note[0],
        1,
        this.props.stack_columns[0],
        this.props.sumary
      );
      var chart2 = setup_line_chart_data(
        this.props.values[1],
        this.props.columns[1],
        this.props.note[1],
        1,
        this.props.stack_columns[1],
        this.props.sumary
      );
    } else {
      var chart1 = setup_bar_chart_data(
        this.props.values[0],
        this.props.columns[0],
        this.props.note[0],
        1,
        this.props.stack_columns[0],
        this.props.sumary
      );
      var chart2 = setup_bar_chart_data(
        this.props.values[1],
        this.props.columns[1],
        this.props.note[1],
        1,
        this.props.stack_columns[1],
        this.props.sumary
      );
    }

    return (
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>{this.props.group_title}</CardHeader>
            <CardBody>
              <LoadingOverlay
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'trans'
                }}
              >
                <Col md="12">
                  <Row>
                    <ChartTemplate
                      chart_name={this.props.chart_name[0]}
                      title={this.props.title[0]}
                      smallChart={this.props.smallChart}
                      text_total={this.props.text_total[0]}
                      total_data={this.props.total_data[0]}
                      chart_type={this.state.chart_type}
                      chart={chart1}
                      horizontal_bar={this.props.horizontal_bar}
                      large_text_size={false}
                      stacked={true}
                      legend={this.props.legend}
                    />
                    <ChartTemplate
                      chart_name={this.props.chart_name[1]}
                      title={this.props.title[1]}
                      smallChart={this.props.smallChart}
                      text_total={this.props.text_total[1]}
                      total_data={this.props.total_data[1]}
                      chart_type={this.state.chart_type}
                      chart={chart2}
                      horizontal_bar={this.props.horizontal_bar}
                      large_text_size={false}
                      stacked={true}
                      legend={this.props.legend}
                    />
                  </Row>
                </Col>

                {this.props.smallChart && chart1.datasets.length > 0 ? (
                  <Col md="12">
                    <div
                      style={{
                        fontSize: '10px',
                        flexDirection: 'row',
                        marginBottom: '5px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <div
                        style={{
                          width: '25px',
                          height: '10px',
                          backgroundColor: chart1.datasets[0].backgroundColor
                        }}
                      />
                      <div style={{ marginLeft: '2px' }}>
                        {this.props.note[0][0]}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        flexDirection: 'row',
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '5px'
                      }}
                    >
                      <div
                        style={{
                          width: '25px',
                          height: '10px',
                          backgroundColor:
                            chart1.datasets.length > 1
                              ? chart1.datasets[1].backgroundColor
                              : 'transparent'
                        }}
                      />
                      <div style={{ marginLeft: '2px' }}>
                        {this.props.note[0][1]}
                      </div>
                    </div>
                  </Col>
                ) : null}
                <Col md="12">
                  <Form action="" className="form-horizontal">
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <Label>Khoảng thời gian: {'\u00A0'}</Label>
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
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label> {'\u00A0'} </Label>
                          <Col xs="2">
                            <Button color="primary" onClick={this.sync_data}>
                              <i className="fa fa-refresh" />
                              {'\u00A0'} Refresh
                            </Button>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </Col>
                <Loader loading={this.state.is_loading} />
              </LoadingOverlay>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

GroupChartForDashboard.defaultProps = {
  legend: true,
  smallChart: false
};

const mapStateToProps = state => ({
  shops: state.shops.all_shops
});

export default connect(mapStateToProps, null)(GroupChartForDashboard);
