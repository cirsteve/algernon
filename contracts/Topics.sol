pragma solidity ^0.5.0;

import './Multihash.sol';
import './Tags.sol';

/** @title Users. */
contract Topics is Multihash, Tags {
  uint256 topicId;
  uint256 privateTopicId;

  struct Topic {
    uint256 id;
    uint[] tagIds;
    address owner;
    MultiHash content;
  }

  Topic[] topics;
  Topic[] privateTopics;
  mapping (address => uint256[]) userTopicIds;
  mapping (address => uint256[]) userPrivateTopicIds;

  event TopicCreated(uint256 id, address indexed owner);

  function createUserTopic(uint256[] memory _tagIds, MultiHash memory _multiHash, address _user) internal returns (uint256) {
    Topic memory topic = Topic(topicId, _tagIds, _user, _multiHash);
    topics.push(topic);
    userTopicIds[msg.sender].push(topic.id);
    topicId++;
    emit TopicCreated(topic.id, topic.owner);

    return topic.id;
  }

  function createPrivateUserTopic(uint256[] memory _tagIds, MultiHash memory _multiHash, address _user) internal returns (uint256) {
    Topic memory topic = Topic(privateTopicId, _tagIds, _user, _multiHash);
    privateTopics.push(topic);
    userPrivateTopicIds[msg.sender].push(topic.id);
    privateTopicId++;
    emit TopicCreated(topic.id, topic.owner);

    return topic.id;
  }

  function createTopic(uint256[] memory _tagIds, bytes32 _hash, uint8 _hashFunction, uint8 _size) public {
    MultiHash memory multihash = createMultiHash(_hash, _hashFunction, _size);
    createUserTopic(_tagIds, multihash, msg.sender);
  }

  function createPrivateTopic(uint256[] memory _tagIds, bytes32 _hash, uint8 _hashFunction, uint8 _size) public {
    MultiHash memory multihash = createMultiHash(_hash, _hashFunction, _size);
    createPrivateUserTopic(_tagIds, multihash, msg.sender);
  }

  function updateTopic(uint256 _id, bytes32 _hash, uint8 _hashFunction, uint8 _size) public {
    Topic storage topic = topics[_id];
    require(topic.owner == msg.sender, 'Topic to update must be owned by sender');
    MultiHash memory multihash = createMultiHash(_hash, _hashFunction, _size);
    topic.content = multihash;
  }

  function updatePrivateTopic(uint256 _id, bytes32 _hash, uint8 _hashFunction, uint8 _size) public {
    Topic storage topic = privateTopics[_id];
    require(topic.owner == msg.sender, 'Topic to update must be owned by sender');
    MultiHash memory multihash = createMultiHash(_hash, _hashFunction, _size);
    topic.content = multihash;
  }

  function updatePrivateTopicTags( uint256[] memory _tagIds, uint256 _topicId) public {
    Topic storage topic = privateTopics[_topicId];
    require(topic.owner == msg.sender);
    topic.tagIds = _tagIds;
  }

  function getTopicCount() public view returns (uint256) {
    return topics.length;
  }

  function getUserTopicCount(address _user) public view returns (uint256) {
    return userTopicIds[_user].length;
  }

  function getUserPrivateTopicCount(address _user) public view returns (uint256) {
    return userPrivateTopicIds[_user].length;
  }

  function getUserTopicIds(address _user) public view returns (uint256[] memory) {
    return userTopicIds[_user];
  }

  function getUserPrivateTopicIds() public view returns (uint256[] memory) {
    return userPrivateTopicIds[msg.sender];
  }

  function getTopicInfo(Topic storage _topic) internal view returns (bytes32, uint8, uint8, uint256, address) {
    return (_topic.content.hash, _topic.content.hashFunction, _topic.content.size, _topic.id, _topic.owner);
  }

  function getTopic(uint256 _id) public view returns (bytes32, uint8, uint8, uint256, address) {
    return getTopicInfo(topics[_id]);
  }

  function getPrivateTopic(uint256 _id) public view returns (bytes32, uint8, uint8, uint256, address) {
    require(msg.sender == privateTopics[_id].owner, 'Must own private topics to view');
    return getTopicInfo(privateTopics[_id]);
  }

  function getPrivateTopicTagIds( uint256 _id) public view returns (uint256[] memory) {
    require(msg.sender == privateTopics[_id].owner, 'Must own private topics to view');
    return privateTopics[_id].tagIds;
  }

}
