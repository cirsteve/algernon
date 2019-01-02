import React, { Component, Fragment } from 'react';
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Html from '../common/Html'
import RichText from '../common/forms/RichText'
import Fields from '../common/Fields'
import schema from '../../schemas/topic'
import UpdateTopic from '../ui/UpdateTopic'
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
  paper: {
    ...theme.mixins.gutters(),
    marginTop: '0.5em',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  ownerLink: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  ownerA:{
    color: 'gray',
  }
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
    const { classes, hashedContent, hash, owner, connectedAddress, id, tagIds } = this.props
    const { notes } = this.state.offChainFields
    let topic = 'Loading Topic'
    const isOwner = connectedAddress === owner

    if (hashedContent[hash]) {
      const topicFields = hashedContent[hash];
      const doneEl = <UpdateTopic id={id} offChainFields={this.getOffChainFields(topicFields)} onSubmit={this.onNoteSubmit} />
      const metaFieldNames = ['title', 'url', 'description']
      const metaFields = schema.offChain
        .filter(f => metaFieldNames.includes(f.name))
        .map(f => ({...f, value: this.state.offChainFields[f.name] || topicFields[f.name], onChange: this.updateOffChainField.bind(this, f.name)}))
      const metaData =
        <Fragment>
          <div style={{display: this.state.editingMetaData ? 'block' : 'none' }}>
            <IconSubmit onCancel={this.cancelEdit.bind(this)} doneEl={doneEl} />
            <Fields fields={metaFields} />
          </div>
          <div style={{display: this.state.editingMetaData ? 'none' : 'block'}}>
            <div className={classes.ownerLink}>
              <Link className={classes.ownerA} to={`/users/${owner}`}>{owner}</Link>
            </div>
            <Typography variant="h3" component="h4">
              {topicFields.title}
              { isOwner ?
                <EditIcon onClick={this.updateEditingMetaData.bind(this, true)} />
                :
                null
              }
            </Typography>
            <Paper className={classes.paper} elevation={1}>
            <a href={`//${topicFields.url}`} target="_blank" rel="noopener noreferrer">{topicFields.url}</a>
            <div>
              {topicFields.description}
            </div>
            </Paper>
          </div>
        </Fragment>


      const note =
        <div>
          <Typography variant="h4" component="h4">
            Notes
            { connectedAddress === owner ?
                <Fragment>
                  <div style={{display: this.state.editingNote ? 'inline' : 'none' }}>
                    <IconSubmit onCancel={this.cancelEdit.bind(this)} doneEl={doneEl} />
                  </div>
                  <EditIcon style={{display: this.state.editingNote ? 'none' : 'inline' }} onClick={this.updateEditingNote.bind(this, true)} />
                </Fragment>
              :
              null
            }
          </Typography>
          <Paper className={classes.paper} elevation={1}>
          {this.state.editingNote ?
            <RichText value={this.state.offChainFields.notes || topicFields.notes} onChange={this.updateOffChainField.bind(this, 'notes')} />
            :
            <Html html={notes || topicFields.notes} />
          }
        </Paper>
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
