import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  CardColumns,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Label,
  Row,
  Col,
  Button,
  Form,
  Input
} from 'reactstrap';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  setup_line_chart_data,
  setup_bar_chart_data
} from '../../helpers/setup_chart_data';
import { numberWithCommas } from '../../helpers/number_helper';
import { LoadingOverlay, Loader } from 'react-overlay-loader';
import { DateRangePicker, SingleDatePicker } from 'react-dates';
import ChartTemplate from './ChartTemplate';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import MuiThemProvider from 'material-ui/styles/MuiThemeProvider';

class GroupChartTemplate extends Component {
  constructor(props) {
    super(props);
    this.sync_data = this.sync_data.bind(this);
    this.updateSelectedShop = this.updateSelectedShop.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
    this.updateQuickQuery = this.updateQuickQuery.bind(this);
    let sync_default_shop_report = false;
    this.sync_data_on_open_page = this.sync_data_on_open_page.bind(this);
    let selectedShops = Array.from(this.props.selectedShops);
    let select_all_shop = false;
    // With props selectedShops(get from store)
    // If all shop as select => add select_all to state
    // Else do nothing
    if (
      this.props.selectedShops
        .filter(item => item != 'select_all')
        .sort()
        .join() ===
        this.getShopName(this.props.shops)
          .map(item => item.value)
          .sort()
          .join() &&
      this.props.selectedShops.indexOf('select_all') == -1 &&
      selectedShops.filter(item => item != 'select_all').length > 0
    ) {
      selectedShops = [...this.props.selectedShops, 'select_all'];
      select_all_shop = true;
    }
    if (this.props.sumary) {
      this.state = {
        quick_query: 'last7day',
        chart_type: this.props.chart_type ? this.props.chart_type : 'line',
        startDate: moment().subtract(7, 'day'),
        endDate: moment(),
        selectedShops: selectedShops,
        query_by: 'day',
        is_loading: false,
        custom: false,
        sync_default_shop_report: sync_default_shop_report,
        select_all_shop: select_all_shop
      };
    } else {
      this.state = {
        quick_query: 'last7day',
        chart_type: this.props.chart_type ? this.props.chart_type : 'line',
        startDate: moment().subtract(7, 'day'),
        endDate: moment(),
        selectedShops: selectedShops,
        query_by: 'day',
        is_loading: false,
        custom: false,
        sync_default_shop_report: sync_default_shop_report,
        select_all_shop: select_all_shop
      };
    }
  }

  componentWillMount() {}

  //Custom render select field
  selectionRenderer(values) {
    return `${
      values.filter(item => item != 'select_all').length
    } cửa hàng đã chọn`;
  }

  menuItems(shops) {
    let menuItems = shops.map(shop => (
      <MenuItem
        key={shop.value}
        insetChildren={true}
        checked={this.state.selectedShops.indexOf(shop.value) > -1}
        value={shop.value}
        primaryText={shop.label}
      />
    ));
    menuItems.unshift(
      <MenuItem
        key={'select_all'}
        insetChildren={true}
        checked={this.state.select_all_shop}
        value={'select_all'}
        primaryText={'Chọn tất cả'}
      />
    );
    return menuItems;
  }

  async componentWillMount() {
    // await this.sync_data();
  }
  updateQuery(e) {
    e.preventDefault();
    this.setState({
      query_by: e.target.value
    });
  }

  updateQuickQuery(e) {
    e.preventDefault();
    switch (e.target.value) {
      case 'custom':
        this.setState({
          quick_query: 'custom',
          startDate: moment(),
          endDate: moment()
        });
        break;
      case 'last30day':
        this.setState(
          {
            quick_query: e.target.value,
            startDate: moment().subtract(30, 'day'),
            endDate: moment()
          },
          () => {}
        );
        break;
      default:
        this.setState({
          quick_query: e.target.value,
          startDate: moment().subtract(7, 'day'),
          endDate: moment()
        });
        break;
    }
  }

  componentDidMount() {
    this.sync_data_on_open_page(this.props.shops);
  }

