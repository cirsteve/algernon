pragma solidity ^0.5.0;

import './SafeMath.sol';

/** @title Percent. */
contract Percent {
  using SafeMath for uint;

  function getPercent(uint _share, uint _total, uint _precision) internal pure returns(uint) {
       return  _share.mul(_precision).div(_total);
  }

  function getPercentShare(uint _percent, uint _total, uint _precision) internal pure returns(uint) {
      return   _percent.mul(_total).add(_precision.div(2)).div(_precision);
  }

}
