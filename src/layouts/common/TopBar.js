import React from 'react';
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { Link } from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Blockie from './Blockie';


const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  link: {
    color : '#fff',
    marginRight: '10px'
  }
};

function ButtonAppBar(props) {
  const { classes, address } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            <Link to="/" className={classes.link}>
              Algernon
            </Link>
          </Typography>
          <Link to={`/tags`} className={classes.link}>
            Tags
          </Link>
          <Link to={`/users/${address}`}>
            <Blockie address={address} />
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

// May still need this even with data function to refresh component on updates for this contract.
const mapState = state => {
  return {
    address: state.accounts[0]
  }
}
export default withStyles(styles)(drizzleConnect(ButtonAppBar, mapState));
