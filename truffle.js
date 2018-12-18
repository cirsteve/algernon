module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(process.env.SEED_WORDS, `https://rinkeby.infura.io/${process.env.INFURA_KEY}`)
        //return new PKWalletProvider(process.env.PRIVATE_KEY, `https://rinkeby.infura.io/${process.env.INFURA_KEY}`)
      },
      network_id: 4,
      //gas: 4612388 // Gas limit used for deploys
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
};
