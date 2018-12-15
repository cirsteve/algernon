import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  }
});

class SimpleTabs extends React.Component {
  constructor (props, context) {
    super(props)

    this.state = {
      index: 0
    }
  }

  updateIndex = (ev, index) => this.setState({...this.state, index})

  render() {
    const { classes, tabs} = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={this.state.index} onChange={this.updateIndex}>
            {tabs.filter(t => t.label).map(t => <Tab key={t.label} label={t.label} />)}
          </Tabs>
        </AppBar>
        <SwipeableViews index={this.state.index}>
          {tabs.map(t => t.content)}
        </SwipeableViews>
      </div>
    );
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTabs);
