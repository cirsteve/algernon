var Algernon = artifacts.require("Algernon");
var AlgerToken = artifacts.require("AlgerToken")

const TOKEN_CAP = 1 * 10 ** 8
const TOKEN_ADDRESS = '0x92047B590959eA2Bb1DEB36f69d875414d16ad53'
module.exports = function(deployer) {
  deployer.deploy(Algernon, TOKEN_ADDRESS);

  //deployer.deploy(AlgerToken, TOKEN_CAP);
};
