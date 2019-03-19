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
import { throttle } from 'redux-saga/effects';
export default class Page403 extends Component {
  constructor(props){
    super(props)
  }

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
                <h1>{this.props.pageTitle}</h1>
              </div>
              <p className="lead text-muted">
                {this.props.pageContent}
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
