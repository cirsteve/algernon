import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import StakeTotal from '../stakes/StakeTotal'

const styles = {
  card: {
    width: 450,
    marginBottom: '1em',
  },
  cardContent: {
    display: 'inline-block',
    width: 400,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  total: {
    fontSize: 14,
    float: 'right',
    marginRight: '10px'
  }
};

function SimpleCard(props) {
  const { classes, title, header, text, actionButtons, topicId, tagId } = props;

  return (
    <Card className={classes.card}>
      <div className={classes.cardContent}>
      <CardContent>
        { title ?
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              {title}
            </Typography>
            :
            null
        }
        { header ?
            <Typography variant="h5" component="h2">
              {header}
            </Typography>
            :
            null
        }
        { text ?
            <Typography component="p">
              {text}
            </Typography>
            :
            null
        }
      </CardContent>
      { actionButtons ?

          <CardActions>
            {actionButtons}
          </CardActions>
          :
          null
      }
      </div>
      {tagId ?
        <div className={classes.total}>
          <StakeTotal topicId={topicId} tagId={tagId} />
        </div>
        :
        null
      }
    </Card>
  );
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleCard);
