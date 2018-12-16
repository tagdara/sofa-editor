import React from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import DescriptionIcon from '@material-ui/icons/Description';
import FolderIcon from '@material-ui/icons/Folder';
import FolderSpecialIcon from '@material-ui/icons/FolderSpecial';
import BookIcon from '@material-ui/icons/Book';

import Typography from '@material-ui/core/Typography';

const styles  = theme =>  ({

    root: {
        flexGrow: 1,
    },
    dirList: {
        overflowY: "auto",
        overflowX: "hidden",
    },
});

class FilePicker extends React.Component {
    
    state = {
        dirs: [],
        alldirs: [],
        startdir: "/",
        favorites: [],
    };

    setStartDir = (currentdir, newdir) => {
        this.props.endFavoritesMode()
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
        if (!newstartdir) { newstartdir="/" }
        this.setState({startdir:newstartdir},
            () => { this.getDirectory(newstartdir) }
        )
    }
    
    getFavorites = () => {
        fetch('/favorites')
            .then(result=>result.json())
            .then(result=>this.setState({favorites: result})
        )
    }
    
    getDirectory = (dirname) => {

        fetch('/dir', { method: 'post', body: JSON.stringify({ "startdir" : dirname }) })
            .then(result=>result.json())
            .then(data=>this.setState({startdir: dirname, alldirs: data}))
    }
  
    componentDidMount() {
        this.getFavorites()
        this.getDirectory(this.props.startdir)
        
    }

    render() {
        
        const { classes, favoritesMode } = this.props;
        
        return (

            <div className={classes.dirList} >
                { favoritesMode ?
                    <List>
                        { this.state.favorites.map((dir) => 
                            <ListItem button name={ dir.name }  key={ dir.name }
                                onClick={ dir.type == 'folder' ? 
                                    ()=> this.setStartDir(dir.path,dir.name) :
                                    ()=> this.props.openFile(dir.path,dir.name) 
                                }
                            >
                                <ListItemIcon>
                                    { dir.type == 'folder' ? <FolderSpecialIcon /> : <BookIcon /> }
                                </ListItemIcon>
                                <ListItemText primary={dir.name} />
                            </ListItem> 
                        )}
                    </List>
                :
                    <List >
                        { this.state.startdir != '/' ?
                            <ListItem button key={ 'uponedir' } name={ 'uponedir' } onClick={ ()=> this.goUpDir()}>
                                <ListItemIcon>
                                    <FolderIcon />
                                </ListItemIcon>
                                <ListItemText primary='..' />
                            </ListItem>
                        : null }
                        { this.state.alldirs.map((dir) => 
                                <ListItem button name={ dir.name } key={ dir.name }
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
                }
            </div>            
        );
    }
}

FilePicker.propTypes = {
    classes: PropTypes.object.isRequired,
};

//export default withStyles(styles, { withTheme: true })(App);
export default withTheme()(withStyles(styles)(FilePicker));
