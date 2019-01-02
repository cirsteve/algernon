import React, { Component } from 'react'
import {Route, Switch } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Home from './layouts/Home'
import User from './layouts/User'
import Group from './layouts/Group'
import Groups from './layouts/Groups'
import Topic from './layouts/Topic'
import PrivateTopic from './layouts/PrivateTopic'
import Topics from './layouts/Topics'
import Tags from './layouts/Tags'
import TopBar from './layouts/common/TopBar'

import theme from './theme.js'
// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
const contentStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '1em'
}

const innerContentStyle = {
  width: '650px',
}

class App extends Component {


  render() {
    return (
      <MuiThemeProvider theme={createMuiTheme(theme)}>
      <div className="App">
        <TopBar />
        <div style={contentStyle}>
          <div style={innerContentStyle}>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route exact path="/users/:address" component={User} />
              <Route exact path="/topics" component={Topics} />
              <Route exact path="/topics/:id" component={Topic} />
              <Route exact path="/privatetopics/:id" component={PrivateTopic} />
              <Route exact path="/groups" component={Groups} />
              <Route exact path="/groups/:id" component={Group} />
              <Route exact path="/tags" component={Tags} />
            </Switch>
          </div>
        </div>
      </div>
      </MuiThemeProvider>
    );
  }
}


export default App
