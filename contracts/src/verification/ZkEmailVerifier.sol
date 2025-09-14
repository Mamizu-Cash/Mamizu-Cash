// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IEligibilityVerifier} from "./IEligibilityVerifier.sol";
import {Verifier} from "../Verifier.sol";

/// @title ZkEmailVerifier
/// @notice Eligibility verifier using a zk-email SNARK proof.
contract ZkEmailVerifier is IEligibilityVerifier {
    /// @notice Underlying SNARK verifier contract.
    Verifier public immutable verifier;

    /// @param verifierAddress Address of the deployed Verifier contract.
    constructor(address verifierAddress) {
        verifier = Verifier(verifierAddress);
    }

    /// @inheritdoc IEligibilityVerifier
    function isEligible(address account, bytes calldata data) external view override returns (bool) {
        (
            uint256[2] memory a,
            uint256[2][2] memory b,
            uint256[2] memory c,
            uint256[5] memory pubSignals
        ) = abi.decode(data, (uint256[2], uint256[2][2], uint256[2], uint256[5]));

        return verifier.verifyProof(a, b, c, pubSignals);
    }
}