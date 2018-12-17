import React, { Component, Fragment } from 'react';
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import GridListTile from '@material-ui/core/GridListTile';
import Html from '../common/Html'
import Button from '../common/forms/Button'
import RichText from '../common/forms/RichText'
import schema from '../../schemas/topic'
import UpdateTopic from '../ui/UpdateTopic'

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

class Detail extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      editingNote: false,
      offChainFields: schema.offChain.reduce((acc, f) => {
        acc[f.name] = null;
        return acc;
      }, {}),
    }
  }

  componentDidMount = () => this.maybeFetchIpfs()

  componentDidUpdate = (prevProps) => {
    if (prevProps.hash !== this.props.hash) {
      this.maybeFetchIpfs()
    }
  }

  maybeFetchIpfs () {
    if (!this.props.hashedContent[this.props.hash]) {
      this.props.getIPFSHash(this.props.hash);
    }
  }

  updateEditingNote = (editingNote) => this.setState({...this.state, editingNote})

  cancelEditNote = () =>  this.setState({...this.state, editingNote: false, offChainFields: {...this.state.offChainFields, notes: null}})

  updateOffChainField = (field, e, val) => {
    this.setState({
      ...this.state,
      offChainFields: {
        ...this.state.offChainFields,
        [field]: typeof e === 'string' ? e : e.target.value
      }
    })
  }

  getOffChainFields = (fields) => {
    return Object.keys(fields).reduce((acc, f) => {
      acc[f] = this.state.offChainFields[f] || fields[f]
      return acc
    }, {})
  }

  render () {
    const { hashedContent, hash, owner, connectedAddress, id } = this.props
    const { notes } = this.state.offChainFields
    let topic = 'Loading Topic'
    console.log('render detail: ', hashedContent, hash)

    if (hashedContent[hash]) {
      const topicFields = hashedContent[hash];
          console.log('render detail: ', this.getOffChainFields(topicFields), this.state.offChainFields)

      const note = this.state.editingNote ?
        <div>
          <Button text="Cancel Edit" onClick={this.cancelEditNote.bind(this)} />
          <UpdateTopic id={parseInt(id)} offChainFields={this.getOffChainFields(topicFields)} />
          <RichText value={notes || topicFields.notes} onChange={this.updateOffChainField.bind(this, 'notes')} />
        </div>
        :
        <div>
          { connectedAddress === owner ? <Button text="Edit" onClick={this.updateEditingNote.bind(this, true)} /> : null}
          <Html html={notes || topicFields.notes} />
        </div>

      topic =
        <Fragment>
          <h4>
            {topicFields.title}
          </h4>
          <a href={topicFields.url} target="blank">{topicFields.url}</a>
          <div>
            {topicFields.description}
          </div>
          <div>
            {note}
          </div>
        </Fragment>

    }

    return (
        <div>
          {topic}
        </div>
    );
  }
}


Detail.contextTypes = {
  drizzle: PropTypes.object
}

Detail.propTypes = {
  classes: PropTypes.object.isRequired,
  hash: PropTypes.string.isRequired,
  hashedContent: PropTypes.object.isRequired,
};

const mapState = state => {
  return {
    connectedAddress: state.accounts[0],
    hashedContent: state.data.hashedContent
  }
}

const mapDispatch = (dispatch) => {
    return {
        getIPFSHash: hash => dispatch({type: 'GET_IPFS_UPLOAD', payload: {hash}})

    };
}

export default withStyles(styles)(drizzleConnect(Detail, mapState, mapDispatch));
