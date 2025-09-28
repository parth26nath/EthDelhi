// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Emission {
    uint256 public dataCount = 0;
    IERC20 public pyusdToken;

    struct Data {
        address wallet_id;
        string carbon;
        string date;
        uint fees;
    }

    constructor() {
        pyusdToken = IERC20(0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9);
    }

    event EmissionData(address indexed wallet_id, string indexed carbon, string indexed date, uint fees);

    mapping(uint256 => Data) public emmis;

    function createEmissionData(address _walletID, string memory _carbon, string memory _date, uint _fees) public {
        require(_fees > 0, "Fees should be greater than 0");
        require(pyusdToken.balanceOf(msg.sender) >= _fees, "Insufficient PYUSD balance");

        // Transfer PYUSD fees to this contract
        require(pyusdToken.transferFrom(msg.sender, address(this), _fees), "PYUSD transfer failed");

        dataCount++;
        emmis[dataCount] = Data(_walletID, _carbon, _date, _fees);
        emit EmissionData(_walletID, _carbon, _date, _fees);
    }

    function collectFee(address _govId) public {
        require(msg.sender == _govId, "Only authorized entity can collect fees");

        uint balance = pyusdToken.balanceOf(address(this));
        require(balance > 0, "No PYUSD fees to collect");
        require(pyusdToken.transfer(_govId, balance), "PYUSD transfer failed");
    }

}