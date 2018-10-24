import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridListTile from '@material-ui/core/GridListTile';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

class Tile extends Component {
  componentDidMount () {
    if (!this.props.hashedContent[this.props.hash]) {
      this.props.getIPFSHash(this.props.hash);
    }
  }
  render () {
    let ipfsContent = 'Loading info IPFS';

    if (this.props.hashedContent[this.props.hash]) {
      console.log('ipfs content: ', this.props.hashedContent)
      const values = this.props.hashedContent[this.props.hash];
      ipfsContent = Object.keys(values).map((k, idx)=> (
        <div key={k}>
          {k}: {values[k]}
        </div>
      ))
    }

    return (
        <GridListTile>
          {ipfsContent}
        </GridListTile>
    );
  }
}

Tile.propTypes = {
  classes: PropTypes.object.isRequired,
  hash: PropTypes.string.isRequired,
  hashedContent: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    hashedContent: state.data.hashedContent
  }
}

const dispatchToProps = (dispatch) => {
    return {
        getIPFSHash: hash => dispatch({type: 'GET_IPFS_UPLOAD', payload: {hash}})

    };
}

export default withStyles(styles)(drizzleConnect(Tile, mapStateToProps, dispatchToProps));
