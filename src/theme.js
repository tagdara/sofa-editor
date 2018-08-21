import { createMuiTheme } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';
import indigo from '@material-ui/core/colors/indigo';
import red from '@material-ui/core/colors/red';
import brown from '@material-ui/core/colors/brown';
import black from '@material-ui/core/colors/black';
import white from '@material-ui/core/colors/white';
import darkBaseTheme from '@material-ui/styles/baseThemes/darkBaseTheme';

export default createMuiTheme({
    palette: {
        type: 'dark',
        primary: deepOrange,
        //secondary: brown, // Indigo is probably a good match with pink
        background: { default: "#222222" },
    }
});
