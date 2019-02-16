import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import axios from 'axios';

import './App.css';


const styles = theme => ({
    root: {
        textAlign: 'center',
        paddingTop: theme.spacing.unit * 20,
        flexGrow: 1,
    },
    textFld: {
        "padding-left": 0,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    mainContainer: {
        "background-image": "url(https://picsum.photos/1024/800/?random)",
        "height": "100%",
        "background-position": "center",
        "background-repeat": "no-repeat",
        "background-size": "cover",
        "minHeight": "100vh",
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center"

    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center"
    },
});

class DownloadPage extends Component {

    getRandomGif = () => {
        axios.request({
            method: "get",
            url:"https://api.giphy.com/v1/gifs/random?api_key=IiHi1ZPKkhDEIMRfFxyCwfzPr8JfugON&tag=&rating=G&tag=sad",
        }).then(data => {
            var gifUrl = data.data.data.images.original.url;
            this.setState({gifUrl: gifUrl});
        });
    }

    constructor() {
        super();
        this.state = {
            gifUrl: ""
        };

        this.getRandomGif();
    }


    render() {
        return (
            <div className = {this.props.classes.mainContainer}>
                <Grid
                    container spacing={16}
                    item xs={3}
                    direction="column"
                    justify="center"
                    alignItems="stretch">
                    <Paper className={this.props.classes.paper}>
                    <div>
                        <img width="200" src={this.state.gifUrl}></img><br/>
                        Page not found :(
                        </div>
                    </Paper>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(DownloadPage);
