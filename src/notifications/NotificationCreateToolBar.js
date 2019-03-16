import SendNotiButton from './SendNotiButton';
import { Toolbar } from 'react-admin';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class NotificationCreateToolbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Toolbar {...this.props}>
        <SendNotiButton
          label="Gửi thông báo"
          redirect="notifications"
          submitOnEnter={false}
          formValue={this.props.recordForm}
        />
      </Toolbar>
    );
  }
}
const mapStateToProps = state => ({
  recordForm: state.form['record-form']
});

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(NotificationCreateToolbar)
);
