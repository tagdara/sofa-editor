import React from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';
import { withThemeChange } from './Theme/withThemeChange';

import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import StarIcon from '@material-ui/icons/Star';
import CompareIcon from '@material-ui/icons/Compare';

import FilePicker from './filePicker';

const drawerWidth = 320;

const styles = theme => ({

    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
        border: 0,
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
}); 

class Sidebar extends React.Component {
    
    render() {

        const { open, classes, startdir, favoritesMode, lastdir, frontTab, editorData } = this.props;

        return (
            <Drawer variant="persistent" open={open} classes={{ paper: classes.drawerPaper, }} >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={this.props.handleFavorites}>
                        <StarIcon />
                    </IconButton>
                    <IconButton onClick={() => this.props.setColorScheme(this.props.colorScheme=='dark' ? 'light' : 'dark')}>
                        <CompareIcon />
                    </IconButton>
                    <div className={classes.spacer} />
                    <IconButton onClick={this.props.handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <FilePicker startdir={startdir} openFile={this.props.openFile} favoritesMode={this.props.favoritesMode} endFavoritesMode={this.props.endFavoritesMode} lastdir={this.props.lastdir} />
            </Drawer>
        );
    }
}

Sidebar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withThemeChange(withTheme()(withStyles(styles)(Sidebar)));

