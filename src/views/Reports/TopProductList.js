import React, { Component } from 'react';
import {
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
import { connect } from 'react-redux';
import moment from 'moment';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import * as types from '../../stores/reports/action-types';
import { LoadingOverlay, Loader } from 'react-overlay-loader';
import 'react-overlay-loader/styles.css';
import { DateRangePicker } from 'react-dates';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import MuiThemProvider from 'material-ui/styles/MuiThemeProvider';

class TopProductList extends Component {
  constructor(props) {
    super(props);
    this.updateSelectedShop = this.updateSelectedShop.bind(this);
    this.sync_data = this.sync_data.bind(this);
    this.query_types = {
      day: 'ngày',
      month: 'tháng',
      week: 'tuần'
    };
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
    let selectedShops = Array.from(this.props.selectedShops);
    let select_all_shop = false;
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
    this.state = {
      startDate: moment().subtract(7, 'day'),
      endDate: moment(),
      selectedShops: this.props.selectedShops,
      query_by: 'day',
      is_loading: false,
      sync_default_shop_report: false,
      select_all_shop: select_all_shop
    };
  }

  // case1: selectedShop.length === 0 => reset data in store
  // case2: selectedShop.length >=0 => sync data with stores input
  async sync_data() {
    if (this.state.selectedShops.length == 0) {
      if (this.props.reset_func) {
        await this.props.reset_func(this.props.reset_type);
        return;
      }
    }
    this.setState({ is_loading: true });
    let list_stores = this.state.selectedShops
      .filter(shop => shop != 'select_all')
      .join();
    if (this.props.append_time) {
      await this.props.sync_func(
        this.state.startDate.format('YYYY-MM-DD') + ' 00:00:00',
        this.state.endDate.format('YYYY-MM-DD') + ' 23:59:59',
        list_stores,
        this.state.query_by,
        this.props.sub_type
      );
    } else {
      await this.props.sync_func(
        this.state.startDate.format('YYYY-MM-DD'),
        this.state.endDate.format('YYYY-MM-DD'),
        list_stores,
        this.state.query_by,
        this.props.sub_type
      );
    }
    this.setState({ is_loading: false });
  }

  async componentWillMount() {
    // if (this.state.selectedShops.length > 0) await this.sync_data();
  }

  // Check if shopList has default shop
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

  // If open page first time
  // => selectedShops=[]
  // if com receive 1 more shop => check if shopList has default shop
  // if true => sync data
  // else do nothing
  componentWillReceiveProps(nextProps) {
    if (
      this.state.selectedShops.filter(item => item != 'select_all').length === 0
    ) {
      if (!this.state.sync_default_shop_report) {
        if (this.props.user.profile) {
          if (this.props.user.profile.default_shop) {
            let defaultShopDetail = this.getDefaultShopDetail(
              nextProps.shops,
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

  updateSelectedShop(event, index, selectedShops, sync) {
    // if item has selected or deselected
    if (event) {
      // if data after select has select_all
      if (selectedShops.indexOf('select_all') != -1) {
        // in case deselect 1 item (not select_all) => filter not select_all and set state
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
          // else it select select_all => add select_all to state
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
        // if data after select doesn't have select_all
        // if state before  have select_all => deselect select_all
        // => set state to empty
        if (this.state.selectedShops.indexOf('select_all') != -1) {
          this.setState({ select_all_shop: false }, () => {
            this.setState({
              selectedShops: []
            });
          });
        } else {
          // if state before doesn't have select_all
          // if it select all shops as sync => add select_all to state
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
            //else Set selectedShop to all shop has selected
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

  // Custom render for select field
  selectionRenderer(values) {
    return `${
      values.filter(item => item != 'select_all').length
    } cửa hàng đã chọn`;
  }

  // Dropdown menu for select
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

  getShopName(shops) {
    let shop_names = shops.map(item => ({
      label: item.profile.name,
      value: item.profile.store_id
    }));

    return shop_names;
  }

  render() {
    let shop_names = this.getShopName(this.props.shops);
    return (
      <Card style={{ marginTop: '0px', marginBottom: '1px' }}>
        <CardHeader>Danh sách sản phẩm bán chạy</CardHeader>
        <CardBody className="card-body">
          <LoadingOverlay
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'trans'
            }}
          >
            <div>
              <h1> Sản phẩm </h1>
            </div>
            <div className="chart-wrapper">
              <BootstrapTable
                data={
                  this.props.reset_func
                    ? this.props.bestseller_asia
                    : this.props.bestseller
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
                  width="15%"
                  dataSort
                  isKey={true}
                >
                  STT
                </TableHeaderColumn>
                <TableHeaderColumn
                  hidden={this.props.sub_type ? true : false}
                  dataField="sku"
                  width="15%"
                  dataSort
                >
                  SKU
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="product"
                  tdStyle={{ whiteSpace: 'normal' }}
                  dataSort
                >
                  Tên Sản phẩm
                </TableHeaderColumn>
                <TableHeaderColumn dataField="quantity" width="15%" dataSort>
                  Số lượng
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
              <Col md="6" sm="12" style={{ alignItems: 'center' }}>
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
              <Col md="3" sm="12">
                <Label> {'\u00A0'} </Label>
                <Col xs="2">
                  <Button color="primary" onClick={this.sync_data}>
                    <i className="fa fa-refresh" />
                    {'\u00A0'} Refresh
                  </Button>
                </Col>
              </Col>
            </FormGroup>
            <Loader loading={this.state.is_loading} />
          </LoadingOverlay>
        </CardBody>
      </Card>
    );
  }
}

const getBestSellerData = (state, from_asia) => {
  let bestseller = [];
  let bestseller_input = [];
  if (from_asia) {
    bestseller_input = state.reports.bestseller_asia.data;
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
  shops: state.shops.shopsList,
  bestseller: getBestSellerData(state, false),
  bestseller_asia: getBestSellerData(state, true)
});

export default connect(mapStateToProps, null)(TopProductList);
