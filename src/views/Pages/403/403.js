import React, { Component } from 'react';
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
  Button,
  Jumbotron
} from 'reactstrap';
export default class Page403 extends Component {
  render() {
    return (
      <div
        className="animated fadeIn container-fluid"
        style={{ paddingTop: '20px' }}
      >
        <div className="row justify-content-center">
          <div className="col col-lg-8 text-center">
            <Jumbotron style={{ background: '#ffffff' }}>
              <div className="logo">
                <h1>403 Forbiden</h1>
              </div>
              <p className="lead text-muted">
                Bạn không có quyền truy cập vào trang này.
              </p>
              <img
                src={'img/forbiden.svg'}
                className="img-fluid mx-auto d-block"
                alt="Responsive image"
                width={'50%'}
              />
            </Jumbotron>
          </div>
        </div>
      </div>
    );
  }
}
