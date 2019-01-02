import React from 'react';
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';


const styles = theme => ({
  chip: {
    margin: theme.spacing.unit,
  },
});


function Item({ classes, label }) {
  return (
    <Chip label={label} className={classes.chip} color='#ef12ef'/>

  );
}

Item.componentDidMount = () => this.props.tagReceived(this.props.label)

Item.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatch = (dispatch) => ({
  tagReceived: (tag) => dispatch({type: 'TAG_RECEIVED', payload: {tag}})
})

export default drizzleConnect(withStyles(styles)(Item), () => ({}), mapDispatch );
