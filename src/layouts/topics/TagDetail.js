import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { difference } from 'lodash'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import TopicTagsForm from '../tags/TopicTagsForm'
import TagItem from '../tags/LabelItem'

import EditIcon from '@material-ui/icons/Edit'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'hidden',
    margin: '2em 0',

  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap'
  }
});

class Detail extends Component {
  constructor(props, context) {
    super(props)
    this.methods = context.drizzle.contracts.Algernon.methods
    this.refreshTagTopicIds()

    this.state = {
      editing: false
    }
  }

  refreshTagTopicIds = () => {
    const { tagIds, address} = this.props;
    this.tagTopicsKeys = tagIds.reduce((acc, id) => {
      acc[id] = this.methods.getTagAddressTopicIds.cacheCall(id, address)
      return acc
    }, {})
  }

  getTagTopicsIds = () => {
    const tagTopicsIds = this.props.Algernon.getTagAddressTopicIds
    return Object.keys(this.tagTopicsKeys).reduce((acc, key) => {
      acc[key] = tagTopicsIds[this.tagTopicsKeys[key]] ? tagTopicsIds[this.tagTopicsKeys[key]].value : []
      return acc
    }, {})
  }

  componentDidUpdate = (prevProps) => {
    if (difference(prevProps.tagIds, this.props.tagIds).length
      || this.props.tagIds.length !== prevProps.tagIds.length) {

        this.refreshTagTopicIds()
      }
  }

  onCancel = () => this.setState({...this.state, editing: false})

  updateEditing = editing => this.setState({...this.state, editing})

  render () {
    const { classes, isOwner, address, tags, tagIds, topicId } = this.props

    const tagTopicIds = this.getTagTopicsIds();

    const header = isOwner ? <Typography variant="h4" component="h4">Tags<EditIcon onClick={this.updateEditing.bind(this, true)} /></Typography> : <h3>Tags</h3>

    const tagOptions = tags.map((t,i) => ({label: t, value: i}))

    const detail = this.state.editing ?
      <TopicTagsForm tagIds={tagIds} options={tagOptions} topicId={topicId} tagTopicIds={tagTopicIds} onCancel={this.onCancel} />
      :
      <div className={classes.tags}>
        {tagIds.map(id => tags[id] ? <TagItem key={id} label={tags[id]} idx={id} /> : null)}
      </div>


    return (
      <div className={classes.root}>
        {header}
        {detail}
      </div>
    );
  }
}


Detail.contextTypes = {
  drizzle: PropTypes.object
}

const mapState = state => {
  return {
    Algernon: state.contracts.Algernon,
    tags: Object.keys(state.tags.tags)
  }
}

const mapDispatch = dispatch => ({
    getTagTopics: (get, tagIds) => dispatch({type: 'GET_TAG_TOPICS', payload: {get, tagIds}})
  })

export default withStyles(styles)(drizzleConnect(Detail, mapState, mapDispatch));
