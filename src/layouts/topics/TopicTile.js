import React from 'react'
import { Link } from 'react-router-dom'
import Card from './TopicCard'

export default ({ id, tagId, url, title, description, stakeTotal }) => {
    const urlLink = <a href={`//${url}`} target="blank">{url}</a>
    const header = <Link to={`/topics/${id}`}>{title}</Link>
    return <Card title={urlLink} header={header} text={description} total={stakeTotal} tagId={tagId} topicId={id} />
  }
