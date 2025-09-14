pragma solidity ^0.8.20;

import {IEligibilityVerifier} from "./IEligibilityVerifier.sol";

contract AlwaysAllow is IEligibilityVerifier {
  function isEligible(address account, bytes calldata data) external view returns (bool) {
    return true;
  }
}