import React from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import theme from './theme';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';

import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear';

const drawerWidth = 320;

const styles = {
    
    appBar: {
        position: 'absolute',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
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
        display: "none",
    }

}


class TopBar extends React.Component {
    
    render() {

        const { classes, editorData, frontTab, open } = this.props;

        return (
            <AppBar className={classNames(classes.appBar, { [classes.appBarShift]: open })} >
                <Toolbar disableGutters >
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={this.props.handleDrawerOpen}
                        className={classNames(classes.menuButton, open && classes.hidden)}
                    >
                        <MenuIcon />
                    </IconButton>
                    { editorData.length>0 ?
                        <React.Fragment>
                            <Tabs className={classes.tabs} value={frontTab} onChange={this.props.handleChange} scrollable scrollButtons="auto" >
                            { editorData.map((editor, index) =>
                                <Tab key={"tab"+index} label={editor.changed ? editor.fileName+" *" : editor.fileName} />
                            )}
                            </Tabs>
                            { editorData[frontTab].fileName.endsWith('.log') ?
                                <Button color="inherit" onClick={ () => this.props.refreshFile() } >Refresh</Button>
                                :
                                <Button color="inherit" onClick={ () => this.props.saveFile() } >Save</Button>
                            }
                            <IconButton color="inherit" aria-label="Open drawer" onClick={this.props.closeTab}>
                                <ClearIcon />
                            </IconButton>
                        </React.Fragment>
                    :null}
                </Toolbar>
            </AppBar>
        );
    }
}

TopBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);