  sync_data_on_open_page(shopList) {
    if (
      this.state.selectedShops.filter(item => item != 'select_all').length === 0
    ) {
      if (!this.state.sync_default_shop_report) {
        if (this.props.user.profile) {
          if (this.props.user.profile.default_shop) {
            let defaultShopDetail = this.getDefaultShopDetail(
              shopList,
              this.props.user.profile.default_shop
            );
            if (defaultShopDetail) {
              let newShops = this.getShopName([defaultShopDetail]).map(
                shop => shop.value
              );
              this.updateSelectedShop(null, null, newShops, true);
              this.setState({ sync_default_shop_report: true });
            }
          }
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.sync_data_on_open_page(nextProps.shops);
  }

  getDefaultShopDetail(shopList, defaulShop) {
    let filtered_defaultShop = shopList.filter(
      shop => shop.shop_id == defaulShop
    );
    if (filtered_defaultShop.length > 0) {
      return filtered_defaultShop[0];
    } else {
      return null;
    }
  }

  updateSelectedShop(event, index, selectedShops, sync) {
    if (event) {
      if (selectedShops.indexOf('select_all') != -1) {
        // If value after contain select_all
        //Case 1: unselect one items
        // Case2: select select_all
        if (
          this.state.selectedShops
            .filter(item => item != 'select_all')
            .sort()
            .join() !=
          selectedShops
            .filter(item => item != 'select_all')
            .sort()
            .join()
        ) {
          this.setState({ select_all_shop: false }, () => {
            this.setState({
              selectedShops: selectedShops.filter(item => item != 'select_all')
            });
          });
        } else {
          this.setState({ select_all_shop: true }, () => {
            let newSelectedShops = this.getShopName(this.props.shops).map(
              item => item.value
            );
            newSelectedShops.push('select_all');
            this.setState({
              selectedShops: newSelectedShops
            });
          });
        }
      } else {
        // If value after doesn't contain  select_all
        // Case1: unselect select_all => Remove all selected Shops
        // Case2: select all shop exclude select_all  => add select_all to selectedshops and sync
        if (this.state.selectedShops.indexOf('select_all') != -1) {
          this.setState({ select_all_shop: false }, () => {
            this.setState({
              selectedShops: []
            });
          });
        } else {
          if (
            selectedShops.sort().join() ==
            this.getShopName(this.props.shops)
              .map(item => item.value)
              .sort()
              .join()
          ) {
            //Set select_all to true
            let newSelectedShops = Array.from(selectedShops);
            newSelectedShops.push('select_all');
            this.setState({ select_all_shop: true }, () => {
              this.setState({
                selectedShops: newSelectedShops
              });
            });
          } else {
            //Set selectedShop to all shop has selected
            this.setState({ select_all_shop: false }, () => {
              this.setState({
                selectedShops: selectedShops
              });
            });
          }
        }
      }
    }
    this.setState({ selectedShops }, () => {
      if (sync) {
        this.sync_data();
      }
    });
  }

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

  async sync_data() {
    if (this.state.selectedShops.length == 0) {
      if (this.props.reset_func) {
        await this.props.reset_func[0](this.props.reset_type[0]);
        await this.props.reset_func[1](this.props.reset_type[1]);
        return;
      }
    }
    this.setState({ is_loading: true });
    let list_stores = this.state.selectedShops
      .filter(shop => shop != 'select_all')
      .join();
    if (this.props.append_time) {
      await this.props.sync_func[0](
        this.state.startDate.format('YYYY-MM-DD') + ' 00:00:00',
        this.state.endDate.format('YYYY-MM-DD') + ' 23:59:59',
        list_stores,
        this.state.query_by,
        this.props.sub_type
      );
      await this.props.sync_func[1](
        this.state.startDate.format('YYYY-MM-DD') + ' 00:00:00',
        this.state.endDate.format('YYYY-MM-DD') + ' 23:59:59',
        list_stores,
        this.state.query_by,
        this.props.sub_type
      );
    } else {
      await this.props.sync_func[0](
        this.state.startDate.format('YYYY-MM-DD'),
        this.state.endDate.format('YYYY-MM-DD'),
        list_stores,
        this.state.query_by,
        this.props.sub_type
      );
      await this.props.sync_func[1](
        this.state.startDate.format('YYYY-MM-DD'),
        this.state.endDate.format('YYYY-MM-DD'),
        list_stores,
        this.state.query_by,
        this.props.sub_type
      );
    }
    this.setState({ is_loading: false });
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
      <Card style={{ marginTop: '0px', marginBottom: '20px' }}>
        <CardBody>
          <LoadingOverlay
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'trans'
            }}
          >
            <Row>
              <ChartTemplate
                chart_name={this.props.chart_name[0]}
                title={this.props.title[0]}
                text_total={this.props.text_total[0]}
                total_data={this.props.total_data[0]}
                chart_type={this.state.chart_type}
                chart={chart1}
                horizontal_bar={this.props.horizontal_bar}
              />
              <ChartTemplate
                chart_name={this.props.chart_name[1]}
                title={this.props.title[1]}
                text_total={this.props.text_total[1]}
                total_data={this.props.total_data[1]}
                chart_type={this.state.chart_type}
                chart={chart2}
                horizontal_bar={this.props.horizontal_bar}
              />
            </Row>

            <FormGroup row>
              {this.props.showTimeRange ? (
                <Col md="4">
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
              ) : (
                <Col md="4">
                  <Label>Khoảng thời gian:{'\u00A0'} </Label>
                  <div>
                    <Input
                      type="select"
                      name="ccmonth"
                      id="ccmonth"
                      value={this.state.quick_query}
                      onChange={e => this.updateQuickQuery(e)}
                    >
                      <option value="custom">Tùy chỉnh</option>
                      <option value="last7day">7 ngày gần nhất</option>
                      <option value="last30day">30 ngày gần nhất</option>
                    </Input>
                  </div>

                  {this.state.quick_query === 'custom' ? (
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
                  ) : (
                    <div />
                  )}
                </Col>
              )}
              <Col md="4">
                <Label>Cửa hàng: </Label>

                <div>
                  <MuiThemProvider>
                    <SelectField
                      autoWidth={true}
                      multiple={true}
                      hintText="Chọn cửa hàng"
                      value={this.state.selectedShops}
                      onChange={this.updateSelectedShop}
                      selectionRenderer={this.selectionRenderer}
                      style={{ width: '70%', border: 'dash' }}
                      hintStyle={{ color: 'black', opacity: 0 }}
                    >
                      {this.menuItems(shop_names)}
                    </SelectField>
                  </MuiThemProvider>
                </div>
              </Col>
              <Col md="4">
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

const mapStateToProps = state => ({
  user: state.user,
  shops: state.shops.shopsList
});

export default connect(mapStateToProps, null)(GroupChartTemplate);
