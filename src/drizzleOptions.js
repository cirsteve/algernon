import Groups from './../build/contracts/Groups.json'
import AlgerToken from './../build/contracts/AlgerToken.json'

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
    }
  },
  contracts: [
    Groups,
    AlgerToken

  ],
  events: {
    Groups: ['GroupCreated']
  },
  polls: {
    accounts: 1500
  }
}

export default drizzleOptions
