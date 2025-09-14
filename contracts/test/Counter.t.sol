// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";

/// @title Counter Contract Tests
/// @notice Unit tests for the Counter contract
contract CounterTest is Test {
    Counter public counter;

    /// @notice Set up the test environment
    function setUp() public {
        counter = new Counter();
    }

    /// @notice Test initial state
    function test_InitialCount() public view {
        assertEq(counter.count(), 0, "Initial count should be 0");
        assertEq(counter.getCount(), 0, "getCount should return 0");
    }

    /// @notice Test increment functionality
    function test_Increment() public {
        counter.increment();
        assertEq(counter.count(), 1, "Count should be 1 after increment");

        counter.increment();
        assertEq(counter.count(), 2, "Count should be 2 after second increment");
    }

    /// @notice Test decrement functionality
    function test_Decrement() public {
        // First increment to have something to decrement
        counter.increment();
        counter.increment();
        assertEq(counter.count(), 2, "Count should be 2 after increments");

        counter.decrement();
        assertEq(counter.count(), 1, "Count should be 1 after decrement");

        counter.decrement();
        assertEq(counter.count(), 0, "Count should be 0 after second decrement");
    }

    /// @notice Test decrement underflow protection
    function test_DecrementUnderflow() public {
        // Try to decrement from initial state (0)
        vm.expectRevert("Counter: cannot decrement below zero");
        counter.decrement();
    }

    /// @notice Test setCount functionality
    function test_SetCount() public {
        counter.setCount(42);
        assertEq(counter.count(), 42, "Count should be 42 after setCount");

        counter.setCount(0);
        assertEq(counter.count(), 0, "Count should be 0 after setCount to 0");

        counter.setCount(999);
        assertEq(counter.count(), 999, "Count should be 999 after setCount");
    }

    /// @notice Test reset functionality
    function test_Reset() public {
        counter.setCount(100);
        assertEq(counter.count(), 100, "Count should be 100 before reset");

        counter.reset();
        assertEq(counter.count(), 0, "Count should be 0 after reset");
    }

    /// @notice Test CountChanged event emission for increment
    function test_IncrementEmitsEvent() public {
        vm.expectEmit(true, true, false, false);
        emit Counter.CountChanged(1, 0);
        counter.increment();
    }

    /// @notice Test CountChanged event emission for decrement
    function test_DecrementEmitsEvent() public {
        counter.increment(); // Set to 1 first

        vm.expectEmit(true, true, false, false);
        emit Counter.CountChanged(0, 1);
        counter.decrement();
    }

    /// @notice Test CountChanged event emission for setCount
    function test_SetCountEmitsEvent() public {
        vm.expectEmit(true, true, false, false);
        emit Counter.CountChanged(42, 0);
        counter.setCount(42);
    }

    /// @notice Test CountChanged event emission for reset
    function test_ResetEmitsEvent() public {
        counter.setCount(100); // Set to non-zero first

        vm.expectEmit(true, true, false, false);
        emit Counter.CountChanged(0, 100);
        counter.reset();
    }

    /// @notice Fuzz test for setCount with random values
    function testFuzz_SetCount(uint256 value) public {
        counter.setCount(value);
        assertEq(counter.count(), value, "Count should match the set value");
    }

    /// @notice Test multiple operations sequence
    function test_MultipleOperations() public {
        // Start at 0
        assertEq(counter.count(), 0);

        // Increment to 3
        counter.increment();
        counter.increment();
        counter.increment();
        assertEq(counter.count(), 3);

        // Decrement to 1
        counter.decrement();
        counter.decrement();
        assertEq(counter.count(), 1);

        // Set to 10
        counter.setCount(10);
        assertEq(counter.count(), 10);

        // Reset to 0
        counter.reset();
        assertEq(counter.count(), 0);
    }

    /// @notice Test mizuhikiIncrement reverts for non-SBT holder
    function test_MizuhikiIncrementReverts() public {
        // This should revert because the test address doesn't hold Mizuhiki SBT
        vm.expectRevert();
        counter.mizuhikiIncrement();
    }

    /// @notice Test MIZUHIKI_SBT constant is set correctly
    function test_MizuhikiSBTAddress() public view {
        assertEq(
            counter.MIZUHIKI_SBT(),
            0x606F72657e72cd1218444C69eF9D366c62C54978,
            "MIZUHIKI_SBT address should be correct"
        );
    }

    /// @notice Test untiIncrement reverts for non-UNTI holder
    function test_UntiIncrementReverts() public {
        // This should revert because the test address doesn't hold UNTI token
        vm.expectRevert();
        counter.untiIncrement();
    }

    /// @notice Test compliantIncrement reverts for non-compliant user
    function test_CompliantIncrementReverts() public {
        // This should revert because the test address holds neither Mizuhiki SBT nor UNTI token
        vm.expectRevert();
        counter.compliantIncrement();
    }

    /// @notice Test BUSINESS_VERIFIER constant is set correctly
    function test_BusinessVerifierAddress() public view {
        assertEq(
            counter.BUSINESS_VERIFIER(),
            0xb44AbA22CfC4b58B2Cdf9be059D3ba94CD051638,
            "BUSINESS_VERIFIER address should be correct"
        );
    }
}