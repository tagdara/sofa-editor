import React from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear';

import FilePicker from './filePicker';
import TopBar from './TopBar';
import Sidebar from './Sidebar';

import NoEditorCard from './NoEditorCard';
import Editors from './Editors';

const drawerWidth = 320;

const styles = theme => ({
    
    appFrame: {
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    content: {
        justifyContent: "center",
        flexGrow: 1,
        display: 'flex',
        paddingTop: 64,
        padding: theme.spacing.unit * 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
        height: "100%",
    },
    contentShift: {
        justifyContent: "center",
        flexGrow: 1,
        display: 'flex',
        paddingTop: 64,
        padding: theme.spacing.unit * 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
        height: "100%",
    },
}); 


class App extends React.Component {
    
    state = {
        open: true,
        frontTab: 0,
        editorFilea: "",
        editorContenta: "",
        editorContentb: "",
        dirs: [],
        alldirs: [],
        startdir: "/",
        editorData: [],
        snackbarOpen: false,
        lastDir: "",
        favoritesMode: false,
    };


    setTitle = (tab) => {
        if (this.state.editorData[tab].fileName) {
            document.title = this.state.editorData[tab].fileName
        } else {
            document.title = 'Sofa Editor'
        }
    }

    handleChange = (event, frontTab) => {
        this.setState({ frontTab: frontTab },
            () => {
                this.setTitle(frontTab)
            }
        );
    };

    handleFavorites = () => {
        if (this.state.favorites) {
            this.setState({ favoritesMode: false, startdir: this.state.lastdir })
        } else {
            this.setState({ favoritesMode: true, lastdir: this.state.startdir })
        }
    }
    
    endFavoritesMode = () => {
        this.setState({ favoritesMode: false })
    }

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    handleAceChange = (newValue) => {
        if (newValue) {
            var temped=this.state.editorData;
            temped[this.state.frontTab].content=newValue
            temped[this.state.frontTab].changed=true
            this.setState({ editorData: temped })
        }
    }
  
    saveFile = (editor) => {
        editor=this.state.frontTab
        var filedir=this.state.editorData[editor].dir
        if (!filedir.endsWith('/')) { filedir=filedir+'/' }
        
        fetch('/save'+filedir+this.state.editorData[editor].fileName, {
                method: 'post',
                body: this.state.editorData[editor].content,
                }
        )
        .then(this.setState({ snackbarOpen: true }))
        .then(this.clearChange(editor));
    }

    closeTab = () => {
        var editor=this.state.frontTab
        var newstate=this.state.editorData
        newstate.splice(editor, 1)
        if (editor>newstate.length-1) { editor=editor-1 }
        this.setState({ editorData: newstate, frontTab: editor})
    }
    
    clearChange = (editor) => {
        var temped=this.state.editorData;
        temped[this.state.frontTab].changed=false
        this.setState({ editorData: temped })        
    }

    modeByFilename = (filename) => {
        var knowntypes={'py':'python','js':'jsx','jsx':'jsx','json':'json','html':'html','log':'python'}
        var ext = filename.substr(filename.lastIndexOf('.') + 1);
        if (Object.keys(knowntypes).includes(ext)) {
            return knowntypes[ext]
        } else {
            return 'plain_text'
        }
    }
    
    formatSpecialFiles = (filename, filedata) => {
        var mode=this.modeByFilename(filename)
        if (mode=='json') {
            var o = JSON.parse(filedata) // may throw if json is malformed
            return JSON.stringify(o, null, 4)
        } else {
            return filedata
        }
    }

    openFileTab = (filedir,filename) => {
        if (!filedir.endsWith('/')) { filedir=filedir+'/' }
        var newfile=filedir+filename

        var neweditor={}
        this.getFile(newfile)
            .then(response => this.formatSpecialFiles(filename, response))
            .then(response => neweditor = {'dir':filedir, 'fileName':filename, 'changed':false, 'content':response, 'mode':this.modeByFilename(filename) })
            .then(response => this.setState({ frontTab: [...this.state.editorData, neweditor].length-1, editorData: [...this.state.editorData, neweditor] }))
            .then(document.title = filename)
    }

    refreshFile = () => {
        var editor=this.state.frontTab
        var filedir=this.state.editorData[editor].dir
        if (!filedir.endsWith('/')) { filedir=filedir+'/' }
        var newfile=filedir+this.state.editorData[editor].fileName

        this.getFile(newfile)
            .then(response => this.handleAceChange(response))
    }

    getFile = (filename) => {
        return fetch('/file'+filename)
            .then((result)=>{ return result.text() })
    }

    handleSnackbarClose = () => {
        this.setState({ snackbarOpen: false });
    };

    render() {

        const { classes } = this.props;
        const { open, frontTab, editorData } = this.state;

        return (
            <div className={classes.appFrame}>
                <TopBar open={this.state.open} frontTab={frontTab} editorData={editorData} handleDrawerOpen={this.handleDrawerOpen}
                        refreshFile={this.refreshFile} saveFile={this.saveFile} handleChange={this.handleChange} closeTab={this.closeTab} />
                <Sidebar open={this.state.open} startdir={this.state.startdir} openFile={this.openFileTab} favoritesMode={this.state.favoritesMode} 
                            endFavoritesMode={this.endFavoritesMode} lastdir={this.state.lastdir} handleDrawerClose={this.handleDrawerClose}
                            handleFavorites={this.handleFavorites} />
                <main className={ open ? classes.content : classes.contentShift } >
                    { editorData.length<1 ?
                        <NoEditorCard />
                        : 
                        <Editors frontEditor={frontTab} editorData={editorData} handleAceChange={this.handleAceChange} />
                    }
                    <Snackbar
                        anchorOrigin={{ 'vertical':'bottom', 'horizontal':'right' }}
                        autoHideDuration={1000}
                        open={this.state.snackbarOpen}
                        onClose={this.handleSnackbarClose}
                        ContentProps={{ 'aria-describedby': 'message-id', }}
                        message={<span id="message-id">Saved { this.state.editorData.length < 1 ? null : this.state.editorData[this.state.frontTab].fileName }</span>}
                    />
                </main>
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withTheme()(withStyles(styles)(App));
