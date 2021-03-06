import React from 'react';
import {
  Create,
  FormTab,
  LongTextInput,
  TabbedForm,
  TextInput,
  SelectInput,
  Toolbar,
  SelectArrayInput
} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';

import RichTextInput from 'ra-input-rich-text';
import NotificationCreateToolbar from './NotificationCreateToolBar'

export const styles = {
  title: {width: 544 },
  message: { width: 544 },

  sender: {  display: 'inline-block' },
  sender_id: { display: 'inline-block' , marginLeft: 32 },
  link: { width: 544 },
  comment: {
    maxWidth: '20em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
};



const NotificatonCreate = ({ classes, ...props }) => (
  <Create {...props} >
    <TabbedForm toolbar ={<NotificationCreateToolbar />}>
      <FormTab label="Thông báo">
        <TextInput
          autoFocus
          label ="Tiêu đề"
          source="title"
          formClassName={classes.title}
        />
        <RichTextInput
          label ="Nội dung"
          source="message"
          fullWidth={true}
          formClassName={classes.message}
        />
        <SelectArrayInput label="Nhóm người dùng" source="groups" choices={[
            { id: 'GCAFE', name: 'Đại lý Gcafe' },
            { id: 'DAI_LY_NGOAI', name: 'Đại lý ngoài' },
            { id: 'CHU_PHONG_MAY', name: 'Chủ phòng máy' },
            { id: 'VNPOST', name: 'VNPOST' }
         ]} 
        />
      </FormTab>
      <FormTab label="Cấu hình thông báo" >
        <TextInput label ="Sender"  source="sender" formClassName={classes.sender} defaultValue='offline_sales' />
        <TextInput label ="Sender_ID" source="sender_id" formClassName={classes.sender_id} defaultValue='offline_sales'/>
        <LongTextInput source="link" formClassName={classes.link} />
        <SelectInput label="Gửi tới app" source="app_id" choices={[
            { id: 'dailymoi', name: 'App Đại lý mới' },
            { id: 'daily', name: 'App Đại lý' },
            { id: 'nhanvien', name: 'App Nhân viên' },
         ]} 
         defaultValue="dailymoi"
        />
      </FormTab>
    </TabbedForm>
  </Create>
);

export default withStyles(styles)(NotificatonCreate);
