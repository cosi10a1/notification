import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import SettingsIcon from '@material-ui/icons/Settings';
import LabelIcon from '@material-ui/icons/Label';
import { withRouter } from 'react-router-dom';
import {
  translate,
  DashboardMenuItem,
  MenuItemLink,
  Responsive
} from 'react-admin';

import notifications from '../notifications';
import SubMenu from './SubMenu';
import categories from '../categories';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleToggle(menu) {
    this.setState(state => ({ [menu]: !state[menu] }));
  }

  render() {
    const { onMenuClick, open, logout, translate } = this.props;
    console.log('Menu props:', { onMenuClick, open, logout, translate });
    return (
      <div>
        {' '}
        <DashboardMenuItem onClick={onMenuClick} />
        <MenuItemLink
          to={`/notifications`}
          sidebarIsOpen={open}
          primaryText="Gửi Thông báo"
          leftIcon={<notifications.icon />}
        />
        <MenuItemLink
          to={`/categories`}
          primaryText="categories"
          leftIcon={<categories.icon />}
          onClick={onMenuClick}
        />
        <Responsive
          xsmall={
            <MenuItemLink
              to="/configuration"
              primaryText="Cài đặt"
              leftIcon={<SettingsIcon />}
              onClick={onMenuClick}
            />
          }
          medium={null}
        />
        <Responsive
          small={logout}
          medium={null} // Pass null to render nothing on larger devices
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  open: state.admin.ui.sidebarOpen,
  theme: state.theme,
  locale: state.i18n.locale
});

const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    {}
  ),
  translate
);

export default enhance(Menu);
