import React from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import theme from './theme';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NoteIcon from '@material-ui/icons/Note';
import DescriptionIcon from '@material-ui/icons/Description';
import FolderIcon from '@material-ui/icons/Folder';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';


const styles = {

    root: {
        flexGrow: 1,
    },
}


class FilePicker extends React.Component {
    
    state = {
        dirs: [],
        alldirs: [],
        startdir: "/",
    };
    
    setStartDir = (currentdir, newdir) => {
        if (!currentdir.endsWith('/')) { currentdir=currentdir+'/' }
        var newstartdir=currentdir+newdir
        this.setState({startdir:newstartdir}, () => {
            this.getDirectory(newstartdir) }
        )
    }
    
    goUpDir = () => {
        var dirs = this.state.startdir.split('/');
        dirs.pop();
        var newstartdir=dirs.join('/')
        this.setState({startdir:newstartdir},
            () => { this.getDirectory(newstartdir) }
        )
    }
    
    
    getDirectory = (dirname) => {

        fetch('/dir', {
            method: 'post',
            body: JSON.stringify({"startdir":dirname})
        })
            .then(result=>result.json())
            .then(data=>this.setState({startdir: dirname, alldirs: data})
        )
    }
    
    componentDidMount() {
        console.log('xxxx',this.props.startdir)
        this.getDirectory(this.props.startdir)
    }

    render() {
        
        const { classes } = this.props;
        
        return (
            <List>
                <ListItem key={ 'uponedir' } name={ 'uponedir' } onClick={ ()=> this.goUpDir()}>
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary='..' />
                </ListItem>
                { this.state.alldirs.map((dir) => 
                    <ListItem   key={ dir.path+dir.name } 
                                name={ dir.name } 
                                onClick={ dir.type == 'folder' ? 
                                    ()=> this.setStartDir(dir.path,dir.name) :
                                    ()=> this.props.openFile(dir.path,dir.name) 
                                }
                    >
                        <ListItemIcon>
                            { dir.type == 'folder' ? <FolderIcon /> : <DescriptionIcon /> }
                        </ListItemIcon>
                        <ListItemText primary={dir.name} />
                    </ListItem> 
                )}
            </List>
            
        );
    }
}

FilePicker.propTypes = {
    classes: PropTypes.object.isRequired,
};

//export default withStyles(styles, { withTheme: true })(App);
export default withStyles(styles)(FilePicker);
