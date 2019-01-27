import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter} from 'react-router-dom'
import { DrizzleProvider } from 'drizzle-react'

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import App from './App.js'
import { LoadingContainer } from 'drizzle-react-components'

import { store } from './store'
import drizzleOptions from './drizzleOptions'

const web3error =
  <main className="container loading-screen">
    <div className="pure-g">
      <div className="pure-u-1-1">
        <h1><span role="img" aria-label="warning">⚠️</span></h1>
        <p>Algernon is running on the Rinkeby Test Network. Please use the Chrome/FireFox extension MetaMask, or dedicated Ethereum browsers Mist or Parity, or a web3 enabled mobile browser such as Status connected to the Rinkeby Test Network</p>
      </div>
    </div>
  </main>

ReactDOM.render((
    <DrizzleProvider options={drizzleOptions} store={store}>
      <LoadingContainer loadingComp={web3error}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LoadingContainer>
    </DrizzleProvider>
  ),
  document.getElementById('root')
);
