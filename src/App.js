import React, { Component } from 'react'
import {Route, Switch } from 'react-router-dom'
import Home from './layouts/Home'
import User from './layouts/User'
import Group from './layouts/Group'
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
          <Route exact path="/users/:address" component={User}/>
          <Route exact path="/groups/:id" component={Group}/>
        </Switch>
      </div>
    );
  }
}

export default App
