// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1155} from "lib/openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {ERC6268Lockable} from "../extensions/ERC6268Lockable.sol";

/// @title KnownCompanyUnti - ERC-1155 token with ERC-6268 (UNTI) non-transferability indicator
/// @notice Owner can mint-and-lock an id to a recipient once. Locked ids are forever non-transferable.
/// @dev Uses OpenZeppelin ERC1155 and Ownable. Enforces lock via ERC1155 v5 hook _update.
contract KnownCompanyUnti is ERC1155, Ownable, ERC6268Lockable {
    /// @notice Deploy with fixed base URI and set initial owner to msg.sender.
    /// @dev Base URI is fixed to "https://assets.aoki.app/meta.json".
    constructor()
        ERC1155("https://assets.aoki.app/meta.json")
        Ownable(msg.sender)
    {}

    /// @notice Mint `amount` of `id` to `to` and lock the id forever (non-transferable)
    /// @dev Reverts if the id has already been locked (no re-minting / no relock/unlock features)
    /// @param to Recipient address
    /// @param id Token id to mint and lock
    /// @param amount Amount to mint
    /// @param data Arbitrary data forwarded to receiver hooks
    function mintAndLock(address to, uint256 id, uint256 amount, bytes memory data) external onlyOwner {
        // Lock forever (reverts if already locked)
        _lockId(id);
        // Mint to recipient
        _mint(to, id, amount, data);
    }

    /// @inheritdoc ERC1155
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC6268Lockable) returns (bool) {
        // Explicitly combine support from ERC1155 and ERC6268Lockable to avoid linearization ordering pitfalls.
        return ERC1155.supportsInterface(interfaceId) || ERC6268Lockable.supportsInterface(interfaceId);
    }

    /// @dev Block any transfer (or burn) of locked ids. Minting (from == address(0)) is allowed.
    /// OpenZeppelin v5 uses _update as the transfer hook for ERC1155.
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal virtual override {
        // Revert if moving locked ids in any non-mint context
        _revertIfLocked(from, ids);
        // Continue ERC1155 flow
        super._update(from, to, ids, amounts);
    }
}