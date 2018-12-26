import React, { Component, Fragment } from 'react';
import { drizzleConnect } from 'drizzle-react'

import { withStyles } from '@material-ui/core/styles';
import Html from '../common/Html'
import Button from '../common/forms/Button'
import RichText from '../common/forms/RichText'
import schema from '../../schemas/topic'
import TopicTagsForm from '../tags/TopicTagsForm'
import TagItem from '../tags/LabelItem'

import EditIcon from '@material-ui/icons/Edit';

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
  tags: {
    display: 'flex',
    flexWrap: 'wrap'
  }
});

class Detail extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      editing: false
    }
  }

  onSubmit = (topicId, tagIds) => {
    console.log('update t tags: ', topicId, tagIds)


  }

  onCancel = () => this.setState({...this.state, editing: false})

  updateEditing = editing => this.setState({...this.state, editing})

  render () {
    const { classes, isOwner, tags, tagIds, topicId } = this.props

    const header = isOwner ? <h3>Tags<EditIcon onClick={this.updateEditing.bind(this, true)} /></h3> : <h3>Tags</h3>

    const tagOptions = tags.map((t,i) => ({label: t, value: i}))

    const detail = this.state.editing ?
      <TopicTagsForm tagIds={tagIds} options={tagOptions} onSubmit={this.onSubmit} topicId={topicId} onCancel={this.onCancel} />
      :
      <div className={classes.tags}>
        {tagIds.map(id => <TagItem key={id} label={tags[id]} />)}
      </div>


    return (
      <div>
        {header}
        {detail}
      </div>
    );
  }
}

const mapState = state => {
  return {
    tags: Object.keys(state.tags.tags)
  }
}

const mapDispatch = (dispatch) => {
    return {
        getIPFSHash: hash => dispatch({type: 'GET_IPFS_UPLOAD', payload: {hash}})

    };
}

export default withStyles(styles)(drizzleConnect(Detail, mapState, mapDispatch));
