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
    marginRight: '25px'
  }
};

class Bar extends React.Component {
  constructor (props, context) {
    super(props)
    this.tokenBalanceKey = context.drizzle.contracts.Algernon.methods
      .getAlgernonTokenBalance.cacheCall(props.address)

  }

  getRenderValues = () => ({
    balance:this.props.Algernon.getAlgernonTokenBalance[this.tokenBalanceKey] ?
          parseInt(this.props.Algernon.getAlgernonTokenBalance[this.tokenBalanceKey].value) : 0
  })

  render () {
    const {balance} = this.getRenderValues()
    const { classes, address } =this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              <Link to="/" className={classes.link}>
                Algernon
              </Link>
            </Typography>
            <div>
              <Link to={`/topics`} className={classes.link}>
                Topics
              </Link>
              <Link to={`/groups`} className={classes.link}>
                Groups
              </Link>
              <Link to={`/tags`} className={classes.link}>
                Tags
              </Link>
              <Link to={`/token`} className={classes.link}>
                Token
              </Link>
            </div>
            <div>
              {balance} ALG
            </div>
            <Link to={`/users/${address}`}>
              <Blockie address={address} />
            </Link>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Bar.propTypes = {
  classes: PropTypes.object.isRequired,
};

Bar.contextTypes = {
  drizzle: PropTypes.object
}
// May still need this even with data function to refresh component on updates for this contract.
const mapState = state => {
  return {
    address: state.accounts[0],
    Algernon: state.contracts.Algernon
  }
}
export default withStyles(styles)(drizzleConnect(Bar, mapState));
