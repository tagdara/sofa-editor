import React from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import theme from './theme';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DescriptionIcon from '@material-ui/icons/Description';
import FolderIcon from '@material-ui/icons/Folder';
import NoteIcon from '@material-ui/icons/Note';

import AceEditor from 'react-ace';
import FilePicker from './filePicker';

import brace from 'brace';
import 'brace/ext/searchbox';
import 'brace/mode/python';
import 'brace/mode/jsx';
import 'brace/mode/json';
import 'brace/mode/html';
import 'brace/mode/plain_text';
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
        marginLeft: drawerWidth,
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
        justifyContent: "center",
        flexGrow: 1,
        display: 'flex',
        paddingTop: 64,

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
        display: "flex",
        height: "100%",
        width: "100%",
        justifyContent: "center",
    },
    dirList: {
        overflowY: "scroll",
        overflowX: "hidden",
    },
    startCard: {
        maxWidth: 480,
        maxHeight: 240,
        margin: 24,
    }
}


class App extends React.Component {
    
    state = {
        open: true,
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
        console.log('focus')
        this.refs['ed'+frontTab].editor.focus()
        this.refs['ed'+frontTab].editor.resize()
        if (this.state.editorData[this.state.frontTab].fileName) {
            document.title = this.state.editorData[frontTab].fileName
        } else {
            document.title = 'Sofa Editor'
        }
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
    
    modeByFilename = (filename) => {
        var knowntypes={'py':'python','js':'jsx','jsx':'jsx','json':'json','html':'html','log':'python'}
        var ext = filename.substr(filename.lastIndexOf('.') + 1);
        if (Object.keys(knowntypes).includes(ext)) {
            return knowntypes[ext]
        } else {
            return 'plain_text'
        }

    }

    openFileTab = (filedir,filename) => {
        if (!filedir.endsWith('/')) { filedir=filedir+'/' }
        var newfile=filedir+filename

        var neweditor={}
        this.getFile(newfile)
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
                <div className={classes.dirList}>
                <FilePicker startdir={this.state.startdir} openFile={this.openFileTab} />
	            </div>
	           <Divider />
            </Drawer>
        );

        return (
                <div className={classes.appFrame}>
                    <AppBar className={classNames(classes.appBar, { [classes.appBarShift]: open })} >
                        <Toolbar disableGutters >
                            <IconButton
                                color="inherit"
                                aria-label="Open drawer"
                                onClick={this.handleDrawerOpen}
                                className={classNames(classes.menuButton, open && classes.hide)}
                            >
                                <MenuIcon />
                            </IconButton>
                            { this.state.editorData.length>0 ?
                                <React.Fragment>
                                <Tabs
                                    className={classes.tabs}
                                    value={this.state.frontTab}
                                    onChange={this.handleChange}
                                    scrollable
                                    scrollButtons="auto"
                                >
                                { this.state.editorData.map((editor, index) =>
                                    <Tab key={"tab"+index} label={editor.changed ? editor.fileName+" *" : editor.fileName} />
                                )}
                                </Tabs>
                                { this.state.editorData[this.state.frontTab].fileName.endsWith('.log') ?
                                <Button color="inherit" onClick={ () => this.refreshFile() } >Refresh</Button>
                                :
                                <Button color="inherit" onClick={ () => this.saveFile() } >Save</Button>
                                }
                                <IconButton color="inherit" aria-label="Open drawer" onClick={this.closeTab}>
                                    <ClearIcon />
                                </IconButton>
                                </React.Fragment>
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
                            <Card className={classes.startCard}>
                                <CardHeader 
                                    avatar={<Avatar>S</Avatar>}
                                    title="Sofa Editor" />
                                <CardContent>
                                    <Typography>Open a file from the left menu to begin.</Typography>
                                </CardContent>
                            </Card>
                            : 
                                this.state.editorData.map((editor, index) =>
                                    <AceEditor
                                        key={"editor"+index}
                                        className={this.state.frontTab === index ? classes.active : classes.hidden}
                                        mode={editor.mode}
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
