import React, { Component } from 'react';
import { connect } from 'react-redux';
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

import Select from 'react-select';
import 'react-select/dist/react-select.css';
class EmployeeSelect extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      selectedOption: null
    };
  }

  handleChange(e) {
    this.setState({
      selectedOption: e
    });
    this.props.handleChange(e);
  }

  getEmployee() {
    let _this = this;
    let employees = [];
    Object.entries(this.props.employees).map(function([key, value]) {
      if (value && value.profile && value.profile.displayName) {
        let employee = { value: key, label: value.profile.displayName };
        employees.push(employee);
      } else {
      }
    });

    return employees;

    // if (employees.length != 0) {
    //   return employees.map((item, index) => {
    //     return (
    //       <option key={item.id} value={item.id}>
    //         {item.profile.displayName}
    //       </option>
    //     );
    //   });
    // }
  }

  render() {
    let data = this.getEmployee();
    let { selectedOption } = this.state;
    let value = selectedOption && selectedOption.value;
    return (
      <FormGroup>
        <Label for="exampleSelectMulti">Chọn nhân viên</Label>

        <Select
          name="form-field-name"
          value={value}
          onChange={this.handleChange}
          options={data}
        />
      </FormGroup>
    );
  }
}

const mapStateToProps = state => ({
  employees: state.employees
});

export default connect(mapStateToProps)(EmployeeSelect);
