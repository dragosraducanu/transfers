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

class App extends Component {
    constructor() {
        super();
        this.state = {
            showSuccessModal: false,
            uploadProgress: 0,
            formData: {
                to: '',
                from: '',
                description: '',
                selectedFile: '',
                selectedFileName: "Select file",
            }
        };

        this.handleFileAttached = this.handleFileAttached.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    onFormDataChanged = (val, id) => {
        var formData = this.state.formData;

        switch (id) {
            case 'from':
                formData.from = val;
                break;
            case 'to':
                formData.to = val;
                break;
            case 'description':
                formData.description = val;
                break;
            default:
        }

        this.setState({formData: formData });
    }

    isFormValidForSubmit = () => {
        return this.state.uploadProgress === 0 && this.state.formData.selectedFile !== null && this.state.formData.to && this.state.formData.from;
    }

    handleUploadFinish = () => {
       this.setState({ showSuccessModal: true, uploadProgress: 0 });
     };

     onLinkCopied = () => {
         // this.textarea.select();
         // document.execCommand('copy');
         // This is just personal preference.
         // I prefer to not show the the whole text area selected.
     }

     handleClose = () => {
       this.setState({
           showSuccessModal: false,
           uploadProgress: 0,
           formData: {
               to: '',
               from: '',
               description: '',
               selectedFile: '',
               selectedFileName: "Select file",
           }
       });
     };

    handleSubmit() {
        if (this.state.formData.selectedFile !== undefined) {
            const data = new FormData();
            data.append('file', this.state.formData.selectedFile);
            data.append('from', this.state.formData.from);
            data.append('description', this.state.formData.description);

            axios.request({
                method: "post",
                url:"/api/upload",
                data: data,
                onUploadProgress: (p) => {
                    this.setState({
                        uploadProgress: p.loaded / p.total
                    })
                }
            }).then(data => {
                console.log(data.data);
                this.setState({
                    downloadLink: window.location.href + "transfers/" + data.data.public_id
                });
                this.handleUploadFinish();
            })
        } else {
            console.log("no file");
        }
    }

    handleFileAttached(event: ChangeEvent<HTMLInputElement>) {
        event.persist();
        var file = event.target.files[0];
        var formData = this.state.formData;
        formData.selectedFile = file;

        if(file != undefined) {
            formData.selectedFileName = file.name;
        }

        this.setState({formData: formData});
    }

    render() {
        return (
            <div className="App"
                className = {this.props.classes.mainContainer}>
                <Dialog
                    fullWidth
                    maxWidth="sm"
                    open={this.state.showSuccessModal}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">Your file has been uploaded</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            A download link has been generated for you.<br/>You can share this link:<br/>
                        <Paper className={this.props.classes.paper}>
                            {this.state.downloadLink}
                        </Paper>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <CopyToClipboard text={this.state.downloadLink}>
                            <Button color="primary">
                                Copy link
                            </Button>
                        </CopyToClipboard>

                        <Button onClick={this.handleClose} color="primary">
                            Close
                        </Button>
          </DialogActions>
                </Dialog>
                <Grid
                    container spacing={16}
                    item xs={3}
                    direction="column"
                    justify="center"
                    alignItems="stretch">
                    <Paper className={this.props.classes.paper}>
                        <Grid
                            container spacing={16}
                            item xs={11}
                            direction="column"
                            justify="flex-start"
                            alignItems="stretch">
                            <Grid
                                container
                                direction="row"
                                item xs={12}
                                justify="center">
                                <input
                                    accept="*"
                                    className={this.props.classes.input}
                                    style = {{ display: 'none' }}
                                    id="raised-button-file"
                                    type="file"
                                    onChange={this.handleFileAttached}
                                    />
                                <label htmlFor="raised-button-file">
                                    <Button variant="outlined" color="primary" component="span" className={this.props.classes.button}>
                                        {this.state.formData.selectedFileName}
                                        <AttachFile className={this.props.classes.rightIcon} />
                                    </Button>
                                </label>

                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label = "Send to"
                                    value = { this.state.formData.to }
                                    onChange = { (e) => this.onFormDataChanged(e.target.value, 'to') }
                                    className = {this.props.classes.textFld}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Your name"
                                    value = { this.state.formData.from }
                                    onChange = { (e) => this.onFormDataChanged(e.target.value, 'from') }
                                    className = {this.props.classes.textFld} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    margin="normal"
                                    rows="4"
                                    rowsMax="4"
                                    value = { this.state.formData.description }
                                    onChange = { (e) => this.onFormDataChanged(e.target.value, 'description') }
                                    className = {this.props.classes.textFld} />
                            </Grid>
                            <Grid
                                container
                                item xs={12}
                                justify="center">
                                <Button
                                    onClick={this.handleSubmit}
                                    type = "submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={!this.isFormValidForSubmit()}>
                                    Upload
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <p hidden={this.state.uploadProgress === 0 || this.state.uploadProgress === 1}>
                                    Uploading {Math.round(this.state.uploadProgress * 100)}%
                                </p>

                            </Grid>
                            <Grid item xs={12}>
                                <LinearProgress style={{marginTop: "16"}} variant="determinate" value={this.state.uploadProgress * 100} hidden={this.state.uploadProgress === 0 || this.state.uploadProgress === 1} />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(App);
