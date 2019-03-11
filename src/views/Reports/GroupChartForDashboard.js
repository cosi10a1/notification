import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Label,
  Row,
  Col,
  Button,
  Form,
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
    this.LineButton = this.LineButton.bind(this);
    this.BarButton = this.BarButton.bind(this);
    if (this.props.sumary) {
      this.state = {
        quick_query: 'last7day',
        chart_type: this.props.chart_type ? this.props.chart_type : 'line',
        // startDate: moment().subtract(7, 'day'),
        startDate: moment().startOf('month'),
        endDate: moment(),
        query_by: 'day',
        is_loading: false
      };
    } else {
      this.state = {
        quick_query: 'last7day',
        chart_type: this.props.chart_type ? this.props.chart_type : 'line',
        // startDate: moment().subtract(7, 'day'),
        startDate: moment().subtract(7, 'day'),
        endDate: moment(),
        query_by: 'day',
        is_loading: false
      };
    }
  }
  async componentWillMount() {
    // await this.sync_data();
  }

  LineButton(e) {
    e.preventDefault();
    this.setState({
      chart_type: 'line'
    });
  }

  componentWillReceiveProps(nextProps) {}

  BarButton(e) {
    e.preventDefault();
    this.setState({
      chart_type: 'bar'
    });
  }

  getShopName(shops) {
    let shop_names = shops.map(item => ({
      label: item.profile.name,
      value: item.profile.store_id
    }));
    return shop_names;
  }

  render() {
    let shop_names = this.getShopName(this.props.shops);
    if (this.state.chart_type === 'line') {
      var chart1 = setup_line_chart_data(
        this.props.values[0],
        this.props.columns[0],
        this.props.note[0],
        1,
        this.props.sumary
      );
      var chart2 = setup_line_chart_data(
        this.props.values[1],
        this.props.columns[1],
        this.props.note[1],
        1,
        this.props.sumary
      );
    } else {
      var chart1 = setup_bar_chart_data(
        this.props.values[0],
        this.props.columns[0],
        this.props.note[0],
        1,
        null,
        this.props.sumary
      );
      var chart2 = setup_bar_chart_data(
        this.props.values[1],
        this.props.columns[1],
        this.props.note[1],
        1,
        null,
        this.props.sumary
      );
    }
    return (
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <Row>
                <Col md="10">
                  <h3>{this.props.group_title}</h3>
                </Col>
                {this.props.sumary ? (
                  <Col md="2" />
                ) : (
                  <Col md="2">
                    <Button
                      size="md"
                      color={
                        this.state.chart_type === 'line' ? 'success' : 'danger'
                      }
                      style={{ float: 'right', fontWeight: 'bold' }}
                      onClick={e => this.LineButton(e)}
                    >
                      <i className="" />Biểu đồ đường
                    </Button>
                    <Button
                      size="md"
                      color={
                        this.state.chart_type === 'bar' ? 'success' : 'danger'
                      }
                      style={{ float: 'right', fontWeight: 'bold' }}
                      onClick={e => this.BarButton(e)}
                    >
                      <i className="" /> Biểu đồ cột{' '}
                    </Button>
                  </Col>
                )}
              </Row>
            </CardHeader>
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
                      text_total={this.props.text_total[0]}
                      total_data={this.props.total_data[0]}
                      chart_type={this.state.chart_type}
                      chart={chart1}
                      horizontal_bar={this.props.horizontal_bar}
                      large_text_size={true}
                    />
                    <ChartTemplate
                      chart_name={this.props.chart_name[1]}
                      title={this.props.title[1]}
                      text_total={this.props.text_total[1]}
                      total_data={this.props.total_data[1]}
                      chart_type={this.state.chart_type}
                      chart={chart2}
                      horizontal_bar={this.props.horizontal_bar}
                      large_text_size={true}
                    />
                  </Row>
                </Col>
                <Col md="12">
                  <Form action="" className="form-horizontal">
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <Row>
                            <Label>Khoảng thời gian: {'\u00A0'}</Label>
                          </Row>
                          <Row>
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
                          </Row>
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

const mapStateToProps = state => ({
  shops: state.shops.shopsList
});

export default connect(mapStateToProps, null)(GroupChartForDashboard);
