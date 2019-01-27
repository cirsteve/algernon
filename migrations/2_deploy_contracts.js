var Algernon = artifacts.require("Algernon");
var AlgerToken = artifacts.require("AlgerToken")

const TOKEN_CAP = 1 * 10 ** 8
const TOKEN_ADDRESS = '0xDF7623d2C57FB6023B1ACBB454afccB9D6A1b455'
module.exports = function(deployer) {
  //deployer.deploy(Algernon, TOKEN_ADDRESS);

  deployer.deploy(AlgerToken, TOKEN_CAP);
};
