// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {AlwaysAllow} from "../src/verification/AlwaysAllow.sol";
import {BusinessVerifier} from "../src/BusinessVerifier.sol";

/// @title Deploy BusinessVerifier Contract Script
/// @notice Foundry script to deploy AlwaysAllow and BusinessVerifier contracts
contract DeployBusinessVerifier is Script {
    function run() external {
        // Load deployer private key
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Get deployer address as the initial owner
        address owner = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy AlwaysAllow verifier contract
        AlwaysAllow alwaysAllow = new AlwaysAllow();

        // 2. Deploy BusinessVerifier with AlwaysAllow as the verifier
        BusinessVerifier businessVerifier = new BusinessVerifier(
            address(alwaysAllow),
            owner
        );

        vm.stopBroadcast();

        // Get KnownCompanyUnti token address
        address tokenAddress = address(businessVerifier.token());

        // Log deployment addresses
        console.log("=== Business Verifier System Deployed ===");
        console.log("AlwaysAllow deployed:", address(alwaysAllow));
        console.log("BusinessVerifier deployed:", address(businessVerifier));
        console.log("KnownCompanyUnti deployed:", tokenAddress);
        console.log("Owner address:", owner);
        console.log("Deployer address:", owner);
        console.log("Chain ID:", block.chainid);

        // Log verification
        console.log("\n=== Verification ===");
        console.log("AlwaysAllow.isEligible(owner):", alwaysAllow.isEligible(owner, ""));
        console.log("BusinessVerifier.isEligible(owner):", businessVerifier.isEligible(owner));
    }
}