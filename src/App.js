import React, { Component } from 'react'
import {BrowserRouter, Route, Switch } from 'react-router-dom'
import Home from './layouts/Home'
import User from './layouts/User'


// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
      <BrowserRouter>
        <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/users/:address" component={User}/>
        </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App
