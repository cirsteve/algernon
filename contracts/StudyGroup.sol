pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';

import './Users.sol';


/** @title StudyGroup. */
contract StudyGroup is Users, Pausable{

    struct Group {
      uint256 id;
      uint256 fee;
      uint256 limit;
      uint256 balance;
      Multihash groupData;
      address owner;
      address[] members;
    }

    Group[] public groups;

    event GroupCreated(uint256 id, address owner);
    event GroupMetaDataUpdated(bytes32 hash, uint8 hashFunction, uint8 size);
    event CreditIssued(address user, uint256 amount);
    event BalanceClaimed(address user, uint256 amount);
    event Withdraw(address owner, uint256 amount);

    modifier onlyGroupOwner(uint256 _id) {
      require (msg.sender == groups[_id].owner);
      _;
    }

    function createGroup(bytes32 _hash, uint8 _hashFunction, uint8 _size, uint256 _fee, uint256 _limit) public {
      Multihash memory multihash = createMultihash(_hash, _hashFunction, _size);
      address[] memory members;
      Group memory group = Group(groups.length, _fee, _limit, 0, multihash, msg.sender, members);
      groups.push(group);
      userOwnedGroups[msg.sender].push(group.id);
      emit GroupCreated(group.id, group.owner);
    }

    function enroll(uint256 _id) public payable {
      Group storage group = groups[_id];
      require(msg.value == group.fee, 'Enrollment Fee required');
      require(group.members.length < group.limit);
      userGroups[msg.sender].push(_id);
      group.balance += msg.value;
      group.members.push(msg.sender);

      emit UserEnrolled(msg.sender, _id);
    }

    function updateGroupFee(uint256 _id, uint256 _fee) public onlyGroupOwner(_id) {
      Group storage group = groups[_id];
      group.fee = _fee;
    }

    function updateGroupLimit(uint256 _id, uint256 _limit) public onlyGroupOwner(_id) {
      Group storage group = groups[_id];
      group.limit = _limit;
    }

    function updateGroupData (uint256 _id, bytes32 _hash, uint8 _hashFunction, uint8 _size) public onlyGroupOwner(_id){
      Group storage group = groups[_id];
      Multihash memory multihash = Multihash(_hash, _hashFunction, _size);
      group.groupData = multihash;
    }

    function claimBalance () public {
        uint256 balanceAmt = balances[msg.sender];
        balances[msg.sender] = 0;
        msg.sender.transfer(balanceAmt);

        emit BalanceClaimed(msg.sender, balanceAmt);
    }

    function withdraw (uint _amt) public onlyOwner {
      owner.transfer(_amt);

      emit Withdraw(owner, _amt);
    }

    /** @dev issue credit.
      * @param _amt gwei to credit.
      * @param _recipient recipient of credit.
      */
    function issueCredit(uint256 _id, uint256 _amt, address _recipient) public onlyGroupOwner(_id){
      _recipient.transfer(_amt);

      emit CreditIssued(_recipient, _amt);
    }

    function getGroupMembers (uint256 _id) internal view returns (address[]) {
      return groups[_id].members;
    }

    function getGroupCount() public view returns (uint256) {
      return groups.length;
    }

    function getGroupInfo () public view returns (uint256[] ids, uint256[] fees, uint256[] limits, uint256[] balances, address[] owners) {
      uint256 groupCount = groups.length;
      ids = new uint256[](groupCount);
      fees = new uint256[](groupCount);
      limits = new uint256[](groupCount);
      balances = new uint256[](groupCount);
      owners = new address[](groupCount);

      for (uint i = 0; i < groupCount; i++) {
        Group storage group = groups[i];
        ids[i] = group.id;
        fees[i] = group.fee;
        limits[i] = group.limit;
        balances[i] = group.balance;
        owners[i] = group.owner;
      }

      return (ids, fees, limits, balances, owners);
    }

    function getGroupData () public view returns (uint256[] ids, bytes32[] hashes, uint8[] functions, uint8[] sizes) {
      uint256 groupCount = groups.length;
      ids = new uint256[](groupCount);
      hashes = new bytes32[](groupCount);
      functions = new uint8[](groupCount);
      sizes = new uint8[](groupCount);


      for (uint i = 0; i < groupCount; i++) {
        Group storage group = groups[i];
        ids[i] = group.id;
        hashes[i] = group.groupData.hash;
        functions[i] = group.groupData.hashFunction;
        sizes[i] = group.groupData.size;

      }

      return (ids, hashes, functions, sizes);
    }

    function getGroupInfoUserGroups (address _address) public view returns (uint256[] ids, uint256[] fees, uint256[] limits, uint256[] balances, address[] owners) {
      uint256 groupCount = userGroups[_address].length;
      ids = new uint256[](groupCount);
      fees = new uint256[](groupCount);
      limits = new uint256[](groupCount);
      balances = new uint256[](groupCount);
      owners = new address[](groupCount);

      for (uint i = 0; i < groupCount; i++) {
        Group storage group = groups[userGroups[_address][i]];
        ids[i] = group.id;
        fees[i] = group.fee;
        limits[i] = group.limit;
        balances[i] = group.balance;
        owners[i] = group.owner;
      }

      return (ids, fees, limits, balances, owners);
    }

    function getGroupDataUserGroups (address _address) public view returns (uint256[] ids, bytes32[] hashes, uint8[] functions, uint8[] sizes) {
      uint256 groupCount = userGroups[_address].length;
      ids = new uint256[](groupCount);
      hashes = new bytes32[](groupCount);
      functions = new uint8[](groupCount);
      sizes = new uint8[](groupCount);


      for (uint i = 0; i < groupCount; i++) {
        Group storage group = groups[userGroups[_address][i]];
        ids[i] = group.id;
        hashes[i] = group.groupData.hash;
        functions[i] = group.groupData.hashFunction;
        sizes[i] = group.groupData.size;

      }

      return (ids, hashes, functions, sizes);
    }

    function getGroupInfoUserOwnedGroups (address _address) public view returns (uint256[] ids, uint256[] fees, uint256[] limits, uint256[] balances, address[] owners) {
      uint256 groupCount = userGroups[_address].length;
      ids = new uint256[](groupCount);
      fees = new uint256[](groupCount);
      limits = new uint256[](groupCount);
      balances = new uint256[](groupCount);
      owners = new address[](groupCount);

      for (uint i = 0; i < groupCount; i++) {
        Group storage group = groups[userGroups[_address][i]];
        ids[i] = group.id;
        fees[i] = group.fee;
        limits[i] = group.limit;
        balances[i] = group.balance;
        owners[i] = group.owner;
      }

      return (ids, fees, limits, balances, owners);
    }

    function getGroupDataUserOwnedGroups (address _address) public view returns (uint256[] ids, bytes32[] hashes, uint8[] functions, uint8[] sizes) {
      uint256 groupCount = userGroups[_address].length;
      ids = new uint256[](groupCount);
      hashes = new bytes32[](groupCount);
      functions = new uint8[](groupCount);
      sizes = new uint8[](groupCount);


      for (uint i = 0; i < groupCount; i++) {
        Group storage group = groups[userGroups[_address][i]];
        ids[i] = group.id;
        hashes[i] = group.groupData.hash;
        functions[i] = group.groupData.hashFunction;
        sizes[i] = group.groupData.size;

      }

      return (ids, hashes, functions, sizes);
    }
 }
