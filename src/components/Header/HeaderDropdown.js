import React, { Component } from 'react';
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown
} from 'reactstrap';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
// import { signOut } from '../../stores/user/actions';

class HeaderDropdown extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  dropAccnt() {
    return (
      <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav>
          <img
            src={'img/avatars/6.jpg'}
            className="img-avatar"
            alt="admin@bootstrapmaster.com"
          />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem>
            <i className="fa fa-user" /> Thông tin cá nhân
          </DropdownItem>
          <DropdownItem>
            <i className="fa fa-envelope-o" /> Tin nhắn<Badge color="success">
              0
            </Badge>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={this.props.signOut}>
            <i className="fa fa-lock" /> Đăng xuất
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  render() {
    const { ...attributes } = this.props;
    return this.dropAccnt();
  }
}

export default withRouter(HeaderDropdown);
