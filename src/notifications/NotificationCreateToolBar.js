import SendNotiButton from './SendNotiButton';
import {
  Toolbar
} from 'react-admin';
import React, { Component } from 'react';



class NotificationCreateToolbar extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return ( 
            <Toolbar {...this.props} >
                <SendNotiButton
                    label="Gửi thông báo"
                    redirect="notifications"
                    submitOnEnter={false}
                />
            </Toolbar>
        )
    }
}

export default NotificationCreateToolbar;