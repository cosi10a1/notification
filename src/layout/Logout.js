import { connect } from 'react-redux';
import { Responsive, userLogout } from 'react-admin';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import ExitIcon from '@material-ui/icons/PowerSettingsNew';
import { withRouter } from 'react-router-dom';
import { signOut } from '../stores/user/actions';
import firebase from 'firebase';
import React, { Component } from 'react';


class MyLogoutButton extends Component {
    render(){
    return (<Responsive
        xsmall={
            <MenuItem
                onClick={() =>
                    this.props.signOut().then(() => {
                      return firebase.auth().signOut();
                    })}
            >
                <ExitIcon />{'Đăng xuất'}
            </MenuItem>
        }
        medium={
            <Button
                onClick={() =>
                    this.props.signOut().then(() => {
                      return firebase.auth().signOut();
                    })}
                size="small"
            >
                <ExitIcon /> Đăng xuất
            </Button>
        }
    />)
    }
}

const mapDispatchToProps = dispatch => {
    return {
      signOut: () => dispatch(signOut())
    };
  };
  
export default withRouter(connect(null, mapDispatchToProps)(MyLogoutButton));
