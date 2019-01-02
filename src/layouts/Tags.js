import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import {range} from 'lodash'
import TagItem from './tags/Item'
import TagForm from './tags/MasterTagForm'
import Loading from './common/Loading'

const styles = theme => ({
  root: {
    maxWidth: '600px'
  },
  tagList: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  loadingTag: {
    display: 'flex',
    alignItems: 'center'
  }
});


class Tags extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.Groups.methods
    this.tagCountKey = this.methods.getTagCount.cacheCall()


  }

  componentDidMount () {
    const { getTagCount, getTag } = this.methods

    this.props.getTags(getTagCount, getTag)
  }

  getRenderValues = () => ({
    tagCount: this.props.Groups.getTagCount[this.tagCountKey] ?
      parseInt(this.props.Groups.getTagCount[this.tagCountKey].value) : null
  })

  render () {
    const {tagCount} = this.getRenderValues()
    const {classes, fetchedTags, submittedTags} = this.props
    let tags = 'loading'
    const pendingTags = submittedTags
      .filter(tag => fetchedTags.find(t =>  t === tag) === undefined  )
      .map(tag => <div key={tag} className={classes.loadingTag}>{tag} <Loading icon='spokes' height={30} width={30}/></div>)

    if (Number.isInteger(tagCount)) {
      tags = range(tagCount).map(idx => <TagItem key={idx} idx={idx} />)
        .concat(pendingTags)
    } else {
      tags = pendingTags.length ? pendingTags : 'No tags'
    }

    return (
      <div className={classes.root}>
        <h1>Tags</h1>
        <TagForm />
        <div className={classes.tagList}>
          {tags}
        </div>
      </div>
    )
  }
}

Tags.contextTypes = {
  drizzle: PropTypes.object
}

const mapState = state => {
  return {
    Groups: state.contracts.Groups,
    fetchedTags: Object.keys(state.tags.tags),
    submittedTags: Object.keys(state.tags.submittedTags)
  }
}

const mapDispatch = (dispatch) => {
    return {
        getTags: (getTagCount, getTag) => dispatch({type: 'GET_TAGS', payload: {getTagCount, getTag}})

    };
}

export default drizzleConnect(withStyles(styles)(Tags), mapState, mapDispatch)
