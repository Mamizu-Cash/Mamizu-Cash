// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title UNTI (ERC-6268) Custom Errors
/// @notice Gas-efficient, descriptive errors for the UNTI system.
library UNTIErrors {
    /// @notice Thrown when attempting to mint-and-lock an id that is already locked.
    /// @param id The token id that is already locked.
    error AlreadyLocked(uint256 id);

    /// @notice Thrown when attempting to transfer/burn a locked token id.
    /// @param id The token id that is locked (non-transferable).
    error TokenLocked(uint256 id);
}