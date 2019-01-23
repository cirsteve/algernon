pragma solidity ^0.5.0;


import './Groups.sol';
import './Percent.sol';
import './ERC20.sol';

/** @title Group. */
contract Algernon is Groups, Percent {
    address payable owner;
    address token_0x_address;

    uint PRECISION = 10 ** 5;
    uint OWNER_PERCENT  = 15;
    uint STAKER_PERCENT = 10;
    mapping (address => uint) public tokenBalances;

    constructor (address _tokenAddress) public {
      owner = msg.sender;
      token_0x_address = _tokenAddress;
    }

    function () external {}


    function withdraw (uint _amt) public {
      require(msg.sender == owner);
      owner.transfer(_amt);

      emit Withdraw(owner, _amt);
    }


    //when a user stakes, 15% is given to the topic owner, 10% is distributed among stakers
    //the remaining 75% is staked
    function distributeStake(TagStake storage _tagStake, uint _amt, uint _topicId, address from) internal returns (uint){
      uint ownerShare = getPercentShare(OWNER_PERCENT, _amt, PRECISION);
      uint stakerShare = getPercentShare(STAKER_PERCENT, _amt, PRECISION);
      uint stakedShare = _amt.sub(ownerShare.add(stakerShare));

      tokenBalances[from] -= _amt;
      tokenBalances[topics[_topicId].owner] += ownerShare;


      for (uint i = 0;i < _tagStake.stakeIdxs.length;i++) {
        Stake storage stake = stakes[_tagStake.stakeIdxs[i]];
        tokenBalances[stake.staker] += getPercent(stake.amt, _tagStake.totalStaked, stakerShare);
      }

      return stakedShare;
    }

    function addStake(uint _topicId, uint _tagId, uint _amt) public {
      require(topicIsTagged[_topicId][_tagId], 'Topic must be tagged');
      require(tokenBalances[msg.sender] >= _amt, 'Insufficient token balance');

      TagStake storage tagStake = stakesByTopic[_topicId][_tagId];
      uint stakeAmt = distributeStake(tagStake, _amt, _topicId, msg.sender);
      Stake memory stake = Stake(msg.sender, stakeAmt, _topicId, _tagId);
      stakes.push(stake);
      tagStake.totalStaked += stakeAmt;
      tagStake.stakeIdxs.push(stakes.length-1);
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

      stakesByTopic[stake.topicId][stake.tagId].totalStaked -= _amt;

      emit StakeUpdated(prevAmt, stake.amt, _stakeIdx);

    }

    function removeStake(uint _stakeIdx, uint _tagStakeIdx, uint _userStakeIdx) public {
      Stake storage stake = stakes[_stakeIdx];
      require(stake.staker == msg.sender, 'Stake not owned by sender');
      uint prevAmt = stake.amt;
      stake.amt = 0;
      tokenBalances[msg.sender] += prevAmt;

      uint[] storage tagStakes = stakesByTopic[stake.topicId][stake.tagId].stakeIdxs;
      require(tagStakes[_tagStakeIdx] == _stakeIdx, 'Stake Index and Tag Stake Index mismatch');
      stakesByTopic[stake.topicId][stake.tagId].totalStaked -= prevAmt;
      tagStakes[_tagStakeIdx] = tagStakes[tagStakes.length-1];
      tagStakes.length--;

      uint[] storage userStakes = stakesByUser[msg.sender];
      require(userStakes[_userStakeIdx] == _stakeIdx, 'Stake Index and User Stake Index mismatch');
      userStakes[_userStakeIdx] = userStakes[userStakes.length-1];
      userStakes.length--;

      emit StakeUpdated(prevAmt, 0, _stakeIdx);

    }

    function getContractTokenBalance() public view returns (uint256) {
      return IERC20(token_0x_address).balanceOf(address(this));
    }

    function getAlgernonTokenBalance(address _account) public view returns (uint) {
      return tokenBalances[_account];
    }

    function depositTokens(uint _amt) public {
      uint depositerBalance = IERC20(token_0x_address).balanceOf(msg.sender);
      require(depositerBalance >= _amt, 'Insufficient token balance');

      IERC20(token_0x_address).transferFrom(msg.sender, address(this), _amt);
      tokenBalances[msg.sender] += _amt;
    }

    function withdrawTokens(uint _amt) public {
      require(tokenBalances[msg.sender] >= _amt, 'Insufficient token balance');
      tokenBalances[msg.sender] -= _amt;
      IERC20(token_0x_address).transfer(msg.sender, _amt);

    }
 }
