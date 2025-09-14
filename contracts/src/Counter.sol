// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title Simple Counter Contract
/// @notice A basic counter that can be incremented and decremented
/// @dev This is a simple example contract for demonstration purposes
contract Counter {
    /// @notice The current count value
    uint256 public count;

    /// @notice Emitted when the counter value changes
    /// @param newValue The new counter value
    /// @param oldValue The previous counter value
    event CountChanged(uint256 indexed newValue, uint256 indexed oldValue);

    /// @notice Initialize the counter with zero
    constructor() {
        count = 0;
    }

    /// @notice Increment the counter by 1
    function increment() public {
        uint256 oldValue = count;
        count += 1;
        emit CountChanged(count, oldValue);
    }

    /// @notice Decrement the counter by 1
    /// @dev Reverts if count would underflow (go below 0)
    function decrement() public {
        require(count > 0, "Counter: cannot decrement below zero");
        uint256 oldValue = count;
        count -= 1;
        emit CountChanged(count, oldValue);
    }

    /// @notice Set the counter to a specific value
    /// @param newCount The new value to set
    function setCount(uint256 newCount) public {
        uint256 oldValue = count;
        count = newCount;
        emit CountChanged(count, oldValue);
    }

    /// @notice Get the current counter value
    /// @return The current count
    function getCount() public view returns (uint256) {
        return count;
    }

    /// @notice Reset the counter to zero
    function reset() public {
        uint256 oldValue = count;
        count = 0;
        emit CountChanged(count, oldValue);
    }
}