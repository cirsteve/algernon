import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Html from './Html'

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
    const {link, hashedContent, hash, fieldsToRender } = this.props
    let ipfsContent = 'Loading info IPFS'

    if (hashedContent[hash]) {
      const values = hashedContent[hash];
      let keys = Object.keys(values)
      keys = fieldsToRender ? keys.filter(k => fieldsToRender.includes(k)) : keys
      console.log(values, keys)
      ipfsContent = keys.map((k, idx)=> (
        <div key={k}>

          {
            k === 'notes' || k === 'content' ?
              <Html html={values[k]} />
              :
              link && idx === 0 ?
                <h3><Link to={link}>{values[k]}</Link></h3>
                :
                k === 'url' ?
                  <a href={values[k]} target="blank">{values[k]}</a>
                  :
                  values[k]
          }
        </div>
      ))
    }

    return (
      <div>
        {ipfsContent}
      </div>
    )
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
