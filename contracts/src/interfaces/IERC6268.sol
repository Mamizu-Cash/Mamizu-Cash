// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IERC6268 (UNTI) - Untransferability Indicator for ERC-1155
 * @notice Spec reference: docs/erc/erc-6268.md
 *
 * Interface ID (ERC-165): 0xd87116f3
 */
interface IERC6268 {
    /// @notice Either `LockedSingle` or `LockedBatch` MUST emit when the locking status is changed to locked.
    /// @dev If a token is minted and the status is locked, this event should be emitted.
    /// @param _id The identifier for a token.
    event LockedSingle(uint256 _id);

    /// @notice Either `LockedSingle` or `LockedBatch` MUST emit when the locking status is changed to locked.
    /// @dev If a token is minted and the status is locked, this event should be emitted.
    /// @param _ids The list of identifiers for tokens.
    event LockedBatch(uint256[] _ids);

    /// @notice Either `UnlockedSingle` or `UnlockedBatch` MUST emit when the locking status is changed to unlocked.
    /// @dev Declared for spec compatibility; this implementation provides no unlock flow.
    /// @param _id The identifier for a token.
    event UnlockedSingle(uint256 _id);

    /// @notice Either `UnlockedSingle` or `UnlockedBatch` MUST emit when the locking status is changed to unlocked.
    /// @dev Declared for spec compatibility; this implementation provides no unlock flow.
    /// @param _ids The list of identifiers for tokens.
    event UnlockedBatch(uint256[] _ids);

    /// @notice Returns the locking status of the token.
    /// @param _id The identifier for a token.
    function locked(uint256 _id) external view returns (bool);

    /// @notice Returns the aggregated locking status of the multiple tokens.
    /// @dev Returns true only if ALL ids in the list are locked.
    /// @param _ids The list of identifiers for tokens.
    function lockedBatch(uint256[] calldata _ids) external view returns (bool);
}