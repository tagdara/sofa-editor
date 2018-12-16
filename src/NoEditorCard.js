import React from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = {
    
    startCard: {
        maxWidth: 480,
        maxHeight: 240,
        margin: 24,
    }
}

class NoEditorCard extends React.Component {
    
    render() {

        const { classes } = this.props;

        return (
            <Card className={classes.startCard}>
                <CardHeader 
                    avatar={<Avatar>S</Avatar>}
                    title="Sofa Editor" />
                <CardContent>
                    <Typography>Open a file from the left menu to begin.</Typography>
                </CardContent>
            </Card>
        );
    }
}

NoEditorCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NoEditorCard);
