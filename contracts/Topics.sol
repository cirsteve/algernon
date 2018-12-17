pragma solidity ^0.5.0;

import './Multihash.sol';
import './Tags.sol';

/** @title Users. */
contract Topics is Multihash, Tags {
  uint256 topicId;
  struct Topic {
    uint256 id;
    uint256[] tagIds;
    address owner;
    MultiHash content;
  }

  Topic[] topics;
  mapping (address => uint256[]) userTopicIds;

  event TopicCreated(uint256 id, address indexed owner);

  function createTopic(uint256[] memory _tagIds, bytes32 _hash, uint8 _hashFunction, uint8 _size) public {
    MultiHash memory multihash = createMultiHash(_hash, _hashFunction, _size);
    Topic memory topic = Topic(topicId, _tagIds, msg.sender, multihash);
    topics.push(topic);
    userTopicIds[msg.sender].push(topic.id);
    topicId++;
    emit TopicCreated(topic.id, topic.owner);
  }

  function updateTopic(uint256 _id, bytes32 _hash, uint8 _hashFunction, uint8 _size) public {
    Topic storage topic = topics[_id];
    require(topic.owner == msg.sender, 'Topic to update must be owned by sender');
    MultiHash memory multihash = createMultiHash(_hash, _hashFunction, _size);
    topic.content = multihash;
  }

  function addTopicTags(uint256[] memory _ids, uint256 _topicId) public {
    Topic storage topic = topics[_topicId];
    require(topic.owner == msg.sender, 'Topic must be owned by sender to update');
    addTags(_ids, topic.tagIds);
  }

  function removeTopicTag(uint256 _idx, uint256 _topicId) public {
    Topic storage topic = topics[_topicId];
    require(topic.owner == msg.sender, 'Topic must be owned by sender to update');
    removeTag(_idx, topic.tagIds);
  }

  function getUserTopicCount(address _user) public view returns (uint256) {
    return userTopicIds[_user].length;
  }

  function getUserTopicIds(address _user) public view returns (uint256[] memory) {
    return userTopicIds[_user];
  }

  function getTopic(uint256 _id) public view returns (bytes32, uint8, uint8, uint256, address) {
    return (topics[_id].content.hash, topics[_id].content.hashFunction, topics[_id].content.size, topics[_id].id, topics[_id].owner);
  }

  function getTopicTagIds( uint256 _id) public view returns (uint256[] memory) {
    return topics[_id].tagIds;
  }

}
