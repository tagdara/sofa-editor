import React, { Component, memo } from 'react';
import { useState, useEffect } from 'react';
import { makeStyles} from '@material-ui/styles';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';

import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear';

const drawerWidth = 320;

const useStyles = makeStyles( theme => ({    
    
    appBar: {
        position: 'absolute',
        width: "100%",
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        position: 'absolute',
        width: `calc(100% - ${drawerWidth}px) !important`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    tabs: {
        alignSelf: "flex-end",
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hidden: {
        display: "none !important",
    }

}))


export default function TopBar(props) {
    
    const classes = useStyles();
    
    return (
        <AppBar className={ props.open ? classes.appBarShift : classes.appBar } >
            <Toolbar disableGutters >
                <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={props.handleDrawerOpen}
                    className={props.open ? classes.hidden : classes.menuButton }
                >
                    <MenuIcon />
                </IconButton>
                { props.editorData && props.frontTab>-1 ?
                    <React.Fragment>
                        <Tabs className={classes.tabs} value={props.frontTab} onChange={props.handleChange} variant="scrollable" scrollButtons="auto" >
                        { props.editorData.map((editor, index) =>
                            <Tab key={"tab"+index} label={editor.changed ? editor.fileName+" *" : editor.fileName} />
                        )}
                        </Tabs>
                        { (props.editorData[props.frontTab] && props.editorData[props.frontTab].fileName.endsWith('.log')) ?
                            <Button color="inherit" onClick={ () => props.refreshFile() } >Refresh</Button>
                            :
                            <Button color="inherit" onClick={ () => props.saveFile() } >Save</Button>
                        }
                        <IconButton color="inherit" aria-label="Open drawer" onClick={props.closeTab}>
                            <ClearIcon />
                        </IconButton>
                    </React.Fragment>
                :null}
            </Toolbar>
        </AppBar>
    );
}

