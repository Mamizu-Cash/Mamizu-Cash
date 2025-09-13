// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC6268} from "../interfaces/IERC6268.sol";
import {UNTIErrors} from "../errors/UNTIErrors.sol";

/// @title ERC6268Lockable - Abstract lock mechanism for ERC-1155 tokens per id
/// @notice Provides per-id lock state, UNTI (ERC-6268) events, and helper checks.
/// @dev Does not assume a specific token implementation; integrate into an ERC1155 token.
abstract contract ERC6268Lockable is IERC6268 {
    using UNTIErrors for *;

    // token id => locked
    mapping(uint256 => bool) internal _locked;

    /// @notice INTERNAL: lock a token id forever, emitting LockedSingle.
    /// @dev Reverts if already locked.
    function _lockId(uint256 id) internal {
        if (_locked[id]) {
            revert UNTIErrors.AlreadyLocked(id);
        }
        _locked[id] = true;
        emit LockedSingle(id);
    }

    /// @notice REVERT helper: block any non-mint movement of locked ids.
    /// @param from The token source; if zero, it's mint and allowed by this check.
    /// @param ids The list of token ids being moved.
    function _revertIfLocked(address from, uint256[] memory ids) internal view {
        if (from == address(0)) return; // mint path
        for (uint256 i = 0; i < ids.length; i++) {
            if (_locked[ids[i]]) {
                // Revert on the first locked id encountered
                revert UNTIErrors.TokenLocked(ids[i]);
            }
        }
    }

    // ===== IERC6268 view API =====

    function locked(uint256 _id) external view override returns (bool) {
        return _locked[_id];
    }

    function lockedBatch(uint256[] calldata _ids) external view override returns (bool) {
        for (uint256 i = 0; i < _ids.length; i++) {
            if (!_locked[_ids[i]]) return false;
        }
        return true;
    }

    /// @notice ERC165 support for IERC6268 (0xd87116f3).
    /// @dev Compose this with the parent token's supportsInterface in the final contract.
    function supportsInterface(bytes4 interfaceId) public view virtual returns (bool) {
        // 0xd87116f3 per docs/erc/erc-6268.md
        return interfaceId == 0xd87116f3;
    }
}