//using the infura.io node, otherwise ipfs requires you to run a daemon on your own computer/server. See IPFS.io docs
const IPFS = require('ipfs-http-client');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

//to run IPFS locallu comment the above assignment ot ipfs and uncomment the line below
//const ipfs = new IPFS({ host: 'localhost', port: 5001, protocol: 'http' });

export default ipfs;
