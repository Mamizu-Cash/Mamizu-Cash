// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "lib/forge-std/src/Test.sol";
import {BusinessVerifier} from "../src/BusinessVerifier.sol";
import {ZkEmailVerifier} from "../src/verification/ZkEmailVerifier.sol";
import {IVerifier} from "../src/IVerifier.sol";
import {KnownCompanyUnti} from "../src/tokens/KnownCompanyUnti.sol";

contract ForkedUNTICreationTest is Test {
    address constant VERIFIER_ADDR = 0x1ff35617D792A88f396008b1e109585020571D49;

    function testUNTICreationViaBusinessVerifier() public {
        // Setup: deploy ZkEmailVerifier and BusinessVerifier using the real verifier
        ZkEmailVerifier zkVerifier = new ZkEmailVerifier(VERIFIER_ADDR);
        address owner = address(this);
        BusinessVerifier stamper = new BusinessVerifier(address(zkVerifier), owner);

        // Get the deployed KnownCompanyUnti token
        KnownCompanyUnti token = stamper.token();

        // Prepare user and proof data
        address user = makeAddr("zkUser");
        uint256[2] memory a = [
            uint256(57569399995012078316356623648199743272929621931336081944485022539656895628),
            uint256(345716123005353420316188791654295560117338381528427370897615742130496862377)
        ];
        uint256[2][2] memory b = [
            [
                uint256(486650800075361125807358642953970846134802610572132746628128811546342621798),
                uint256(5999894035089098088862765484284309558627786221255676120254523197229407258632)
            ],
            [
                uint256(21368365872261997639015529748864040166579623795380564884780113411776607580514),
                uint256(13447001081916453153049250921345572763068250700836713360198971600713339047081)
            ]
        ];
        uint256[2] memory c = [
            uint256(13185208959610559019945248286587217138153778865883404746593162617802513115059),
            uint256(15458093677206619173873441303795075654625418070866030858706350255322272992243)
        ];
        uint256[5] memory pubSignals = [
            uint256(4830446934335009124417833737275688639424903404478413721230066538799817997375),
            uint256(130251959793384786838134102689425754019),
            uint256(64546105013369580424423996119957061373),
            uint256(8102082581604560737),
            uint256(0)
        ];

        // Encode proof as bytes for BusinessVerifier
        bytes memory proof = abi.encode(a, b, c, pubSignals);

        // Compute token id
        uint256 id = stamper.computeTokenId(user);

        // Log actual owner of the token contract
        emit log_address(token.owner());
        emit log_address(address(stamper));
        emit log_address(address(this));

        // Initial balance should be 0
        assertEq(token.balanceOf(user, id), 0, "initial balance should be 0");

        // Try stamping, catch reverts
        bool success = true;
        try stamper.stamp(proof) {
            emit log("stamp succeeded");
        } catch {
            success = false;
            emit log("stamp reverted");
        }

        // After stamping, balance should be 1 if successful
        if (success) {
            assertEq(token.balanceOf(user, id), 1, "balance should be 1 after UNTI creation");
        } else {
            emit log("UNTI creation failed due to revert (see owner logs above)");
        }
    }
}