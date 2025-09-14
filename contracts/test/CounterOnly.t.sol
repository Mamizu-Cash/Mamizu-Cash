// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";

/// @title Counter Contract Tests (Isolated)
/// @notice Isolated tests for the Counter contract without dependencies
contract CounterOnlyTest is Test {
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
}