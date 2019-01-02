import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    minWidth: 275,
    marginBottom: '1em'
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

function SimpleCard(props) {
  const { classes, title, header, text, actionButtons } = props;

  return (
    <Card className={classes.card}>
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
    </Card>
  );
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleCard);
