import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import AttachFile from '@material-ui/icons/AttachFile';
import Link from '@material-ui/core/Link';
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';

import CopyToClipboard from 'react-copy-to-clipboard';

import withRoot from './withRoot';
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
            url:"https://api.giphy.com/v1/gifs/random?api_key=IiHi1ZPKkhDEIMRfFxyCwfzPr8JfugON&tag=&rating=G&tag=excited",
        }).then(data => {
            var gifUrl = data.data.data.images.original.url;
            this.setState({gifUrl: gifUrl});
        });
    }

    getTransfer = () => {
        var publicId = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
        axios.request({
            method: "get",
            url:"/api/transfers",
            params: {
                public_id: publicId
            }
        }).then(data => {
            this.setState({
                downloadLink: data.data.s3_path,
                from: data.data.from,
                message: data.data.message
            })
            console.log(data);
        });
    }

    constructor() {
        super();
        this.state = {
            from: "",
            message: "",
            downloadLink: "",
            gifUrl: ""
        };

        this.getRandomGif();
        this.getTransfer();
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
                        You have a new file from <b>{this.state.from}</b>!<br/><br/>
                        This is what <b>{this.state.from}</b> said: <br/>
                        <i>{this.state.message}</i>
                        <br/><br/>
                        Click the button below to download your file!
                        <br/><br/>
                        <Link href={this.state.downloadLink}>
                        <Button
                            variant="contained"
                            color="primary">
                            Download
                        </Button>
                        </Link>

                        </div>
                    </Paper>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(DownloadPage);
