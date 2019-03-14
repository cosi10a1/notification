import React from 'react';
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

const NotificationFilter = props => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <DateInput source="last_seen_gte" />
    <NullableBooleanInput source="has_ordered" />
    <NullableBooleanInput source="has_newsletter" defaultValue />
  </Filter>
);

const styles = {
  nb_commands: { color: 'purple' }
};

const NotificationList = ({ classes, ...props }) => (
  <List
    {...props}
    filters={<NotificationFilter />}
    sort={{ field: 'last_seen', order: 'DESC' }}
    perPage={25}
  >
    <Responsive
      medium={
        <Datagrid>
          <StringField source="app_id" label="notification.app_id" />
          <DateField source="created_at" label="notification.created_at" />
          <StringField source="message" label="notification.message" />
          <NumberField source="received_id" label="notification.received_id" />
          <StringField source="title" label="notification.title" />
          <BooleanField source="is_read" label="notification.is_read" />
          <DateField source="updated_at" label="notification.updated_at" />
          <EditButton />
        </Datagrid>
      }
    />
  </List>
);

export default withStyles(styles)(NotificationList);
