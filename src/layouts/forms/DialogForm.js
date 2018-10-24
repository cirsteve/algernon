import React from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const Text = props =>
  <TextField
    autoFocus
    onChange={props.onChange}
    id={props.name}
    label={props.label}
    type={props.type}
    fullWidth
    value={props.value} />

const RENDER_FIELDS = {

}

export default class FormDialog extends React.Component {

  render() {
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
              Fill in the fields below to create your own study group
            </DialogContentText>
            {this.props.fields.map(Text)}
            {this.props.metaDataFields.map(Text)}
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
