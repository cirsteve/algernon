pragma solidity ^0.5.0;


import './Groups.sol';
import './Percent.sol';
import './ERC20.sol';

/** @title Group. */
contract Algernon is Groups, Percent {
    address payable owner;
    address token_0x_address = 0x0295e71F699d069450a88fB046f75d83F7606651;

    uint PRECISION = 10 ** 5;
    uint OWNER_PERCENT  = 15 * PRECISION;
    uint STAKER_PERCENT = 10 * PRECISION;

    mapping (address => uint) tokenBalances;

    constructor () public {
      owner = msg.sender;
    }

    function () external {}


    function withdraw (uint _amt) public {
      require(msg.sender == owner);
      owner.transfer(_amt);

      emit Withdraw(owner, _amt);
    }


    //when a user stakes, 15% is given to the topic owner, 10% is distributed among stakers
    //the remaining 75% is staked
    function distributeStake(TagStake storage _tagStake, uint _amt, address from) internal returns (uint){
      uint ownerShare = getPercentShare(OWNER_PERCENT, _amt, PRECISION);
      uint stakerShare = getPercentShare(STAKER_PERCENT, _amt, PRECISION);
      uint stakedShare = _amt.sub(ownerShare.add(stakerShare));

      tokenBalances[from] -= _amt;
      tokenBalances[topics[topicId].owner] += ownerShare;


      for (uint i = 0;i < _tagStake.stakeIdxs.length;i++) {
        Stake storage stake = stakes[_tagStake.stakeIdxs[i]];
        uint stakerPercent = getPercent(stake.amt, _tagStake.totalStaked, PRECISION);
        tokenBalances[stake.staker] += getPercentShare(stakerPercent, stakerShare, PRECISION);
      }

      return stakedShare;
    }

    function addStake(uint _topicId, uint _tagId, uint _amt) public {
      require(topicIsTagged[_topicId][_tagId], 'Topic must be tagged');
      require(tokenBalances[msg.sender] >= _amt, 'Insufficient token balance');

      TagStake storage tagStake = stakesByTopic[_topicId][_tagId];
      uint stakeAmt = distributeStake(tagStake, _amt, msg.sender);
      Stake memory stake = Stake(msg.sender, stakeAmt, _topicId, _tagId);
      stakes.push(stake);
      tagStake.stakeIdxs.push(stakes.length-1);
      tagStake.totalStaked += stakeAmt;
      stakesByUser[msg.sender].push(stakes.length-1);

      emit StakeAdded(msg.sender, _amt, stakeAmt, _topicId, _tagId);

    }

    function increaseStake(uint _stakeIdx, uint _amt) public {
      Stake storage stake = stakes[_stakeIdx];
      require(stake.staker == msg.sender, 'Stake not owned by sender');
      require(tokenBalances[msg.sender] >= _amt, 'Insufficient token balance');

      tokenBalances[msg.sender] -= _amt;
      uint prevAmt = stake.amt;
      stake.amt += _amt;
      stakesByTopic[stake.topicId][stake.tagId].totalStaked += _amt;

      emit StakeUpdated(prevAmt, stake.amt, _stakeIdx);
    }

    function reduceStake(uint _stakeIdx, uint _amt) public {
      Stake storage stake = stakes[_stakeIdx];
      require(stake.staker == msg.sender, 'Stake not owned by sender');
      uint prevAmt = stake.amt;
      stake.amt -= _amt;
      tokenBalances[msg.sender] += _amt;

      emit StakeUpdated(prevAmt, stake.amt, _stakeIdx);

    }

    function getContractTokenBalance() public view returns (uint256) {
      return IERC20(token_0x_address).balanceOf(address(this));
    }

 }
