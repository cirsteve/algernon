import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import CancelIcon from '@material-ui/icons/Cancel';
import DoneIcon from '@material-ui/icons/Done';

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
  },
});

function FloatingActionButtons(props) {
  const { classes, onSubmit, onCancel, doneEl } = props;
  return (
    <div>
      <Fab onClick={onCancel} color="error" aria-label="Edit" className={classes.fab}>
        <CancelIcon />
      </Fab>
      {doneEl ?
        doneEl
        :
        <Fab onClick={onSubmit} color="secondary" aria-label="Edit" className={classes.fab}>
          <DoneIcon />
        </Fab>
      }
    </div>
  );
}

FloatingActionButtons.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FloatingActionButtons);
