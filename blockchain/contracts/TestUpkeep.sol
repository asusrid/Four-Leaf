// SPDX-License-Identifier: No License (None)
pragma solidity ^0.8.9;

contract TestUpkeep {

    uint32 testvar = 0;

    constructor(){}

    function test() private returns(bool){
        testvar = 1;
        return true;
    }
}