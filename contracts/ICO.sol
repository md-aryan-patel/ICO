// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ico is ReentrancyGuard {
    using SafeMath for uint256;
    using SafeMath for uint64;
    using SafeMath for uint8;

    IERC20 token;
    uint256 maxToken;
    uint256 public pricePerToken;
    uint64 public startTime;
    uint64 public endTime;
    address Owner;
    uint256 public totalTokenSold;
    uint256 decimals = 10e18;

    enum SaleStage {
        preICO,
        ICO,
        postICO
    }

    SaleStage stage = SaleStage.preICO;

    mapping(address => uint256) contributers;

    event ClaimToken(uint256 amount, address to);
    event UpdateBalance(
        address user,
        uint256 usdtSent,
        uint256 tokenAmount,
        uint256 timestamp
    );
    event PriceUpdate(uint256 newPrice, uint256 updateTime);

    constructor(address _token, uint64 _startTime, uint64 _endTime) {
        require(
            _startTime > block.timestamp && _startTime < _endTime,
            "ICO: Invalid Timestamps"
        );
        pricePerToken = 3 * 10e4;
        Owner = msg.sender;
        token = IERC20(_token);
        startTime = _startTime;
        endTime = _endTime;
        maxToken = 750000000 * decimals;
    }

    modifier onlyOwner() {
        require(msg.sender == Owner, "ICO: Not owner");
        _;
    }

    modifier preIcoState() {
        setSaleStage();
        require(uint8(stage) == 0, "ICO: ICO already started or may be ended");
        _;
    }

    modifier icoState() {
        setSaleStage();
        require(uint8(stage) == 1, "ICO: ICO not started yet");
        _;
    }

    modifier postIcoState() {
        setSaleStage();
        require(
            uint8(stage) == 2,
            "ICO: ICO may be going on or may not be started yet"
        );
        _;
    }

    function getIcoStage() public view returns (uint8) {
        if (block.timestamp < startTime) return uint8(SaleStage.preICO);
        else if (block.timestamp >= startTime && block.timestamp <= endTime)
            return uint8(SaleStage.ICO);
        else if (block.timestamp > endTime) return uint8(SaleStage.postICO);
        return 3;
    }

    function setSaleStage() internal {
        uint8 currentIcoState = getIcoStage();
        if (currentIcoState == 0) stage = SaleStage.preICO;
        else if (currentIcoState == 1) stage = SaleStage.ICO;
        else if (currentIcoState == 2) stage = SaleStage.postICO;
        else revert("ICO: Invalid state");
    }

    function updatePricePerToken(uint256 _newPrice) external onlyOwner {
        pricePerToken = _newPrice;
    }

    function updateBalance(
        uint256 _sentUsdt,
        address _user
    ) external onlyOwner nonReentrant returns (uint256) {
        require(_sentUsdt > 0, "ICO: received amount can't be 0");
        uint256 updatedBalance = _sentUsdt.mul(decimals).div(pricePerToken);
        require(
            updatedBalance + totalTokenSold <= maxToken,
            "ICO: Tokens sold out"
        );
        contributers[_user] = contributers[_user].add(updatedBalance);
        totalTokenSold = totalTokenSold.add(updatedBalance);
        emit UpdateBalance(_user, _sentUsdt, updatedBalance, block.timestamp);
        return updatedBalance;
    }

    function claimToken() external nonReentrant returns (uint256) {
        uint256 transferableToken = contributers[msg.sender];
        require(transferableToken > 0, "ICO: No token to transfer");
        token.transfer(msg.sender, transferableToken);
        delete contributers[msg.sender];
        emit ClaimToken(transferableToken, msg.sender);
        return transferableToken;
    }
}

// Add whitelist / other sales
