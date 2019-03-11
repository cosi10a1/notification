import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withRouter,
  Switch,
  Route,
  Redirect,
  NavLink,
  Link
} from 'react-router-dom';
import {
  addEmployeetoShop,
  removeEmployeefromShop
} from '../stores/shops/actions';
import FilteredMultiSelect from 'react-filtered-multiselect';
import {
  Container,
  Row,
  Col,
  CardColumns,
  Card,
  CardBody,
  CardHeader,
  CardBlock,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button
} from 'reactstrap';
import _ from 'lodash';
import ChooseShopDropdown from './ChooseShopDropdown';

const BOOTSTRAP_CLASSES = {
  filter: 'form-control',
  select: 'form-control',
  button: 'btn btn btn-block btn-default',
  buttonActive: 'btn btn btn-block btn-primary'
};
class AddEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedemployees: [],
      is_employees: [],
      not_employees: [],
      modal: false,
      error: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  componentDidMount() {
    this.getData(this.props.currentShop);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentShop != nextProps.currentShop) {
      this.getData(nextProps.currentShop);
    } else if (!_.isEqual(this.props.employees, nextProps.employees)) {
      this.getData(nextProps.currentShop);
    }
  }

  getData(id) {
    let shop_id = id;
    let shops = this.props.shops;
    let shop = shops.find(x => x.shop_id == shop_id);
    let employees = this.props.employees;
    if (shop != null) {
      let current_shop_users = shop.users ? shop.users : {};
      let list_employee_ids = current_shop_users
        ? Object.keys(current_shop_users)
        : [];
      let result = this.employee_to_list_of_row(
        shop,
        this.props.employees,
        list_employee_ids
      );
      this.setState({
        is_employees: result[0],
        not_employees: result[1],
        chooseData: result[2]
      });
    }
  }

  employee_to_list_of_row(shop, employees, list_employee_ids) {
    let is_employees = [];
    let not_employees = [];
    let chooseData = [];
    let keys_of_employee = Object.keys(employees);
    for (let i = 0; i < keys_of_employee.length; i++) {
      if (!list_employee_ids.includes(keys_of_employee[i])) {
        if (
          employees[keys_of_employee[i]] &&
          employees[keys_of_employee[i]].profile
        ) {
          not_employees.push({
            id: keys_of_employee[i],
            name:
              employees[keys_of_employee[i]].profile.displayName +
              ' (Email: ' +
              employees[keys_of_employee[i]].profile.email +
              ')'
          });
        }
      } else {
        if (shop.users[keys_of_employee[i]] == this.props.position) {
          chooseData.push({
            id: keys_of_employee[i],
            name:
              employees[keys_of_employee[i]].profile.displayName +
              ' (Email: ' +
              employees[keys_of_employee[i]].profile.email +
              ')'
          });
        }

        is_employees.push({
          id: keys_of_employee[i],
          name:
            employees[keys_of_employee[i]].profile.displayName +
            ' (Email: ' +
            employees[keys_of_employee[i]].profile.email +
            ')'
        });
      }
    }
    return [is_employees, not_employees, chooseData];
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleSelectionChange(selectedOptions) {
    selectedOptions[0].position = this.props.position;

    this.setState(
      {
        selectedemployees: [...selectedOptions]
      },
      () => {
        this.handleAddEmployeeToShop();
      }
    );
    // this.toggleModal();
  }

  handleDeselected(selectedOptions) {
    let shop_id = this.props.currentShop;
    this.setState({
      selectedemployees: [],
      not_employees: [...this.state.not_employees, ...selectedOptions],
      is_employees: this.state.is_employees.filter(
        c => !selectedOptions.filter(c1 => c1.id == c.id).length
      )
    });
    this.props.removeEmployeefromShop(shop_id, selectedOptions);
  }

  handleAddEmployeeToShop() {
    let selectedOptions = this.state.selectedemployees;
    let undefinedPositionEmployee = selectedOptions.filter(
      employee => 'position' in employee == false
    );

    if (undefinedPositionEmployee.length == 0) {
      this.setState({
        is_employees: [...this.state.is_employees, ...selectedOptions],
        not_employees: this.state.not_employees.filter(
          c => !selectedOptions.filter(c1 => c1.id == c.id).length
        )
      });
      let shop_id = this.props.currentShop;
      this.props.addEmployeetoShop(shop_id, this.state.selectedemployees);
      this.toggleModal();
    } else {
      this.setState({ error: true });
    }
  }

  openModal(position) {
    this.setState({
      modal: true
    });
  }

  onDelete(e) {
    let data = [e];
    this.handleDeselected(data);
  }

  render() {
    let { limit, chooseShop } = this.props;
    let not_employees = this.state.not_employees;
    let is_employees = this.state.is_employees;
    let chooseData = this.state.chooseData;

    return (
      <Col sm="12" md="6">
        <Card>
          <CardHeader>{this.props.title}</CardHeader>
          <CardBody>
            {chooseShop ? (
              <ChooseShopDropdown
                isOpen={this.state.dropdownOpen}
                toggle={this.toggle}
              />
            ) : null}

            <BootstrapTable data={chooseData} version="4" striped hover search>
              <TableHeaderColumn isKey dataField="name" dataSort>
                Tên
              </TableHeaderColumn>

              <TableHeaderColumn
                width={'100px'}
                dataField="edit"
                dataFormat={(cell, row, formatExtraData, index) => {
                  return (
                    <Button color="danger" onClick={() => this.onDelete(row)}>
                      Xoá
                    </Button>
                  );
                }}
              >
                Xoá
              </TableHeaderColumn>
            </BootstrapTable>
            {this.props.limit && chooseData && chooseData.length > 0 ? null : (
              <Button
                color="primary"
                style={{ color: '#ffffff' }}
                onClick={() => this.openModal()}
                style={{ marginTop: '20px' }}
              >
                Thêm{' '}
              </Button>
            )}
          </CardBody>
        </Card>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className="modal-lg"
        >
          <form noValidate>
            <ModalHeader>
              Danh sách nhân viên{' '}
              {this.props.canPromote ? '' : 'không thuộc cửa hàng'}
            </ModalHeader>
            <ModalBody>
              <FilteredMultiSelect
                buttonText="Thêm"
                placeholder="Lọc theo tên"
                classNames={BOOTSTRAP_CLASSES}
                onChange={this.handleSelectionChange.bind(this)}
                options={
                  this.props.canPromote
                    ? [...not_employees, ...is_employees]
                    : not_employees
                }
                size={15}
                textProp="name"
                valueProp="id"
              />
            </ModalBody>
          </form>
        </Modal>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  employees: state.employees,
  shops: state.shops.shopsList
});

const mapDispatchToProps = {
  addEmployeetoShop,
  removeEmployeefromShop
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddEmployee)
);
