// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {IEligibilityVerifier} from "./IEligibilityVerifier.sol";

/// @title AllowlistVerifier
/// @notice Simple, production-grade allowlist-based eligibility verifier.
/// @dev Segregates verification (allowance criteria) from stamping logic.
contract AllowlistVerifier is Ownable, IEligibilityVerifier {
    // -------------------------------------------------------------------------
    // Errors
    // -------------------------------------------------------------------------

    /// @notice Thrown when attempting to use the zero address where prohibited.
    error ZeroAddress();

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    /// @notice Emitted when eligibility status for an account is updated.
    event EligibilityUpdated(address indexed account, bool eligible);

    // -------------------------------------------------------------------------
    // Storage
    // -------------------------------------------------------------------------

    mapping(address => bool) private _eligible;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    /// @param initialOwner Contract owner who manages eligibility.
    constructor(address initialOwner) Ownable(initialOwner) {}

    // -------------------------------------------------------------------------
    // IEligibilityVerifier
    // -------------------------------------------------------------------------

    /// @inheritdoc IEligibilityVerifier
    function isEligible(address account, bytes calldata /*data*/) external view override returns (bool eligible) {
        // `data` ignored in simple allowlist implementation; kept for forward compatibility.
        return _eligible[account];
    }

    // -------------------------------------------------------------------------
    // Admin (Owner)
    // -------------------------------------------------------------------------

    /// @notice Update eligibility for a single account.
    function setEligible(address account, bool eligible_) external onlyOwner {
        if (account == address(0)) revert ZeroAddress();
        _eligible[account] = eligible_;
        emit EligibilityUpdated(account, eligible_);
    }

    /// @notice Batch update eligibility for multiple accounts.
    function setEligibleBatch(address[] calldata accounts, bool eligible_) external onlyOwner {
        uint256 len = accounts.length;
        for (uint256 i = 0; i < len; i++) {
            address a = accounts[i];
            if (a == address(0)) revert ZeroAddress();
            _eligible[a] = eligible_;
            emit EligibilityUpdated(a, eligible_);
        }
    }
}