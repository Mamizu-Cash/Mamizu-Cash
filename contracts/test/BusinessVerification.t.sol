// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "lib/forge-std/src/Test.sol";
import {BusinessVerifier} from "../src/BusinessVerifier.sol";
import {KnownCompanyUnti} from "../src/tokens/KnownCompanyUnti.sol";
import {ZkEmailVerifier} from "../src/verification/ZkEmailVerifier.sol";
import {IVerifier} from "../src/IVerifier.sol";
import "lib/forge-std/src/console.sol";

// MockVerifier always returns true for verifyProof
contract MockVerifier is IVerifier {
    function verifyProof(
        uint256[2] calldata,
        uint256[2][2] calldata,
        uint256[2] calldata,
        uint256[5] calldata
    ) external pure override returns (bool) {
        return true;
    }
}

contract BusinessVerificationTest is Test {
    // Helper: mirror the stamper's token id computation
    function _computeId(address account) internal pure returns (uint256) {
        bytes32 h1 = keccak256(abi.encodePacked(account));
        bytes32 h2 = keccak256(abi.encodePacked(h1));
        return uint256(h2);
    }

    function deployVerifier() internal returns (IVerifier) {
        // Deploy MockVerifier contract instead of inline bytecode
        MockVerifier verifier = new MockVerifier();
        console.log("MockVerifier deployed at:", address(verifier));
        return verifier;
    }

    function testComputeTokenIdConsistency() public {
        address user = makeAddr("zkUser");
        IVerifier verifier = deployVerifier();
        ZkEmailVerifier zkVerifier = new ZkEmailVerifier(address(verifier));
        BusinessVerifier stamper = new BusinessVerifier(address(zkVerifier), address(this));
        uint256 localId = _computeId(user);
        uint256 stamperId = stamper.computeTokenId(user);
        assertEq(localId, stamperId, "id computation should match");
    }

    function testZkProofStamping() public {
        // Deploy Verifier contract
        IVerifier verifier = deployVerifier();  

        // Deploy ZkEmailVerifier with Verifier address
        ZkEmailVerifier zkVerifier = new ZkEmailVerifier(address(verifier));

        // Deploy BusinessVerifier with ZkEmailVerifier
        BusinessVerifier stamper = new BusinessVerifier(address(zkVerifier), address(this));

        // Reference the deployed token instance
        KnownCompanyUnti token = stamper.token();

        // Prepare user
        address user = makeAddr("zkUser");

        // Hardcoded proof data from contracts/fixtures/proof.json
        uint256[2] memory a = [
            uint256(57569399995012078316356623648199743272929621931336081944485022539656895628),
            uint256(345716123005353420316188791654295560117338381528427370897615742130496862377)
        ];
        uint256[2][2] memory b = [
            [
                486650800075361125807358642953970846134802610572132746628128811546342621798,
                5999894035089098088862765484284309558627786221255676120254523197229407258632
            ],
            [
                21368365872261997639015529748864040166579623795380564884780113411776607580514,
                13447001081916453153049250921345572763068250700836713360198971600713339047081
            ]
        ];
        uint256[2] memory c = [
            13185208959610559019945248286587217138153778865883404746593162617802513115059,
            15458093677206619173873441303795075654625418070866030858706350255322272992243
        ];
        uint256[5] memory pubSignals = [
            4830446934335009124417833737275688639424903404478413721230066538799817997375,
            130251959793384786838134102689425754019,
            64546105013369580424423996119957061373,
            8102082581604560737,
            0
        ];

        // Encode proof as bytes
        bytes memory proof = abi.encode(a, b, c, pubSignals);

        // Compute token id
        uint256 id = stamper.computeTokenId(user);

        // Initial balance should be 0
        assertEq(token.balanceOf(user, id), 0, "initial balance should be 0");

        // Call stamp with proof as user
        vm.prank(user);
        stamper.stamp(proof);

        // After stamping, balance should be 1
        assertEq(token.balanceOf(user, id), 1, "balance should be 1 after zk proof stamp");
    }
}