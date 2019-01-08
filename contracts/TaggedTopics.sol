pragma solidity ^0.5.0;

import './Topics.sol';

/** @title TopicTags. */
contract TaggedTopics is Topics {

  struct Stake {
    address staker;
    uint amt;
    uint topicId;
    uint tagId;
  }

  struct TagStake {
    uint totalStaked;
    uint[] stakeIdxs;
  }

  Stake[] stakes;
  //topicId -> tagId -> stakeIdx
  mapping (uint => mapping (uint => TagStake)) stakesByTopic;
  mapping (address => uint[]) stakesByUser;

  mapping (uint => uint[]) topicsByTag;
  //topicId -> tagId -> bool
  mapping (uint => mapping (uint => bool)) topicIsTagged;

  event TopicTagUpdated(uint topicId, uint tagId, bool added);
  event StakeAdded(address staker, uint toalAmt, uint stakeAmt, uint topicId, uint tagId);
  event StakeUpdated(uint prevAmt, uint amt, uint stakeIdx);

  function updateTopicTags(uint _topicId, uint _topicIdx, uint[] memory _addIds, uint[] memory _removeIds, uint[] memory _removeIdxs) public {
    for (uint i=0; i < _removeIds.length;i++) {
      removeTagTopic(_topicId, _topicIdx, _removeIds[i], _removeIdxs[i]);
    }

    for (uint i = 0; i<_addIds.length;i++) {
      addTagTopic(_topicId, _addIds[i]);
    }
  }


  function addTagTopic(uint _topicId, uint _tagId) internal {
    require(topicIsTagged[_topicId][_tagId] == false, 'Topic is already tagged');
    require(topics[_topicId].owner == msg.sender, 'Only topic owner can update tags');

    topicIsTagged[_topicId][_tagId] = true;
    topicsByTag[_tagId].push(_topicId);
    topics[_topicId].tagIds.push(_tagId);

    emit TopicTagUpdated(_topicId, _tagId, true);
  }


  function removeTagTopic(uint _topicId, uint _topicIdx, uint _tagId, uint _tagIdx) internal {
    require(topicIsTagged[_topicId][_tagId] == true, 'Topic is not tagged');
    require(topics[_topicId].owner == msg.sender, 'Only topic owner can update tags');
    require(topics[_topicId].tagIds[_tagIdx] ==_tagId, 'Tag id and index mismatch');
    require(topicsByTag[_tagId][_topicIdx] ==_topicId, 'Topic id and index mismatch');

    topicIsTagged[_topicId][_tagId] = false;

    topicsByTag[_tagId][_topicIdx] = topicsByTag[_tagId][topicsByTag[_tagId].length-1];
    topicsByTag[_tagId].length--;

    emit TopicTagUpdated(_topicId, _tagId, false);
  }


  function getTagTopicIds(uint _tagId) public view returns (uint[] memory) {
    return topicsByTag[_tagId];
  }

  function getTagStake(uint _topicId, uint _tagId) public view returns (uint) {
    return stakesByTopic[_topicId][_tagId].totalStaked;
  }

  function getTagStakes(uint _topicId, uint _tagId) public view returns (address[] memory stakers, uint[] memory amts) {
    uint stakesLength = stakesByTopic[_topicId][_tagId].stakeIdxs.length;
    stakers = new address[](stakesLength);
    amts = new uint256[](stakesLength);
    for (uint i = 0;i < stakesLength;i++) {
      Stake storage stake = stakes[stakesByTopic[_topicId][_tagId].stakeIdxs[i]];
      stakers[i] = stake.staker;
      amts[i] = stake.amt;
    }
    return (stakers, amts);
  }

}
