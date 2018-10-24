pragma solidity ^0.4.24;

import './Multihash.sol';

/** @title Users. */
contract Users is MultiHash {

  mapping (address => Multihash[]) public userNotes;
  mapping (address => uint[]) public userGroups;
  mapping (address => uint[]) public userOwnedGroups;
  mapping (address => uint256) public balances;

  event UserEnrolled(address user, uint256 _id);

  function updateNote(bytes32 _hash, uint8 _hashFunction, uint8 _size, uint256 _groupId, uint256 _groupIdx) public {
      require(userGroups[msg.sender][_groupIdx] == _groupId, 'GroupId and GroupIndex Mismatch');
      userNotes[msg.sender][_groupIdx] = Multihash(_hash, _hashFunction, _size);
  }

  function getUserGroups(address _user) public view returns (uint[]) {
    return userGroups[_user];
  }

  function getOwnedGroups(address _user) public view returns (uint[]) {
    return userOwnedGroups[_user];
  }

  function getUserNotes(address _user) public view returns (bytes32[] hashes, uint8[] functions, uint8[] sizes) {
    hashes = new bytes32[](userNotes[_user].length);
    functions = new uint8[](userNotes[_user].length);
    sizes = new uint8[](userNotes[_user].length);
    for (uint i; i < userNotes[_user].length; i++) {
      Multihash storage note = userNotes[_user][i];
      hashes[i] = note.hash;
      functions[i] = note.hashFunction;
      sizes[i] = note.size;
    }
    return (hashes, functions, sizes);
  }

}
