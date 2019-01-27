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


class Item extends React.Component {

  componentDidMount = () => {
    console.log('chip mounted: ', this.props.label)
    this.props.tagReceived(this.props.label)
  }
  render () {
    const { classes, label, component } = this.props
    return (
      <Chip label={label} component={component} className={classes.chip} color='primary'/>
    );
  }
}


Item.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatch = (dispatch) => ({
  tagReceived: (tag) => dispatch({type: 'TAG_RECEIVED', payload: {tag}})
})

export default drizzleConnect(withStyles(styles)(Item), () => ({}), mapDispatch );
