import React, { Component, memo } from 'react';
import { useState, useEffect} from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
import CssBaseline from "@material-ui/core/CssBaseline";

import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Paper from '@material-ui/core/Paper';

import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear';

import FilePicker from './filePicker';
import TopBar from './TopBar';
import Sidebar from './Sidebar';

import NoEditorCard from './NoEditorCard';
import Editors from './Editors';

const drawerWidth = 320;

const useStyles = makeStyles( theme => ({
    
    content: {
        boxSizing: "border-box",
        justifyContent: "center",
        flexGrow: 1,
        display: 'flex',
        paddingTop: 64,
        padding: 0,
        marginLeft: 0,
        height: "100%",
    },
    contentShift: {
        boxSizing: "border-box",
        justifyContent: "center",
        flexGrow: 1,
        display: 'flex',
        paddingTop: 64,
        padding: 0,
        marginLeft: -drawerWidth,
        height: "100%",
    },
})); 

export default function App(props) {
    
    const classes = useStyles();
    const [open, setOpen] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [favoritesMode, setFavoritesMode] = useState(false);
    const [frontTab, setFrontTab] = useState(-1);
    const [startDir, setStartDir] = useState("/");
    const [lastDir, setLastDir] = useState("/");
    const [editorData, setEditorData] = useState([]);    


    function setTitle(tab) {
        if (tab>-1 && editorData[tab].fileName) {
            document.title = editorData[tab].fileName
        } else {
            document.title = 'Sofa Editor'
        }
    }

    function handleChange(event, newFrontTab) {
        setFrontTab(newFrontTab)
        setTitle(newFrontTab)
    };

    function handleFavorites() {
        if (favoritesMode) {
            setFavoritesMode(false)
            setStartDir(lastDir)
        } else {
            setFavoritesMode(true)
            setLastDir(startDir)
        }
    }
    
    function endFavoritesMode() {
        setFavoritesMode(false)
    }

    function handleDrawerOpen() {
        setOpen(true);
    };

    function handleDrawerClose() {
        setOpen(false);
    };

    function handleAceChange(newValue) {
        if (newValue) {
            var temped=[...editorData];
            temped[frontTab].content=newValue
            temped[frontTab].changed=true
            setEditorData(temped)
        }
    }
  
    function saveFile(editor) {
        editor=frontTab
        if (editor>-1) {
            var filedir=editorData[editor].dir
            if (!filedir.endsWith('/')) { filedir=filedir+'/' }
            
            fetch('/save'+filedir+editorData[editor].fileName, {
                    method: 'post',
                    body: editorData[editor].content,
                    }
            )
            .then(setSnackbarOpen(true))
            .then(clearChange(editor));
        }
    }

    function closeTab() {
        var editor=frontTab
        var newstate=[...editorData]
        newstate.splice(editor, 1)
        setEditorData(newstate)
        if (editor>newstate.length-1) { editor=newstate.length-1 }
        setFrontTab(editor)
        if (newstate.length>0) {
            document.title = newstate[editor].fileName
        } else {
            document.title = 'Sofa Editor'
        }
    }
    
    function clearChange(editor) {
        var temped=editorData;
        temped[frontTab].changed=false
        setEditorData(temped)        
    }

    function modeByFilename(filename) {
        var knowntypes={'py':'python','js':'jsx','jsx':'jsx','json':'json','html':'html','log':'python'}
        var ext = filename.substr(filename.lastIndexOf('.') + 1);
        if (Object.keys(knowntypes).includes(ext)) {
            return knowntypes[ext]
        } else {
            return 'plain_text'
        }
    }
    
    function formatSpecialFiles (filename, filedata) {
        var mode=modeByFilename(filename)
        if (mode=='json') {
            try {
                var o = JSON.parse(filedata) // may throw if json is malformed
                return JSON.stringify(o, null, 4)
            } catch (e) {
                console.log('Improper JSON')
            }
        } 
        return filedata

    }

    function handleOpenFile(neweditor) {
        var newdata=[...editorData, neweditor]
        setEditorData(newdata)
        setFrontTab(newdata.length-1)
        document.title=neweditor['fileName']
        
    }

    function openFileTab(filedir,filename) {
        if (!filedir.endsWith('/')) { filedir=filedir+'/' }
        var newfile=filedir+filename

        var neweditor={}
        getFile(newfile)
            .then(response => formatSpecialFiles(filename, response))
            .then(response => handleOpenFile({'dir':filedir, 'fileName':filename, 'changed':false, 'content':response, 'mode':modeByFilename(filename) }))
    }

    function refreshFile() {
        var editor=frontTab
        var filedir=editorData[editor].dir
        if (!filedir.endsWith('/')) { filedir=filedir+'/' }
        var newfile=filedir+editorData[editor].fileName

        getFile(newfile)
            .then(response => handleAceChange(response))
    }

    function getFile(filename) {
        return fetch('/file'+filename)
            .then(result=>{ return result.text() })
    }

    function handleSnackbarClose() {
        setSnackbarOpen(false);
    };

    return (
        <React.Fragment>
            <TopBar open={open} frontTab={frontTab} editorData={editorData} handleDrawerOpen={handleDrawerOpen}
                    refreshFile={refreshFile} saveFile={saveFile} handleChange={handleChange} closeTab={closeTab} />
            <Sidebar open={open} startdir={startDir} openFile={openFileTab} favoritesMode={favoritesMode} 
                        endFavoritesMode={endFavoritesMode} lastdir={lastDir} handleDrawerClose={handleDrawerClose}
                        handleFavorites={handleFavorites} />
            <Paper className={ open ? classes.content : classes.contentShift } >
                { editorData.length<1 || frontTab<0 ?
                    <NoEditorCard />
                    :
                    <React.Fragment>
                        <Editors frontEditor={frontTab} editorData={editorData} handleAceChange={handleAceChange} />
                        <Snackbar
                            anchorOrigin={{ 'vertical':'bottom', 'horizontal':'right' }}
                            autoHideDuration={1000}
                            open={snackbarOpen}
                            onClose={handleSnackbarClose}
                            ContentProps={{ 'aria-describedby': 'message-id', }}
                            message={<span id="message-id">{ frontTab < 0 ? null : "Saved "+editorData[frontTab].fileName }</span>}
                        />
                    </React.Fragment>
                }
            </Paper>
        </React.Fragment>
    );
}

