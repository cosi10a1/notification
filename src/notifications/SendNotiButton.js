import { showNotification,  SaveButton, withDataProvider} from 'react-admin';
import { push } from 'react-router-redux';
import { Save } from 'material-ui-icons';
import React, { Component } from 'react';
import {CREATE} from 'ra-core'
import dataProvider from '../dataProvider/rest'

class SenNotiButton extends Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick () {
        const {  dispatch, record } = this.props;
        console.log("record:", dataProvider)
        dataProvider(CREATE, 'notifications', record)
            .then((result) => {
                console.log("result:",result)
                showNotification('notifications sended');
                // push('/comments');
            })
            .catch((e) => {
                showNotification('Error: comment not approved', 'warning')
            });
    }

    render() {
        console.log("render senotification button")
        return <SaveButton  label="Gửi thông báo" onClick={this.handleClick} />;
    }
}

export default withDataProvider(SenNotiButton);
