import React from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';

import AceEditor from 'react-ace';

import brace from 'brace';
import 'brace/ext/searchbox';
import 'brace/mode/python';
import 'brace/mode/jsx';
import 'brace/mode/json';
import 'brace/mode/html';
import 'brace/mode/plain_text';
import 'brace/theme/twilight';
import 'brace/theme/tomorrow';

const styles = theme => ({
    
    hidden: {
        display: "none",
    },
    active: {
        display: "block",
    },

})

class Editors extends React.Component {

    focusAndSize = (index) => {
        if (index==this.props.frontEditor) {
            if (this.refs['ed'+index]!==undefined) {
                this.refs['ed'+index].editor.focus()
                this.refs['ed'+index].editor.resize()
            }
            return true
        } else {
            return false
        }
    }
    
    render() {

        const { classes, editorData, frontEditor, theme } = this.props;

        return (
            <React.Fragment>
                { editorData.map((editor, index) =>
                    <AceEditor
                        key={"editor"+index}
                        className={frontEditor === index ? classes.active : classes.hidden}
                        mode={editor.mode}
                        theme={ theme.palette.type=="light" ?  "tomorrow" : "twilight" }
                        fontSize={16}
                        name={"editor"+index}
                        onChange={this.props.handleAceChange}
                        value={editor.content}
                        editorProps={{ $blockScrolling: true }}
                        width="100%"
                        height="100%"
                        ref={"ed"+index}
                        showPrintMargin={false}
                        focus={this.focusAndSize(index)}
                    />
                )}
            </React.Fragment>
        );
    }
}

Editors.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withTheme()(withStyles(styles)(Editors));
