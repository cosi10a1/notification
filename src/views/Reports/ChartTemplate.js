import React, { Component } from 'react';
import { HorizontalBar, Bar, Line } from 'react-chartjs-2';
import { Card, CardHeader, CardBody, Col } from 'reactstrap';
import moment from 'moment';
import { connect } from 'react-redux';
import { numberWithCommas } from '../../helpers/number_helper';

class ChartTemplate extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getChartHeight();
  }

  getBodyFontSize() {
    return parseInt(
      window
        .getComputedStyle(document.body)
        .getPropertyValue('font-size')
        .split('px')[0]
    );
  }

  getChartHeight() {
    let screen_height = screen.height;
    let fontSize = this.getBodyFontSize();
    return Math.floor(((screen_height - 57) / 2 - 1.25 * fontSize) * 0.77);
  }

  render() {
    return (
      <Col xs="12" sm="12" md="6">
        <Card>
          {' '}
          {/* <CardHeader>
                    <Row>
                      {this.props.large_text_size ? (
                        <Col>
                          <h3>{this.props.title}</h3>
                        </Col>
                      ) : (
                        <Col>{this.props.title}</Col>
                      )}
                    </Row>
                  </CardHeader> */}{' '}
          <CardBody className="card-body">
            <div>
              {' '}
              {this.props.large_text_size ? (
                <h3>
                  {' '}
                  {this.props.text_total}:{' '}
                  {numberWithCommas(this.props.total_data)}{' '}
                </h3>
              ) : this.props.smallChart ? (
                <React.Fragment>
                  {this.props.text_total + ': '}
                  <br />
                  {numberWithCommas(this.props.total_data)}
                </React.Fragment>
              ) : (
                this.props.text_total +
                ': ' +
                numberWithCommas(this.props.total_data)
              )}{' '}
            </div>{' '}
            <div className="chart-wrapper">
              {' '}
              {this.props.chart_type === 'line' ? (
                <Line
                  height={145}
                  ref={this.props.chart_name}
                  data={this.props.chart}
                  options={{
                    tooltips: {
                      mode: 'point',
                      callbacks: {
                        labelColor: (tooltipItem, chart) => {
                          var dataset =
                            chart.config.data.datasets[
                              tooltipItem.datasetIndex
                            ];
                          return {
                            backgroundColor: dataset.backgroundColor
                          };
                        },
                        label: (tooltipItem, data) => {
                          var value = data.datasets[0].data[tooltipItem.index];
                          var label = data.labels[tooltipItem.index];
                          return (
                            data.datasets[tooltipItem.datasetIndex].label +
                            '  ' +
                            numberWithCommas(tooltipItem.yLabel)
                          );
                        }
                      }
                    },
                    scales: {
                      yAxes: [
                        {
                          ticks: {
                            beginAtZero: true,
                            autoSkip: true
                          }
                        }
                      ]
                    },
                    maintainAspectRatio: false
                  }}
                />
              ) : this.props.horizontal_bar ? (
                <HorizontalBar
                  height={145}
                  ref={this.props.chart_name}
                  data={this.props.chart}
                  options={{
                    tooltips: {
                      mode: 'point',
                      callbacks: {
                        labelColor: (tooltipItem, chart) => {
                          var dataset =
                            chart.config.data.datasets[
                              tooltipItem.datasetIndex
                            ];
                          return {
                            backgroundColor: dataset.backgroundColor
                          };
                        },
                        label: (tooltipItem, data) => {
                          var value = data.datasets[0].data[tooltipItem.index];
                          var label = data.labels[tooltipItem.index];
                          return (
                            data.datasets[tooltipItem.datasetIndex].label +
                            '  ' +
                            numberWithCommas(tooltipItem.xLabel)
                          );
                        }
                      }
                    },
                    scales: {
                      yAxes: [
                        {
                          stacked: this.props.stacked,
                          barPercentage: 0.6,
                          ticks: {
                            beginAtZero: true
                          }
                        }
                      ],
                      xAxes: [
                        {
                          stacked: this.props.stacked,
                          ticks: {
                            beginAtZero: true,
                            callback: function(label, index, labels) {
                              if (label > 1000000) {
                                return (label * 1.0 / 1000000).toFixed(0) + 'M';
                              } else {
                                if (label < 1) {
                                  return label.toFixed(1);
                                } else {
                                  return label;
                                }
                              }
                            }
                          }
                        }
                      ]
                    },
                    maintainAspectRatio: false
                  }}
                />
              ) : (
                <Bar
                  ref={this.props.chart_name}
                  data={this.props.chart}
                  options={{
                    legend: {
                      display: this.props.legend
                    },
                    tooltips: {
                      mode: 'x',
                      callbacks: {
                        labelColor: (tooltipItem, chart) => {
                          var dataset =
                            chart.config.data.datasets[
                              tooltipItem.datasetIndex
                            ];
                          return {
                            backgroundColor: dataset.backgroundColor
                          };
                        },
                        label: (tooltipItem, data) => {
                          if (data && data.datasets) {
                            var value =
                              data.datasets[0].data[tooltipItem.index];
                            var label = data.labels[tooltipItem.index];
                            if (
                              this.props.stacked &&
                              data.datasets.length > 1
                            ) {
                              var total_value =
                                data.datasets[0].data[tooltipItem.index] +
                                data.datasets[1].data[tooltipItem.index];
                              if (this.props.smallChart) {
                                return numberWithCommas(tooltipItem.yLabel);
                              } else {
                                return (
                                  data.datasets[tooltipItem.datasetIndex]
                                    .label +
                                  '(' +
                                  (
                                    tooltipItem.yLabel *
                                    100 /
                                    total_value
                                  ).toFixed(2) +
                                  '%)' +
                                  '  ' +
                                  numberWithCommas(tooltipItem.yLabel)
                                );
                              }
                            } else {
                              if (this.props.smallChart) {
                                return numberWithCommas(tooltipItem.yLabel);
                              } else {
                                return (
                                  data.datasets[tooltipItem.datasetIndex]
                                    .label +
                                  ' ' +
                                  numberWithCommas(tooltipItem.yLabel)
                                );
                              }
                            }
                          }
                        },
                        afterBody: (tooltipItem, data) => {
                          if (tooltipItem.length >= 2) {
                            return (
                              'Tổng số: ' +
                              numberWithCommas(
                                tooltipItem[0].yLabel + tooltipItem[1].yLabel
                              )
                            );
                          } else return '';
                        }
                      }
                    },
                    scales: {
                      yAxes: [
                        {
                          display: this.props.legend,
                          stacked: this.props.stacked,
                          ticks: {
                            beginAtZero: true,
                            callback: function(label, index, labels) {
                              if (label > 1000000) {
                                return (label * 1.0 / 1000000).toFixed(0) + 'M';
                              } else {
                                if (label < 1) {
                                  return label.toFixed(1);
                                } else {
                                  return label;
                                }
                              }
                            }
                          }
                        }
                      ],
                      xAxes: [
                        {
                          display: this.props.legend,
                          stacked: this.props.stacked,
                          barPercentage: 0.6,
                          ticks: {
                            beginAtZero: true
                          }
                        }
                      ]
                    },
                    maintainAspectRatio: false
                  }}
                />
              )}{' '}
            </div>{' '}
          </CardBody>{' '}
        </Card>{' '}
      </Col>
    );
  }
}

ChartTemplate.defaultProps = {
  legend: true,
  smallChart: false
};

const mapStateToProps = state => ({
  shops: state.shops.shopsList
});

export default connect(mapStateToProps, null)(ChartTemplate);
