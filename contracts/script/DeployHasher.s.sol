// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";

contract DeployHasher is Script {
    function run() external {
        // Read the bytecode from Hasher.json
        string memory jsonPath = string.concat(
            vm.projectRoot(),
            "/circuits/build/Hasher.json"
        );
        string memory jsonContent = vm.readFile(jsonPath);

        // Extract bytecode from JSON
        string memory bytecodeStr = vm.parseJson(jsonContent, ".bytecode");
        bytes memory bytecode = vm.parseBytes(bytecodeStr);

        // Deploy the contract
        address hasher;
        assembly {
            hasher := create(0, add(bytecode, 0x20), mload(bytecode))
        }

        require(hasher != address(0), "Deployment failed");

        console.log("Hasher deployed at:", hasher);
        console.log("Bytecode length:", bytecode.length);
    }
}
