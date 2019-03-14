import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import {
  Container,
  Row,
  Col,
  CardGroup,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  InputGroupAddon
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { googleProvider } from '../../../helpers/firebase_helper';
import { setAuthenticatedUser } from '../../../stores/user/actions';
import OverlayLoader from 'react-overlay-loading/lib/OverlayLoader';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isValidUser: false,
      check: false,
      loadingbackendToken: true
    };
  }

  onGoogleSignIn() {
    googleProvider.addScope('profile');

    return firebase
      .auth()
      .signInWithPopup(googleProvider)
      .then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        let token = result.credential.accessToken;

        window.localStorage.setItem('jwt', token);
        window.localStorage.setItem('idToken', result.credential.idToken);
        // The signed-in user info.
        let user = result.user;
      })
      .catch(function(error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        // The email of the user's account used.
        let email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        let credential = error.credential;
      });
  }

  componentWillMount() {}

  render() {
    if (!this.props.user.check) {
      return (
        <OverlayLoader
          color={'red'} // default is white
          loader="ScaleLoader" // check below for more loaders
          text="Loading... Please wait!"
          active={true}
          backgroundColor={'black'} // default is black
          opacity=".4" // default is .9
        />
      );
    } else if (this.props.user.check && this.props.user.uid) {
      return <Redirect from="/login" to="/" />;
    } else if (this.props.user.check && !this.props.user.uid) {
      return (
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="4">
                <CardGroup>
                  <Card
                    className="text-white bg-primary py-5 d-md-down-none"
                    style={{ width: 44 + '%' }}
                  >
                    <CardBody className="text-center">
                      <div>
                        <h1>Đăng nhập</h1>
                        <p>Sử dụng Tài khoản Teko/Phong Vũ của bạn</p>
                        <br />
                        {/* <Button color="primary" className="mt-3" active>
                          Register Now!
                        </Button> */}
                        <Button
                          onClick={this.onGoogleSignIn.bind(this)}
                          className="mt-3 btn-google-plus"
                          block
                        >
                          <span style={{ textAlign: 'center', marginLeft: 0 }}>
                            Google
                          </span>
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Login);
