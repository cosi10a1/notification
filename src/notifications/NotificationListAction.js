import Button from '@material-ui/core/Button';
import { CardActions } from 'react-admin';
import React from "react"
import { CreateButton } from 'ra-ui-materialui/lib/button';

export const NotificationListActions = ({ basePath, data, resource }) => (
    <CardActions>
        <CreateButton basePath="notifications"/>
    </CardActions>
);
