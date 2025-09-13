// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";

import {BusinessVerifier} from "../src/BusinessVerifier.sol";
import {IEligibilityVerifier} from "../src/verification/IEligibilityVerifier.sol";
import {AllowlistVerifier} from "../src/verification/AllowlistVerifier.sol";
import {KnownCompanyUnti} from "../src/tokens/KnownCompanyUnti.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract BusinessVerificationTest is Test {
    // Actors
    address internal owner;
    address internal user;
    address internal user2;
    address internal attacker;

    // System under test
    AllowlistVerifier internal eligibility;
    BusinessVerifier internal stamper;
    KnownCompanyUnti internal token;

    function setUp() public {
        owner = makeAddr("owner");
        user = makeAddr("user");
        user2 = makeAddr("user2");
        attacker = makeAddr("attacker");

        // Deploy verifier with owner as admin
        eligibility = new AllowlistVerifier(owner);

        // Deploy stamper; it internally deploys the token with a fixed base URI and becomes its owner
        // Base URI is hardcoded inside BusinessVerifier to "https://assets.aoki.app/meta.json"
        stamper = new BusinessVerifier(address(eligibility), owner);

        // Reference the deployed token instance
        token = stamper.token();

        // Label for better traces
        vm.label(address(eligibility), "AllowlistVerifier");
        vm.label(address(stamper), "BusinessVerifier");
        vm.label(address(token), "KnownCompanyUnti");
        vm.label(owner, "Owner");
        vm.label(user, "User");
        vm.label(user2, "User2");
        vm.label(attacker, "Attacker");
    }

    // Helper: mirror the stamper's token id computation
    function _computeId(address account) internal pure returns (uint256) {
        bytes32 h1 = keccak256(abi.encodePacked(account));
        bytes32 h2 = keccak256(abi.encodePacked(h1));
        return uint256(h2);
    }

    function testDeploymentAndOwnership() public {
        // Stamper must own the token it deployed
        assertEq(token.owner(), address(stamper), "stamper should own token");

        // The configured token address should be non-zero
        assertTrue(address(token) != address(0), "token address should be set");
    }

    function testEligibilityAndStamp_zeroArg() public {
        uint256 id = _computeId(user);
        assertEq(token.balanceOf(user, id), 0, "initial balance should be 0");

        // Before eligible -> reverts
        vm.prank(user);
        vm.expectRevert(abi.encodeWithSelector(BusinessVerifier.NotEligible.selector, user));
        stamper.stamp();

        // Mark eligible and stamp
        vm.prank(owner);
        eligibility.setEligible(user, true);

        vm.prank(user);
        stamper.stamp();

        assertEq(token.balanceOf(user, id), 1, "balance should be 1 after stamp");

        // Double stamping reverts
        vm.prank(user);
        vm.expectRevert(abi.encodeWithSelector(BusinessVerifier.AlreadyStamped.selector, user, id));
        stamper.stamp();
    }

    function testEligibilityAndStamp_withDataOverload() public {
        uint256 id = _computeId(user2);
        assertEq(token.balanceOf(user2, id), 0, "initial balance should be 0");

        // Mark eligible (simple allowlist ignores data)
        vm.prank(owner);
        eligibility.setEligible(user2, true);

        bytes memory payload = hex"";
        vm.prank(user2);
        stamper.stamp(payload);

        assertEq(token.balanceOf(user2, id), 1, "balance should be 1 after stamp (overload)");
    }

    function testOnlyVerifierOwnerCanSetEligibility() public {
        // Non-owner cannot update eligibility on the verifier
        vm.prank(attacker);
        vm.expectRevert(
            abi.encodeWithSelector(
                Ownable.OwnableUnauthorizedAccount.selector,
                attacker
            )
        );
        eligibility.setEligible(user, true);

        // Owner can update eligibility
        vm.prank(owner);
        eligibility.setEligible(user, true);
        assertTrue(eligibility.isEligible(user, ""), "user should be eligible now");
    }

    function testTokenOnlyOwnerCanMintDirectly() public {
        // Attacker tries to mint directly on the token (should fail due to onlyOwner)
        uint256 id = _computeId(attacker);
        vm.prank(attacker);
        vm.expectRevert(
            abi.encodeWithSelector(
                Ownable.OwnableUnauthorizedAccount.selector,
                attacker
            )
        );
        token.mintAndLock(attacker, id, 1, "");
    }

    function testStampRevertsWhenStamperIsNotTokenOwner() public {
        // Make user eligible first
        vm.prank(owner);
        eligibility.setEligible(user, true);

        // Transfer token ownership away from stamper by pranking as the stamper (the token's current owner)
        address newOwner = makeAddr("newOwner");
        vm.prank(address(stamper));
        token.transferOwnership(newOwner);

        // Now stamping should revert with NotTokenOwner
        vm.prank(user);
        vm.expectRevert(
            abi.encodeWithSelector(
                BusinessVerifier.NotTokenOwner.selector,
                address(stamper),
                newOwner
            )
        );
        stamper.stamp();
    }

    function testComputeTokenIdConsistency() public view {
        // Verify the test-side id calculation matches the stamper's public helper
        uint256 localId = _computeId(user);
        uint256 stamperId = stamper.computeTokenId(user);
        assertEq(localId, stamperId, "id computation should match");
    }
}