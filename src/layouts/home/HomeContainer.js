import Home from './Home'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    StudyGroup: state.contracts.StudyGroup
  }
}

export default drizzleConnect(Home, mapStateToProps);
