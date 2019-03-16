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
  NullableBooleanInput,
  NumberField,
  Responsive,
  SearchInput
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
      notifications: genNotifications()
    };
    console.log('notificatios:', genNotifications());
  }

  componentDidMount() {
    // this.not
  }

  render() {
    return (
      <List
        {...this.props}
        filters={<NotificationFilter />}
        sort={{ field: 'last_seen', order: 'DESC' }}
        perPage={25}
      >
        <Responsive
          medium={
            <Paper className={this.props.classes.root}>
              <Table className={this.props.classes.table}>
                <TableHead>
                  <TableRow>
                    <CustomTableCell>ID</CustomTableCell>
                    {/* <CustomTableCell align="right">Ngày tạo</CustomTableCell> */}
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
                  {this.state.notifications.map(row => (
                    <TableRow className={this.props.classes.row} key={row.id}>
                      <CustomTableCell component="th" scope="row">
                        {row.name}
                      </CustomTableCell>
                      {/* <CustomTableCell align="right">
                        {row.created_at}
                      </CustomTableCell> */}
                      <CustomTableCell align="right">
                        {row.is_read}
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
            </Paper>
          }
        />
      </List>
    );
  }
}

export default withStyles(styles)(NotificationList);
