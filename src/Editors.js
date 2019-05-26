import React, { Component, memo } from 'react';
import { useState, useEffect, useRef } from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';

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

const useStyles = makeStyles( theme => ({
    
    hidden: {
        display: "none",
    },
    active: {
        display: "flex",
    },




}))

function Editors(props) {
    
    const classes = useStyles();
    const theme = useTheme();
    let refs = useRef(new Map()).current;
    
    function focusAndSize(index) {
        if (index==props.frontEditor) {
            if (refs['ed'+index]!==undefined) {
                refs['ed'+index].editor.focus()
                refs['ed'+index].editor.resize()
            }
            return true
        } else {
            return false
        }
    }
    
    return props.editorData.map((editor, index) =>
                <AceEditor
                    key={"editor"+index}
                    className={props.frontEditor === index ? classes.active : classes.hidden}
                    mode={editor.mode}
                    theme={ theme.palette.type=="light" ?  "tomorrow" : "twilight" }
                    fontSize={16}
                    name={"editor"+index}
                    onChange={props.handleAceChange}
                    value={editor.content}
                    editorProps={{ $blockScrolling: true }}
                    width="100%"
                    height="100%"
                    ref={ inst => inst === null ? refs.delete("ed"+index) : refs.set("ed"+index, inst)}
                    showPrintMargin={false}
                    focus={focusAndSize(index)}
                />
            )

}

export default Editors;