import React, { Component, memo } from 'react';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { withThemeChange } from './theme/SofaTheme';

import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import StarIcon from '@material-ui/icons/Star';
import CompareIcon from '@material-ui/icons/Compare';

import FilePicker from './filePicker';

const drawerWidth = 320;

const useStyles = makeStyles( theme => ({

    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
        border: 0,
        height: "100%"
    },
    drawerHeader: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px 0 12px',
        ...theme.mixins.toolbar,
    },
    spacer: {
        flexGrow: 1,
    },
})); 


function Sidebar(props) {
    
    const classes = useStyles();
    
    return (
        <Drawer variant="persistent" open={props.open} classes={{ paper: classes.drawerPaper, }} >
            <div className={classes.drawerHeader}>
                <IconButton onClick={props.handleFavorites}>
                    <StarIcon />
                </IconButton>
                <IconButton onClick={() => props.applyTheme(props.colorScheme=='dark' ? 'light' : 'dark')}>
                    <CompareIcon />
                </IconButton>
                <div className={classes.spacer} />
                <IconButton onClick={props.handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <FilePicker startdir={props.startdir} openFile={props.openFile} favoritesMode={props.favoritesMode} endFavoritesMode={props.endFavoritesMode} lastdir={props.lastdir} />
        </Drawer>
    );
}


export default withThemeChange(Sidebar);

