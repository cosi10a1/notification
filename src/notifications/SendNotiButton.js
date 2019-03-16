import { showNotification, SaveButton, withDataProvider } from 'react-admin';
import { push } from 'react-router-redux';
import { Save } from 'material-ui-icons';
import React, { Component } from 'react';
import { CREATE } from 'ra-core';
import dataProvider from '../dataProvider/rest';
import agent from '../helpers/agent';
import { connect } from 'react-redux';

class SenNotiButton extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.sendNotification = this.sendNotification.bind(this);
  }

  sendNotification(
    sender,
    sender_id,
    link,
    received_id,
    message,
    title,
    app_id
  ) {
    agent.notifications
      .create(sender, sender_id, link, received_id, message, title, app_id)
      .then(result => {
        if (result.status == 'error') {
          this.props.dispatch(
            showNotification('Lỗi gửi thông báo: ' + result.message),
            'error'
          );
        } else {
          this.props.dispatch(showNotification('Thông báo được gửi'));
        }
      })
      .catch(e => {
        this.props.dispatch(
          showNotification('Lỗi: không thể gửi thông báo: ' + e, 'error')
        );
      });
  }

  getUserByGroups(groups) {
    let query = '?';
    if (groups.length >= 0) {
      for (let i = 0; i < groups.length; i++) {
        if (i == 0) {
          query += 'group_names=' + groups[i];
        } else {
          query += '&group_names' + groups[i];
        }
      }
    }
    return agent.notifications.get_users_by_groups(query);
  }

  handleClick() {
    let record = this.props.formValue;
    let fieldValues = record.values;
    let sender = fieldValues.sender ? fieldValues.sender : '';
    let sender_id = fieldValues.sender_id ? fieldValues.sender_id : '';
    let link = fieldValues.link ? fieldValues.link : '';
    let additional_user = fieldValues.additional_user
      ? fieldValues.additional_user
      : '';
    // let received_id = fieldValues.received_id
    //   ? fieldValues.received_id
    //   : '50135';
    let groups = fieldValues.groups ? fieldValues.groups : [];
    let message = fieldValues.message ? fieldValues.message : '';
    let title = fieldValues.title ? fieldValues.title : '';
    let app_id = fieldValues.app_id ? fieldValues.app_id : '';
    this.getUserByGroups(groups).then(response => {
      let users = response.users.join();
      this.sendNotification(
        sender,
        sender_id,
        link,
        users + ',' + additional_user,
        message,
        title,
        app_id
      );
    });
  }

  render() {
    return <SaveButton label="Gửi thông báo" onClick={this.handleClick} />;
  }
}

export default connect()(SenNotiButton);
