var Algernon = artifacts.require("Algernon");
var AlgerToken = artifacts.require("AlgerToken")

const TOKEN_CAP = 1 * 10 ** 8
const TOKEN_ADDRESS = '0x154cc275E42ab11495CFf4ACb170f721c1bA14f4'
module.exports = function(deployer) {
  deployer.deploy(Algernon, TOKEN_ADDRESS);

  //deployer.deploy(AlgerToken, TOKEN_CAP);
};
