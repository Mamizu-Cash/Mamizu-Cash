// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IEligibilityVerifier
/// @notice Interface for pluggable eligibility (allowance criteria) used by the stamper.
/// @dev Accepts arbitrary calldata payload to future-proof criteria without changing the interface.
interface IEligibilityVerifier {
    /// @notice Returns whether an account is eligible to receive a stamp.
    /// @param account The account to check.
    /// @param data Arbitrary, forward-compatible verification payload (e.g., Merkle proof, signature, KYC refs).
    /// @return eligible True if the account satisfies the verification criteria.
    function isEligible(address account, bytes calldata data) external view returns (bool eligible);
}