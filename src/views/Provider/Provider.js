import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Progress } from 'reactstrap';
import { fetchUser } from '../../stores/employees/actions';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import overlayFactory from 'react-bootstrap-table2-overlay';

const columns = [
  {
    dataField: 'id',
    text: 'Product ID'
  },
  {
    dataField: 'name',
    text: 'Product Name',
    filter: textFilter()
  },
  {
    dataField: 'price',
    text: 'Product Price',
    filter: textFilter()
  }
];

class Provider extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(fetchUser(this.props.match.params.id));
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <BootstrapTable
              keyField="id"
              loading={true}
              data={[]}
              columns={columns}
              filter={filterFactory()}
              overlay={overlayFactory({
                spinner: true,
                background: 'rgba(192,192,192,0.3)'
              })}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  providers: state.providers,
  shops: state.shops
});

export default connect(mapStateToProps)(Provider);
