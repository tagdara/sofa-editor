import React, { Component, memo } from 'react';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    
    startCard: {
        maxWidth: 480,
        maxHeight: 240,
        margin: 24,
    }
})

export default function NoEditorCard(props) {
    
    const classes = useStyles();
    
    return (
        <Card className={classes.startCard}>
            <CardHeader 
                avatar={<Avatar>S</Avatar>}
                title="Sofa Editor" />
            <CardContent>
                <Typography>Open a file from the left menu to begin.</Typography>
            </CardContent>
        </Card>
    );
}
