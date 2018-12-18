import React, { Component } from 'react'
import {Route, Switch } from 'react-router-dom'
import Home from './layouts/Home'
import User from './layouts/User'
import Group from './layouts/Group'
import Topic from './layouts/Topic'
import Tags from './layouts/Tags'
import TopBar from './layouts/common/TopBar'

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
      <div className="App">
        <TopBar />
        <div style={contentStyle}>
          <div style={innerContentStyle}>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route exact path="/users/:address" component={User} />
              <Route exact path="/topics/:id" component={Topic} />
              <Route exact path="/groups/:id" component={Group} />
              <Route exact path="/tags" component={Tags} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}


export default App
