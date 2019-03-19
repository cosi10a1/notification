import React, { Component } from 'react';
import {
  BooleanField,
  Datagrid,
  DateField,
  StringField,
  DateInput,
  EditButton,
  Filter,
  List,
  Create,
  NullableBooleanInput,
  NumberField,
  Responsive,
  SearchInput,
  showNotification
} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import genNotifications from '../data-generator/src/notifications';
import RawList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import {connect} from "react-redux"
import {NotificationListActions} from './NotificationListAction'
import agent from '../helpers/agent';

const NotificationFilter = props => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <DateInput source="last_seen_gte" />
    <NullableBooleanInput source="has_ordered" />
    <NullableBooleanInput source="has_newsletter" defaultValue />
  </Filter>
);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default
    }
  }
});

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

class NotificationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      page:0,
      rowsPerPage:10,
      check_points:[]
    };
    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
    this.fetchNotification = this.fetchNotification.bind(this)
  }

  fetchNotification(first){
    agent.notifications.get_user_notifications("nhanvien",first?null:this.state.check_points[this.state.page-1])
    .then(result=>{
      if (result.status == 'error') {
        console.log("result 1:",result)
        this.props.dispatch(
          showNotification('Lỗi lấy danh sách thông báo: ' + result.message),
          'error'
        );
      }else{
        console.log("result x:",result.data)
        this.setState({
          notifications:result.data.notifications,
          check_points:[...this.state.check_points,result.data.check_point]
        })
      }
    }).catch(e=>{
      this.props.dispatch(
        showNotification('Lỗi: không thể lấy danh sách thông báo: ' + e, 'error')
      );
      }
    )
  }

  componentDidMount() {
    this.fetchNotification(true)
  }
  componentDidUpdate(prevProps, prevState, snapshot){
    if (prevState.page!= this.state.page){
      console.log("componentDidUpdate:",this.state.page, prevState.page)
      this.fetchNotification(false)
    }
  }

  handleChangePage(event, page) {
    this.setState({ page },()=>{
    });
  };

  handleChangeRowsPerPage(event){
    this.setState({ rowsPerPage: event.target.value },()=>{
    });
  };

  render() {
    return (
      <Create
        {...this.props}
        title="Danh sách thông báo"
        actions = {<NotificationListActions />}
        // filters={<NotificationFilter />}
      >
        {/* <Responsive
          medium={ */}
            <Paper className={this.props.classes.root}>
              <Table className={this.props.classes.table}>
                <TableHead>
                  <TableRow>
                    <CustomTableCell>ID</CustomTableCell>
                    <CustomTableCell align="right">Ngày tạo</CustomTableCell>
                    <CustomTableCell align="right">Đã đọc</CustomTableCell>
                    <CustomTableCell align="right">Link</CustomTableCell>
                    <CustomTableCell align="right">Tiêu đề</CustomTableCell>
                    <CustomTableCell align="right">Thông báo</CustomTableCell>
                    <CustomTableCell align="right">Người gửi</CustomTableCell>
                    <CustomTableCell align="right">
                      Mã người gửi
                    </CustomTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.notifications
                  .map(row => (
                    <TableRow className={this.props.classes.row} key={row.id}>
                    <CustomTableCell component="th" scope="row">
                        {row.id}
                      </CustomTableCell>
                      <CustomTableCell align="right">
                        {row.created_at.toString()}
                      </CustomTableCell>
                      <CustomTableCell align="right">
                        {row.is_read?'True':'False'}
                      </CustomTableCell>
                      <CustomTableCell align="right">
                        {row.link}
                      </CustomTableCell>
                      <CustomTableCell align="right">
                        {row.title}
                      </CustomTableCell>
                      <CustomTableCell align="right">
                        {row.message}
                      </CustomTableCell>
                      <CustomTableCell align="right">
                        {row.sender}
                      </CustomTableCell>
                      <CustomTableCell align="right">
                        {row.sender}
                      </CustomTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
              nextIconButtonProps={{disabled:false}}
                rowsPerPageOptions={[]}
                component="div"
                count={100}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                labelDisplayedRows={({ from, to, count }) => ""}
                backIconButtonProps={{
                  'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page',
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Paper>
          {/* }
        /> */}
      </Create>
    );
  }
}

export default connect()(withStyles(styles)(NotificationList));
