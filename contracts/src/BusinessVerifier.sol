// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {KnownCompanyUnti} from "./tokens/KnownCompanyUnti.sol";
import {IEligibilityVerifier} from "./verification/IEligibilityVerifier.sol";

/// @title BusinessVerifier - Known-address stamping and UNTI minting orchestrator
/// @notice If msg.sender is allowlisted, this contract (as the token owner) mints-and-locks
///         a single UNTI (ERC-1155) token in the KnownCompanyUnti collection for the caller.
/// @dev Production-grade guardrails:
///      - No token contract modifications (uses external KnownCompanyUnti).
///      - Double-hash token id: keccak256(keccak256(address)).
///      - Enforces single token per address (0 or 1) by checking balance before mint.
///      - Non-reentrant, owner-gated admin, explicit custom errors, and events.
contract BusinessVerifier is Ownable, ReentrancyGuard {
    // -------------------------------------------------------------------------
    // Errors
    // -------------------------------------------------------------------------

    /// @notice Thrown when a caller does not satisfy the verification criteria.
    error NotEligible(address caller);

    /// @notice Thrown when a caller already holds their UNTI token (no double minting).
    error AlreadyStamped(address caller, uint256 tokenId);

    /// @notice Thrown when this contract is not the owner of the KnownCompanyUnti token
    ///         and therefore cannot call its onlyOwner-restricted mint function.
    error NotTokenOwner(address expectedOwner, address actualOwner);

    /// @notice Thrown when attempting to use a zero address where prohibited (e.g., allowlist updates).
    error ZeroAddress();

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    /// @notice Emitted after a successful stamp (mint-and-lock) for an account.
    event Stamped(address indexed account, uint256 indexed tokenId);

    /// @notice Emitted when the KnownCompanyUnti token reference is updated.
    event TokenSet(address indexed token);

    // -------------------------------------------------------------------------
    // Storage
    // -------------------------------------------------------------------------

    /// @dev Reference to the KnownCompanyUnti collection (ERC-1155 with UNTI lock).
    KnownCompanyUnti public immutable token;

    /// @dev External verifier that decides if an account is eligible to stamp.
    IEligibilityVerifier public immutable verifier;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    /// @param _verifier Address of the external eligibility verifier contract.
    /// @param _initialOwner Owner/admin for this stamper; manages no verification state.
    /// @dev This constructor DEPLOYS the tightly-coupled KnownCompanyUnti instance and sets
    ///      this stamper as its owner (via msg.sender in the token's constructor), guaranteeing mint privilege.
    ///      The token base URI is hardcoded inside KnownCompanyUnti.
    constructor(address _verifier, address _initialOwner) Ownable(_initialOwner) {
        if (_verifier == address(0)) revert ZeroAddress();
        verifier = IEligibilityVerifier(_verifier);
        // Deploy token; msg.sender inside KnownCompanyUnti is this contract, so it becomes the owner automatically.
        token = new KnownCompanyUnti();
        emit TokenSet(address(token));
    }

    // -------------------------------------------------------------------------
    // Public View
    // -------------------------------------------------------------------------

    /// @notice Returns whether an account is eligible to stamp per the external verifier.
    /// @dev Convenience helper that passes empty bytes to the verifier for criteria that need no payload.
    function isEligible(address account) public view returns (bool) {
        return verifier.isEligible(account, bytes(""));
    }

    /// @notice Returns whether an account is eligible with an arbitrary verification payload.
    /// @param account The account to check.
    /// @param data    Arbitrary, forward-compatible verification payload (e.g., Merkle proof, signature, refs).
    function isEligible(address account, bytes calldata data) public view returns (bool) {
        return verifier.isEligible(account, data);
    }

    /// @notice Computes the deterministic UNTI token id for an account.
    /// @dev Token id = uint256(keccak256(keccak256(abi.encodePacked(account)))).
    function computeTokenId(address account) public pure returns (uint256) {
        bytes32 h1 = keccak256(abi.encodePacked(account));
        bytes32 h2 = keccak256(abi.encodePacked(h1));
        return uint256(h2);
    }

    // -------------------------------------------------------------------------
    // Admin (Owner) Functions
    // -------------------------------------------------------------------------
    // Intentionally empty: verification logic/state is fully segregated into a separate contract.

    // -------------------------------------------------------------------------
    // Stamping Flow
    // -------------------------------------------------------------------------

    /// @notice If caller is eligible and hasn't been stamped yet, mint-and-lock their UNTI token.
    /// @dev Reverts if:
    ///      - Caller is not eligible per the external verifier.
    ///      - This contract is not the current owner of the KnownCompanyUnti token.
    ///      - Caller already holds their unique UNTI token (no double minting).
    /// @custom:compat Retains zero-arg entrypoint for existing frontends; forwards with empty payload.
    function stamp() external nonReentrant {
        _stamp(msg.sender, bytes(""));
    }

    /// @notice Stamping entrypoint with an arbitrary verification payload.
    /// @param data Arbitrary, forward-compatible payload for eligibility verification (e.g., proofs, signatures).
    function stamp(bytes calldata data) external nonReentrant {
        _stamp(msg.sender, data);
    }

    /// @dev Internal stamping routine shared by both entrypoints.
    function _stamp(address caller, bytes memory data) internal {
        // 1) Verification gate
        if (!verifier.isEligible(caller, data)) revert NotEligible(caller);

        // 2) Ownership gate (this contract must be the owner of the token contract)
        address actualOwner = token.owner();
        if (actualOwner != address(this)) {
            revert NotTokenOwner(address(this), actualOwner);
        }

        // 3) Single-token-per-address rule
        uint256 id = computeTokenId(caller);
        if (token.balanceOf(caller, id) != 0) {
            revert AlreadyStamped(caller, id);
        }

        // 4) Mint-and-lock exactly 1 unit for the caller
        //    mintAndLock is onlyOwner-restricted on the token; this contract is owner if step #2 passes.
        token.mintAndLock(caller, id, 1, "");

        emit Stamped(caller, id);
    }
}