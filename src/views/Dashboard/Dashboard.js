import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Button,
  CardHeader
} from 'reactstrap';
import {
  withRouter,
  Switch,
  Route,
  Redirect,
  NavLink,
  Link
} from 'react-router-dom';
import { connect } from 'react-redux';
import OverlayLoader from 'react-overlay-loading/lib/OverlayLoader';

class Dashboard extends Component {
  renderSuperUser() {
    if (this.props.user.is_superuser) {
      return (
        <Card>
          <CardHeader style={{ background: '#20a8d8', color: '#ffffff' }}>
            SUPERUSER
          </CardHeader>
          <CardBody>
            <Row
              style={{
                background: '#ffffff'
              }}
            >
              <Col xs="12" sm="12" md="3" lg="2">
                <Link to="/su/permission">
                  <Card body className="text-center">
                    <CardBody>
                      <CardText>
                        <i
                          className="fa fa-address-card"
                          style={{ fontSize: '4rem' }}
                        />
                      </CardText>
                      <CardTitle>Phân quyền</CardTitle>
                    </CardBody>
                  </Card>
                </Link>
              </Col>
            </Row>
          </CardBody>
        </Card>
      );
    }
  }

  render() {
    return !this.props.user.profile ? (
      <Container fluid>
        <div className="row justify-content-center">
          <div className="col col-lg-8 text-center">
            <OverlayLoader
              color={'red'} // default is white
              loader="ScaleLoader" // check below for more loaders
              text="Loading... Please wait!"
              active={true}
              backgroundColor={'black'} // default is black
              opacity=".4" // default is .9
            />
          </div>
        </div>
      </Container>
    ) : (
      <Container fluid style={{ marginTop: '20px' }}>
        {this.renderSuperUser()}

        <Card>
          <CardHeader style={{ background: '#4dbd74', color: '#ffffff' }}>
            NGHIỆP VỤ
          </CardHeader>
          <CardBody>
            <Row
              style={{
                background: '#ffffff'
              }}
            >
              <Col xs="12" sm="12" md="3" lg="2">
                <Link to="/shops">
                  <Card body className="text-center">
                    <CardBody>
                      <CardText>
                        <i
                          className="fa fa-home"
                          style={{ fontSize: '4rem' }}
                        />
                      </CardText>
                      <CardTitle>Quản lí cửa hàng</CardTitle>
                    </CardBody>
                  </Card>
                </Link>
              </Col>
              <Col xs="12" sm="12" md="3" lg="2">
                <Link to="/order">
                  <Card body className="text-center">
                    <CardBody>
                      <CardText>
                        <i
                          className="fa fa-laptop"
                          style={{ fontSize: '4rem' }}
                        />
                      </CardText>
                      <CardTitle>Thu ngân</CardTitle>
                    </CardBody>
                  </Card>
                </Link>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Card>
          <CardHeader style={{ background: '#f86c6b', color: '#ffffff' }}>
            CÔNG CỤ
          </CardHeader>
          <CardBody>
            <Row
              style={{
                background: '#ffffff'
              }}
            >
              <Col xs="12" sm="12" md="3" lg="2">
                <Link to="/promotions">
                  <Card body className="text-center">
                    <CardBody>
                      <CardText>
                        <i
                          className="fa fa-tags"
                          style={{ fontSize: '4rem' }}
                        />
                      </CardText>
                      <CardTitle>Quản lí khuyến mãi</CardTitle>
                    </CardBody>
                  </Card>
                </Link>
              </Col>
              <Col xs="12" sm="12" md="3" lg="2">
                <Link to="/reports">
                  <Card body className="text-center">
                    <CardBody>
                      <CardText>
                        <i
                          className="fa fa-bar-chart"
                          style={{ fontSize: '4rem' }}
                        />
                      </CardText>
                      <CardTitle>Báo cáo</CardTitle>
                    </CardBody>
                  </Card>
                </Link>
              </Col>
              <Col xs="12" sm="12" md="3" lg="2">
                <Link to="/dashboard_report">
                  <Card body className="text-center">
                    <CardBody>
                      <CardText>
                        <i
                          className="fa fa-table"
                          style={{ fontSize: '4rem' }}
                        />
                      </CardText>
                      <CardTitle>Dashboard</CardTitle>
                    </CardBody>
                  </Card>
                </Link>
              </Col>
              <Col xs="12" sm="12" md="3" lg="2">
                <Link to="/kpi_report">
                  <Card body className="text-center">
                    <CardBody>
                      <CardText>
                        <i
                          className="fa fa-line-chart"
                          style={{ fontSize: '4rem' }}
                        />
                      </CardText>
                      <CardTitle>KPI</CardTitle>
                    </CardBody>
                  </Card>
                </Link>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default withRouter(connect(mapStateToProps)(Dashboard));
