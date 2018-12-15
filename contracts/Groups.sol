pragma solidity ^0.5.0;


import './Topics.sol';


/** @title Group. */
contract Groups is Topics{
    address payable owner;

    struct Group {
      uint256 id;
      uint256 fee;
      uint256 limit;
      uint256 balance;
      MultiHash data;
      address owner;
      address[] members;
    }

    Group[] groups;
    mapping (address => uint256[]) userGroups;
    mapping (address => uint256[]) userOwnedGroups;
    mapping (address => uint256) userBalances;
    mapping (address => mapping (uint256 => MultiHash)) userGroupNotes;

    event UserEnrolled(address user, uint256 _id);
    event GroupCreated(uint256 id, address owner);
    event GroupMetaDataUpdated(bytes32 hash, uint8 hashFunction, uint8 size);
    event CreditIssued(address user, uint256 amount);
    event BalanceClaimed(address user, uint256 amount);
    event Withdraw(address owner, uint256 amount);

    modifier onlyGroupOwner(uint256 _id) {
      require (msg.sender == groups[_id].owner);
      _;
    }

    constructor () public {
      owner = msg.sender;
    }

    function () external {}

    function createGroup(bytes32 _hash, uint8 _hashFunction, uint8 _size, uint256 _fee, uint256 _limit) public {
      MultiHash memory multihash = createMultiHash(_hash, _hashFunction, _size);
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
      MultiHash memory multihash = MultiHash(_hash, _hashFunction, _size);
      group.data = multihash;
    }

    function updateGroupNote (uint256 _id, bytes32 _hash, uint8 _hashFunction, uint8 _size) public {
      MultiHash memory multihash = MultiHash(_hash, _hashFunction, _size);
      userGroupNotes[msg.sender][_id] = multihash;
    }

    function claimBalance () public {
        uint256 balanceAmt = userBalances[msg.sender];
        userBalances[msg.sender] = 0;
        msg.sender.transfer(balanceAmt);

        emit BalanceClaimed(msg.sender, balanceAmt);
    }

    function withdraw (uint _amt) public {
      require(msg.sender == owner);
      owner.transfer(_amt);

      emit Withdraw(owner, _amt);
    }

    /** @dev issue credit.
      * @param _amt gwei to credit.
      * @param _recipient recipient of credit.
      */
    function issueCredit(uint256 _id, uint256 _amt, address payable _recipient) public onlyGroupOwner(_id){
      _recipient.transfer(_amt);

      emit CreditIssued(_recipient, _amt);
    }

    function getGroupCount() public view returns (uint256) {
      return groups.length;
    }

    function getGroup(uint256 _id) public view returns (uint256, uint256, uint256, uint256, address, bytes32, uint8, uint8) {
      Group storage group = groups[_id];
      return (group.id, group.fee, group.limit, group.balance, group.owner, group.data.hash, group.data.hashFunction, group.data.size);
    }

    function getGroupMembers (uint256 _id) public view returns (address[] memory) {
      return groups[_id].members;
    }

    function getUserOwnedGroupIds (address _user) public view returns (uint256[] memory) {
      return userOwnedGroups[_user];
    }

    function getUserGroupIds (address _user) public view returns (uint256[] memory) {
      return userGroups[_user];
    }

    function getUserNote (address _user, uint256 _id) public view returns (bytes32, uint8, uint8) {
      MultiHash storage note = userGroupNotes[_user][_id];
      return (note.hash, note.hashFunction, note.size);
    }

 }
