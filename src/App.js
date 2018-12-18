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

class App extends Component {


  render() {
    return (
      <div className="App">
        <TopBar />
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/users/:address" component={User} />
          <Route exact path="/topics/:id" component={Topic} />
          <Route exact path="/groups/:id" component={Group} />
          <Route exact path="/tags" component={Tags} />
        </Switch>
      </div>
    );
  }
}


export default App
