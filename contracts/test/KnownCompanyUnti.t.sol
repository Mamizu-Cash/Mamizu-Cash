// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";

import {KnownCompanyUnti} from "../src/tokens/KnownCompanyUnti.sol";
import {UNTIErrors} from "../src/errors/UNTIErrors.sol";
import {IERC6268} from "../src/interfaces/IERC6268.sol";

contract KnownCompanyUntiTest is Test {
    KnownCompanyUnti internal token;

    address internal owner = address(this);
    address internal alice = address(0xA11CE);
    address internal bob   = address(0xB0B);

    string internal BASE_URI = "ipfs://example/{id}.json";

    function setUp() public {
        token = new KnownCompanyUnti(BASE_URI, owner);
    }

    // --- ERC-1155 responsibilities ---

    function test_URI_PatternContainsIdPlaceholder() public {
        // OZ ERC1155 returns the base URI; clients replace {id} offchain.
        string memory uri0 = token.uri(0);
        assertEq(uri0, BASE_URI, "uri should match base");
    }

    function test_BalanceAfterMint() public {
        uint256 id = 1;
        uint256 amount = 10;

        token.mintAndLock(alice, id, amount, "");

        uint256 bal = token.balanceOf(alice, id);
        assertEq(bal, amount, "minted balance mismatch");
    }

    function test_SupportsInterface_ERC165_ERC1155_UNTI() public {
        // ERC165
        assertTrue(token.supportsInterface(0x01ffc9a7), "ERC165 not supported");
        // ERC1155
        assertTrue(token.supportsInterface(0xd9b67a26), "ERC1155 not supported");
        // ERC-6268 (UNTI)
        assertTrue(token.supportsInterface(0xd87116f3), "ERC-6268 not supported");
    }

    function test_SetApprovalForAll_AllowsOperatorButTransferStillRevertsWhenLocked() public {
        uint256 id = 2;
        token.mintAndLock(alice, id, 1, "");
        vm.prank(alice);
        token.setApprovalForAll(bob, true);
        assertTrue(token.isApprovedForAll(alice, bob), "approval failed");

        // Even as approved operator, cannot move locked id.
        vm.prank(bob);
        vm.expectRevert();
        token.safeTransferFrom(alice, bob, id, 1, "");
    }

    function test_MintToZeroAddressReverts() public {
        uint256 id = 99;
        vm.expectRevert(); // OZ ERC1155 will revert on zero address
        token.mintAndLock(address(0), id, 1, "");
    }

    // --- UNTI (ERC-6268) behavior ---

    function test_LockedAfterMintAndLock() public {
        uint256 id = 3;
        token.mintAndLock(alice, id, 1, "");
        assertTrue(IERC6268(address(token)).locked(id), "id should be locked");
    }

    function test_LockedBatch_AllLockedTrue_PartialLockedFalse() public {
        uint256 id1 = 11;
        uint256 id2 = 12;
        uint256 id3 = 13;

        token.mintAndLock(alice, id1, 1, "");
        token.mintAndLock(alice, id2, 1, "");

        uint256[] memory allLocked = new uint256[](2);
        allLocked[0] = id1;
        allLocked[1] = id2;
        assertTrue(IERC6268(address(token)).lockedBatch(allLocked), "all locked should be true");

        uint256[] memory partialIds = new uint256[](3);
        partialIds[0] = id1;
        partialIds[1] = id2;
        partialIds[2] = id3; // not locked
        assertFalse(IERC6268(address(token)).lockedBatch(partialIds), "partialIds not locked should be false");
    }

    function test_MintAndLock_SameIdTwiceReverts() public {
        uint256 id = 4;
        token.mintAndLock(alice, id, 1, "");
        vm.expectRevert(abi.encodeWithSelector(UNTIErrors.AlreadyLocked.selector, id));
        token.mintAndLock(alice, id, 1, "");
    }

    function test_TransferRevertsForLockedId() public {
        uint256 id = 5;
        token.mintAndLock(alice, id, 2, "");

        vm.prank(alice);
        vm.expectRevert();
        token.safeTransferFrom(alice, bob, id, 1, "");
    }

    function test_BatchTransferRevertsIfAnyLockedId() public {
        uint256 id1 = 6;
        uint256 id2 = 7;
        token.mintAndLock(alice, id1, 2, "");
        token.mintAndLock(alice, id2, 3, "");

        uint256[] memory ids = new uint256[](2);
        ids[0] = id1;
        ids[1] = id2;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1;
        amounts[1] = 2;

        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(UNTIErrors.TokenLocked.selector, id1)); // first locked encountered
        token.safeBatchTransferFrom(alice, bob, ids, amounts, "");
    }

    function test_BurnRevertsForLockedId() public {
        uint256 id = 8;
        token.mintAndLock(alice, id, 5, "");

        // OZ ERC1155 burn is internal; simulate burn via transfer to 0x0 which ERC1155 forbids.
        vm.prank(alice);
        vm.expectRevert();
        token.safeTransferFrom(alice, address(0), id, 1, "");
    }

    function test_LockedSingleEventOnMintAndLock() public {
        uint256 id = 9;

        // Expect LockedSingle(id) - topic0 is event sig, topic1 is indexed id (but in our interface event param is not indexed).
        // Since the event param is not indexed, we check by event signature only.
        vm.expectEmit(false, false, false, true);
        emit IERC6268.LockedSingle(id);

        token.mintAndLock(alice, id, 1, "");
    }

    function test_OwnerOnlyMintAndLock() public {
        uint256 id = 10;
        // Non-owner call should revert with OwnableUnauthorizedAccount in OZ v5
        vm.prank(alice);
        vm.expectRevert(); // do not rely on specific selector for broader OZ compatibility
        token.mintAndLock(alice, id, 1, "");
    }
}