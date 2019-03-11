import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  withRouter,
  Switch,
  Route,
  Redirect,
  NavLink,
  Link
} from 'react-router-dom';
import firebase from 'firebase';
import config from '../../config';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import {
  Button,
  Badge,
  Row,
  Col,
  Card,
  CardHeader,
  CardLink,
  CardBody,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  ButtonGroup,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
  Container
} from 'reactstrap';
import Select from 'react-select';
import OverlayLoader from 'react-overlay-loading/lib/OverlayLoader';

import { fetchPromotions } from '../../stores/promotions/actions';
import * as PermissionConstants from '../../constants/PermissionConstants';
import Page403 from '../Pages/403/403';
import * as PermissionHelpers from '../../helpers/permission-helpers';

class PromotionList extends Component {
  constructor(props) {
    super(props);
    this.options = {
      sortIndicator: true,
      hideSizePerPage: true,
      paginationSize: 3,
      hidePageListOnlyOnePage: true,
      clearSearch: true,
      alwaysShowAllBtns: false,
      withFirstAndLast: false,
      clearSearch: false,
      searchPosition: 'left',
      onRowClick: (row, rowIndex, columnIndex, event) =>
        this.props.history.push(`/promotions/${row.key}/edit`)
    };
    this.state = {
      status: '',
      branch: ''
    };
    this.getData = this.getData.bind(this);
    this.getShopName = this.getShopName.bind(this);
  }

  componentDidMount() {
    this.props.onFetchPromotions();
  }

  getData() {
    let promotions = this.props.promotions;
    if (this.state.status != '' || this.state.branch != '') {
      if (this.state.status == 'active') {
        promotions = this.props.promotions
          .filter(item => Date.now() <= item.date.endDate)
          .filter(item => item.branches.includes(this.state.branch) == true);
      } else if (this.state.status == 'deactive') {
        promotions = this.props.promotions
          .filter(item => Date.now() > item.date.endDate)
          .filter(item => item.branches.includes(this.state.branch) == true);
      } else {
        promotions = this.props.promotions.filter(
          item => item.branches.includes(this.state.branch) == true
        );
      }
    }
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

  handlePromotionWithStatus(status) {
    this.setState({ ...this.state, status: status.value });
  }

  handlePromotionWithBranches(branch) {
    if (branch != undefined) {
      this.setState({ ...this.state, branch: branch.value });
    }
  }

  getShopName() {
    let shop_names = this.props.shops.map(item => ({
      label: item.profile.name,
      value: item.profile.store_id
    }));

    return shop_names;
  }

  render() {
    let promotion = this.getData();
    let shop_names = this.getShopName();
    let { user } = this.props;
    return !this.props.user.profile ? (
      <Container fluid>
        <div className="row justify-content-center">
          <div className="col col-lg-8 text-center">
            <OverlayLoader
              color={'red'} // default is white
              loader="ScaleLoader" // check below for more loaders
              text="Loading... Please wait!"
              active={true}
              backgroundColor={'black'} // default is black
              opacity=".4" // default is .9
            />
          </div>
        </div>
      </Container>
    ) : user.permissions &&
    (PermissionHelpers.havePermission(
      user,
      PermissionConstants.CREATE_PROMOTION
    ) ||
      PermissionHelpers.havePermission(
        user,
        PermissionConstants.EDIT_PROMOTION
      ) ||
      PermissionHelpers.havePermission(
        user,
        PermissionConstants.DELETE_PROMOTION
      ) ||
      PermissionHelpers.havePermission(
        user,
        PermissionConstants.VIEW_PROMOTION
      )) ? (
      <div
        className="animated fadeIn"
        style={{ fontSize: '15px', marginTop: '7px' }}
      >
        <Row>
          <Col sm="12" md={{ size: 10, offset: 1 }}>
            <Card style={{ marginTop: '20px' }}>
              <CardHeader>
                <Row>
                  <Col md="6">
                    <i className="fa fa-align-justify" /> Danh sách chương trình
                    khuyến mãi
                  </Col>
                  <Col md="6">
                    {PermissionHelpers.havePermission(
                      user,
                      PermissionConstants.CREATE_PROMOTION
                    ) ? (
                      <Link
                        to={{
                          pathname: '/promotions/add_promotion/'
                        }}
                      >
                        <Button
                          size="md"
                          color="success"
                          style={{ float: 'right', fontWeight: 'bold' }}
                        >
                          <i className="fa fa-plus" /> Thêm khuyến mãi
                        </Button>
                      </Link>
                    ) : null}
                  </Col>
                </Row>
              </CardHeader>

              <CardBody>
                <Row style={{ marginBottom: '5px' }}>
                  <Col xs="12" md="2">
                    <Select
                      autosize={false}
                      name="status"
                      clearable={false}
                      value={this.state.status}
                      options={[
                        { label: 'Tất cả khuyến mãi', value: '' },
                        { label: 'Hiệu lực', value: 'active' },
                        { label: 'Hết hiệu lực', value: 'deactive' }
                      ]}
                      onChange={this.handlePromotionWithStatus.bind(this)}
                    />
                  </Col>
                  <Col xs="12" md="4">
                    <Select
                      autosize={false}
                      name="branches"
                      placeholder="Chọn cửa hàng"
                      value={this.state.branch}
                      options={shop_names}
                      clearable={false}
                      onChange={this.handlePromotionWithBranches.bind(this)}
                    />
                  </Col>
                </Row>
                <BootstrapTable
                  data={promotion}
                  version="4"
                  striped
                  hover
                  pagination
                  search
                  options={this.options}
                  searchPlaceholder={'Tìm kiếm'}
                >
                  <TableHeaderColumn isKey dataField="name" dataSort>
                    Tên chương trình
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="startDate">
                    Ngày bắt đầu
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="endDate">
                    Ngày kết thúc
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="branches" dataSort>
                    Chi nhánh
                  </TableHeaderColumn>
                </BootstrapTable>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    ) : (
      <Page403 />
    );
  }
}

const mapStateToProps = state => ({
  promotions: state.promotions,
  shops: state.shops.shopsList,
  user: state.user
});

const mapDispatchToProps = dispatch => {
  return {
    onFetchPromotions: () => dispatch(fetchPromotions())
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PromotionList)
);
