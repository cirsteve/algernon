var Groups = artifacts.require("Groups");
var AlgerToken = artifacts.require("AlgerToken")

const TOKEN_CAP = 1 * 10 ** 6
module.exports = function(deployer) {
  deployer.deploy(Groups);

  //deployer.deploy(AlgerToken, TOKEN_CAP);
};
