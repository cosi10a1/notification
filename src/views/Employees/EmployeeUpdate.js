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
  Badge,
  Row,
  Col,
  Container,
  Card,
  CardHeader,
  CardBody,
  Input,
  Label
} from 'reactstrap';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { fetchEmployees, updateEmployee } from '../../stores/employees/actions';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';

class EmployeeUpdate extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      ...this.state,
      employeeId: this.props.match.params.employee_id
        ? this.props.match.params.employee_id
        : null,
      employee: {
        profile: {
          displayName: '',
          email: '',
          phoneNumber: '',
          default_shop: '',
          default_provider: '',
          photoURL: ''
        },
        providers: [],
        shops: []
      },
      isChecked: {},
      position: '',
      shop_id: this.props.match.params.shop_id
        ? this.props.match.params.shop_id
        : null
    };
  }

  handleChange(field1, field2, e) {
    this.setState({
      isChecked: !this.state.isChecked
    });
    const updateEmployee = { ...this.state.employee };
    updateEmployee[field1][field2] = e.target.value;
    this.setState({ employee: updateEmployee });
  }

  handleSelect(e) {
    this.setState({ position: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.employeeId) {
      this.props.updateEmployee(
        this.state.employeeId,
        this.state.employee,
        this.state.position,
        this.state.shop_id,
        this.onUpdateSuccess,
        this.onUpdateError
      );
    }
  }

  onUpdateSuccess() {
    let _this = this;
    _this.props.history.push('/employees');

    // Alert.success('Cập nhật thành công', {
    //   position: 'top-right',
    //   effect: 'jelly',
    //   timeout: 3000,
    //   offset: 100,
    //   onClose: function() {
    //     _this.props.history.push('/employees');
    //   }
    // });
  }

  onUpdateError() {
    Alert.error('Đã có lỗi xảy ra, vui lòng thử lại', {
      position: 'top-right',
      effect: 'jelly',
      timeout: 1000,
      offset: 100
    });
  }

  componentWillMount() {
    if (this.props.match.params.employee_id) {
      if (this.props.employees[this.state.employeeId]) {
        let shop_id = this.props.match.params.shop_id;
        let shop = this.props.shops.find(el => el.shop_id == shop_id);
        if (shop) {
          this.setState({
            employee: this.props.employees[this.state.employeeId],
            position: shop.users[this.props.match.params.employee_id]
          });
        }
      }
    }
  }

  render() {
    var employee = {};
    if (this.state.employee !== undefined) {
      employee = this.state.employee;
    }
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit.bind(this)} noValidate>
          <Card>
            <CardHeader>Thông tin chung:</CardHeader>
            <CardBody>
              <Row>
                <Col xs="6">
                  <div className="form-group">
                    <Label
                      className="label-control"
                      style={{ fontWeight: 'bold' }}
                    >
                      Tên nhân viên:
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      value={this.state.employee.profile.displayName}
                      onChange={this.handleChange.bind(
                        this,
                        'profile',
                        'displayName'
                      )}
                    />

                    <Label
                      className="label-control"
                      style={{ fontWeight: 'bold' }}
                    >
                      Email:
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      value={this.state.employee.profile.email}
                      onChange={this.handleChange.bind(
                        this,
                        'profile',
                        'email'
                      )}
                    />

                    {/* <label className="label-control" style={{fontWeight: "bold"}}>Nhóm quyền:</label>
                  <select>{potitionOption}</select> */}
                  </div>
                </Col>
                <Col xs="6">
                  <div className="form-group">
                    <Label
                      className="label-control"
                      style={{ fontWeight: 'bold' }}
                    >
                      Số điện thoại:
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      value={this.state.employee.profile.phoneNumber}
                      onChange={this.handleChange.bind(
                        this,
                        'profile',
                        'phoneNumber'
                      )}
                    />
                  </div>
                  {this.props.match.params.shop_id ? (
                    <div className="form-group">
                      <Label
                        className="label-control"
                        style={{ fontWeight: 'bold' }}
                      >
                        Chức vụ:
                      </Label>
                      <Input
                        type="select"
                        id="select"
                        defaultValue={this.state.position}
                        bsSize="md"
                        onChange={this.handleSelect.bind(this)}
                      >
                        <option value="saleman">Nhân viên bán hàng</option>
                        <option value="store-manager">Quản lí kho</option>
                        <option value="manager">Cửa hàng trưởng</option>
                        <option value="owner">Chủ sở hữu</option>
                      </Input>
                    </div>
                  ) : null}
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Row>
            <Col sm={{ size: 'auto', offset: 5 }}>
              <button type="submit" className="btn btn-primary">
                {this.state.employeeId ? 'Lưu' : 'Tạo mới'}
              </button>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  employees: state.employees,
  shops: state.shops.shopsList
});

const mapDispatchToProps = {
  updateEmployee
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EmployeeUpdate)
);
