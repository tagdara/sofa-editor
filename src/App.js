import React from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import theme from './theme';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NoteIcon from '@material-ui/icons/Note';
import DescriptionIcon from '@material-ui/icons/Description';
import FolderIcon from '@material-ui/icons/Folder';
import Snackbar from '@material-ui/core/Snackbar';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import AceEditor from 'react-ace';
import brace from 'brace';
import 'brace/ext/searchbox';
import 'brace/mode/python';
import 'brace/mode/jsx';
import 'brace/theme/twilight';


const drawerWidth = 320;

const styles = {
    
    appBar: {
        height: 55,
    }, 
    root: {
        flexGrow: 1,
    },
    appFrame: {
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
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
    },
    'appBarShift-left': {
        marginLeft: drawerWidth,
    },
    'appBarShift-right': {
        marginRight: drawerWidth,
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        display: 'flex',
        paddingTop: 64,
        backgroundColor: "#222",
        padding: theme.spacing.unit * 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    'content-left': {
        marginLeft: -drawerWidth-1,
    },
    'content-right': {
        marginRight: -drawerWidth-1,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    'contentShift-left': {
        marginLeft: 0,
    },
    'contentShift-right': {
        marginRight: 0,
    },
    tabs: {
        alignSelf: "flex-end",
        flexGrow: 1,
    },
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    hidden: {
        display: "none",
    },
    active: {
        display: "block",
    },
    editorHolder: {
        backgroundColor: "#222",
        display: "block",
        height: "100%",
        width: "100%",
    },
}


class App extends React.Component {
    
    state = {
        open: false,
        anchor: 'left',
        frontTab: 0,
        editorFilea: "",
        editorContenta: "",
        editorContentb: "",
        editorCursor: 0,
        dirs: [],
        alldirs: [],
        startdir: "/",
        editorData: [],
        snackbarOpen: false,
    };


    focusAndSize = (frontTab) => {
        this.refs['ed'+frontTab].editor.focus()
        this.refs['ed'+frontTab].editor.resize()
    }

    handleChange = (event, frontTab) => {
        this.setState({ frontTab: frontTab },
            () => {
                this.focusAndSize(frontTab)
            }
        );
    };

    handleDrawerOpen = () => {
        this.getDirectory(this.state.startdir);
        this.setState({ open: true });
        console.log(this.props)
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    handleCursorChange = (pos, event) => {
        this.setState({ editorCursor: pos.getCursor() })
    }

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

    newTab = (filename) => {
        var neweditor={}
        this.oldGetFile(filename)
            .then(response => neweditor = {'fileName':filename, 'changed':false, 'content':response })
            .then(response => this.setState({ frontTab: [...this.state.editorData, neweditor].length-1, editorData: [...this.state.editorData, neweditor] }))
    }

    oldGetFile = (filename) => {
        return fetch('/file/opt/se/src/'+filename)
            .then((result)=>{ return result.text() })
    }

    openFileTab = (filedir,filename) => {
        if (!filedir.endsWith('/')) { filedir=filedir+'/' }
        var newfile=filedir+filename

        var neweditor={}
        this.getFile(newfile)
            .then(response => neweditor = {'dir':filedir, 'fileName':filename, 'changed':false, 'content':response })
            .then(response => this.setState({ frontTab: [...this.state.editorData, neweditor].length-1, editorData: [...this.state.editorData, neweditor] }))
    }

    getFile = (filename) => {
        return fetch('/file'+filename)
            .then((result)=>{ return result.text() })
    }

    getDirectory = (dirname) => {
        var gd={"startdir":dirname}
        fetch('/dir', {
            method: 'post',
            body: JSON.stringify(gd)
            })
            .then(result=>result.json())
            .then(data=>this.setState({alldirs: data})
        )
    }
    
    setStartDir = (currentdir, newdir) => {
        if (!currentdir.endsWith('/')) { currentdir=currentdir+'/' }
        var newstartdir=currentdir+newdir
        this.setState({startdir:newstartdir},
            () => {
                this.getDirectory(newstartdir)
            }
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


    handleSnackbarClose = () => {
        this.setState({ snackbarOpen: false });
    };

    render() {

        const { classes } = this.props;
        const { anchor, open, frontTab } = this.state;

        const drawer = (
            <Drawer variant="persistent" open={open} classes={{ paper: classes.drawerPaper, }} >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={this.handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem key={ 'uponedir' } name={ 'uponedir' } onClick={ ()=> this.goUpDir()}>
                        <ListItemIcon>
                            <FolderIcon />
                        </ListItemIcon>
                        <ListItemText primary='..' />
                    </ListItem> 
                    {
		            this.state.alldirs.map((dir) => {
		                return dir.type == 'folder' ?
                            <ListItem key={ dir.path+dir.name } name={ dir.name } onClick={ ()=> this.setStartDir(dir.path,dir.name)}>
                                <ListItemIcon>
                                    <FolderIcon />
                                </ListItemIcon>
                                <ListItemText primary={dir.name} />
                            </ListItem> 
		                    :
                            <ListItem key={ dir.path+dir.name } name={ dir.name } onClick={ ()=> this.openFileTab(dir.path,dir.name)}>
                                <ListItemIcon>
                                    <DescriptionIcon />
                                </ListItemIcon>
                                <ListItemText primary={dir.name} />
                            </ListItem> 
		                }
                    )}
	            </List>
	           <Divider />
            </Drawer>
        );

        return (
                <div className={classes.appFrame}>
                    <AppBar className={classNames(classes.appBar, { [classes.appBarShift]: open, [classes[`appBarShift-${anchor}`]]: open, })} >
                        <Toolbar disableGutters={!open} >
                            <IconButton
                                color="inherit"
                                aria-label="Open drawer"
                                onClick={this.handleDrawerOpen}
                                className={classNames(classes.menuButton, open && classes.hide)}
                            >
                                <MenuIcon />
                            </IconButton>
                            { this.state.editorData.length>0 ?
                            <Tabs
                                className={classes.tabs}
                                value={this.state.frontTab}
                                onChange={this.handleChange}
                                scrollable
                                scrollButtons="auto"
                            >
                                {
                                    this.state.editorData.map((editor, index) =>
                                        <Tab key={"tab"+index} label={editor.changed ? editor.fileName+" *" : editor.fileName} />
                                        
                                )}
                            </Tabs>
                            :null }
                            { this.state.editorData.length>0 ? 
                            <Button color="inherit" onClick={ () => this.saveFile() } >Save</Button>
                            :null }
                            { this.state.editorData.length>0 ? 
                            <IconButton
                                color="inherit"
                                aria-label="Open drawer"
                                onClick={this.closeTab}
                            >
                                <ClearIcon />
                            </IconButton>

                            :null}
                        </Toolbar>
                    </AppBar>
                    {drawer}
                    <main
                        className={classNames(classes.content, classes[`content-${anchor}`], {
                            [classes.contentShift]: open,
                            [classes[`contentShift-${anchor}`]]: open,
                        })}
                    >
                        <div className={classes.editorHolder}>
                        { this.state.editorData.length<1 ?
                            <Typography>Open a file from the left menu to begin.</Typography>
                            : null }
                        
                            {
                                this.state.editorData.map((editor, index) =>
                                    <AceEditor
                                        key={"editor"+index}
                                        className={this.state.frontTab === index ? classes.active : classes.hidden}
                                        mode="jsx"
                                        theme="twilight"
                                        fontSize={16}
                                        name={"editor"+index}
                                        onChange={this.handleAceChange}
                                        value={editor.content}
                                        editorProps={{ $blockScrolling: true }}
                                        width="100%"
                                        height="100%"
                                        focus={true}
                                        ref={"ed"+index}
                                        showPrintMargin={false}
                                    />
                            )}
                        </div>
                        <Snackbar
                            anchorOrigin={{ 'vertical':'bottom', 'horizontal':'right' }}
                            autoHideDuration={1000}
                            open={this.state.snackbarOpen}
                            onClose={this.handleSnackbarClose}
                            ContentProps={{
                                'aria-describedby': 'message-id',
                            }}
                            message={<span id="message-id">Saved { this.state.editorData.length<1 ? null : this.state.editorData[this.state.frontTab].fileName }</span>}
                        />
                        
                    </main>
                </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);
//export default withStyles(styles)(App);
