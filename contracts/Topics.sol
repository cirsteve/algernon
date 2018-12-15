pragma solidity ^0.5.0;

import './Multihash.sol';

/** @title Users. */
contract Topics is Multihash {
  uint256 topicId;
  struct Topic {
    uint256 id;
    MultiHash content;
  }
  mapping (address => Topic[]) userTopics;

  function addTopic(bytes32 _hash, uint8 _hashFunction, uint8 _size) public {
    MultiHash memory multihash = createMultiHash(_hash, _hashFunction, _size);
    Topic memory topic = Topic(topicId, multihash);
    userTopics[msg.sender].push(topic);
    topicId++;
  }

  function updateTopic(uint256 _id, uint256 _idx, bytes32 _hash, uint8 _hashFunction, uint8 _size) public {
    Topic storage topic = userTopics[msg.sender][_idx];
    require(topic.id == _id, 'Id and Index Mismatch');
    MultiHash memory multihash = createMultiHash(_hash, _hashFunction, _size);
    topic.content = multihash;
  }

  function getTopicCount(address _user) public view returns (uint256) {
    return userTopics[_user].length;
  }

  function getTopic(address _user, uint256 _idx) public view returns (bytes32, uint8, uint8) {
    return (userTopics[_user][_idx].content.hash, userTopics[_user][_idx].content.hashFunction, userTopics[_user][_idx].content.size);
  }

}
