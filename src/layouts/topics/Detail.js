import React, { Component, Fragment } from 'react';
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Html from '../common/Html'
import Button from '../common/forms/Button'
import RichText from '../common/forms/RichText'
import Fields from '../common/Fields'
import schema from '../../schemas/topic'
import UpdateTopic from '../ui/UpdateTopic'
import Chip from '../common/Chip'
import IconSubmit from '../common/forms/IconSubmit'
import TagDetail from './TagDetail'
import EditIcon from '@material-ui/icons/Edit'

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
      editingMetaData: false,
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

  updateEditingMetaData = (editingMetaData) => this.setState({...this.state, editingMetaData})

  updateEditingNote = (editingNote) => this.setState({...this.state, editingNote})

  cancelEdit = () =>  this.setState(
    {
      ...this.state,
      editingNote: false,
      editingMetaData: false,
      offChainFields: {
        ...this.state.offChainFields,
        notes: null,
        title: null,
        url: null,
        description: null
      }
    }
  )

  onNoteSubmit = () => {
    this.cancelEdit()
  }

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
    const { hashedContent, hash, owner, connectedAddress, id, tagIds } = this.props
    const { notes } = this.state.offChainFields
    let topic = 'Loading Topic'

    if (hashedContent[hash]) {
      const topicFields = hashedContent[hash];
      const doneEl = <UpdateTopic id={id} offChainFields={this.getOffChainFields(topicFields)} onSubmit={this.onNoteSubmit} />
      const metaFieldNames = ['title', 'url', 'description']
      const metaFields = schema.offChain
        .filter(f => metaFieldNames.includes(f.name))
        .map(f => ({...f, value: this.state.offChainFields[f.name] || topicFields[f.name], onChange: this.updateOffChainField.bind(this, f.name)}))
      const metaData = this.state.editingMetaData ?
        <div>
          <IconSubmit onCancel={this.cancelEdit.bind(this)} doneEl={doneEl} />
          <Fields fields={metaFields} />
        </div>
        :
        <div>
          <h1>
            {topicFields.title}
            { connectedAddress === owner ?
              <EditIcon onClick={this.updateEditingMetaData.bind(this, true)} />
              :
              null
            }
          </h1>
          <a href={topicFields.url} target="blank">{topicFields.url}</a>
          <div>
            {topicFields.description}
          </div>
        </div>


      const note =
        <div>
          <h4>
            Notes
            { connectedAddress === owner ?
              this.state.editingNote ?
                <IconSubmit onCancel={this.cancelEdit.bind(this)} doneEl={doneEl} />
                :
                <EditIcon onClick={this.updateEditingNote.bind(this, true)} />
              :
              null
            }
          </h4>
          {this.state.editingNote ?
            <RichText value={this.state.offChainFields.notes || topicFields.notes} onChange={this.updateOffChainField.bind(this, 'notes')} />
            :
            <Html html={notes || topicFields.notes} />
          }
        </div>

      topic =
        <Fragment>
          {metaData}
          <div>
            <TagDetail isOwner={connectedAddress === owner} tagIds={tagIds} topicId={parseInt(id)} />
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
