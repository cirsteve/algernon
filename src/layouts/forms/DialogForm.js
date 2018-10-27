import React from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class FormDialog extends React.Component {

  render() {
    const {text, content, handleClose, onSubmit, submitLabel } = this.props
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create A Group</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {text}
            </DialogContentText>
            {content}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.props.onSubmit} color="primary">
              {this.props.submitLabel}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
