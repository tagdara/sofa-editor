import React, { Component, memo } from 'react';
import { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import DescriptionIcon from '@material-ui/icons/Description';
import FolderIcon from '@material-ui/icons/Folder';
import FolderSpecialIcon from '@material-ui/icons/FolderSpecial';
import BookIcon from '@material-ui/icons/Book';

import Typography from '@material-ui/core/Typography';
import { Scrollbars } from 'react-custom-scrollbars';

const useStyles = makeStyles({

    root: {
        flexGrow: 1,
    },
    dirList: {
        overflowY: "auto",
        overflowX: "hidden",
    },
});

export default function FilePicker(props) {

    const classes = useStyles();
    const [dirs, setDirs] = useState([]);
    const [alldirs, setAllDirs] = useState([]);
    const [startdir, setStartDir] = useState('/');
    const [favorites, setFavorites] = useState([]);
    
    useEffect(() => {
        getFavorites()
        getDirectory(props.startdir)
    }, []);
   
    
    function changeStartDir(currentdir, newdir) {
        props.endFavoritesMode()
        if (!currentdir.endsWith('/')) { currentdir=currentdir+'/' }
        var newstartdir=currentdir+newdir
        setStartDir(newstartdir)
        getDirectory(newstartdir) 

    }
    
    function goUpDir() {
        var dirs = startdir.split('/');
        dirs.pop();
        var newstartdir=dirs.join('/')
        if (!newstartdir) { newstartdir="/" }
        setStartDir(newstartdir)
        getDirectory(newstartdir) 
    }
    
    function getFavorites() {
        fetch('/favorites')
            .then(result=>result.json())
            .then(result=>setFavorites(result))
    }
    
    function getDirectory(dirname) {

        fetch('/dir', { method: 'post', body: JSON.stringify({ "startdir" : dirname }) })
            .then(result=>result.json())
            .then(data=> { setStartDir(dirname); setAllDirs(data); })
    }

    return (
        <Scrollbars>
            <div className={classes.dirList} >
                { props.favoritesMode ?
                    <List>
                        { favorites.map((dir) => 
                            <ListItem button name={ dir.name }  key={ dir.name }
                                onClick={ dir.type == 'folder' ? 
                                    ()=> changeStartDir(dir.path,dir.name) :
                                    ()=> openFile(dir.path,dir.name) 
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
                        { startdir != '/' ?
                            <ListItem button key={ 'uponedir' } name={ 'uponedir' } onClick={ ()=> goUpDir()}>
                                <ListItemIcon>
                                    <FolderIcon />
                                </ListItemIcon>
                                <ListItemText primary='..' />
                            </ListItem>
                        : null }
                        { alldirs.map((dir) => 
                                <ListItem button name={ dir.name } key={ dir.name }
                                            onClick={ dir.type == 'folder' ? 
                                                ()=> changeStartDir(dir.path,dir.name) :
                                                ()=> props.openFile(dir.path,dir.name) 
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
        </Scrollbars>
    );
}