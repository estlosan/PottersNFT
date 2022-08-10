//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract VRFCoordinatorMock {
    VRFConsumerBaseV2 vrfConsumerBaseV2;
    uint256 actualRequestId = 300;

    constructor() {
    }

    function generateRandomSeed(uint256 _randomSeed) external {
        uint256[] memory randomWords = new uint256[](1);
        randomWords[0] = _randomSeed;
        vrfConsumerBaseV2.rawFulfillRandomWords(actualRequestId, randomWords);
    }

    function requestRandomWords(
        bytes32,
        uint64,
        uint16,
        uint32,
        uint32
    ) external returns (uint256) {
        vrfConsumerBaseV2 = VRFConsumerBaseV2(msg.sender);
        actualRequestId += 1;
        return actualRequestId;
    }

}