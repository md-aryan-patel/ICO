// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Token.sol";

contract ico is ReentrancyGuard {
    using SafeMath for uint256;
    using SafeMath for uint64;
    using SafeMath for uint8;

    IERC20 token;
    uint256 cap;
    uint256 public pricePerToken;
    uint64 public startTime;
    uint64 public endTime;
    address Owner;
    uint256 public totalTokenSold;
    uint256 decimal = 10e18;

    uint8 constant tokenSalePercentage = 35;
    uint8 constant teamSalePercentage = 10;
    uint8 constant rewardPoolPercentage = 25;
    uint8 constant tokenReservePercentage = 12;
    uint8 constant partnershipPercentage = 5;
    uint8 constant marketingPercentage = 8;
    uint8 constant liquidityPercentage = 5;

    uint256 ethRequired;

    enum SaleStage {
        preICO,
        ICO,
        postICO
    }

    SaleStage stage = SaleStage.preICO;

    mapping(address => uint256) contributers;

    event Invest(uint256 amount, uint256 tokens, address by, uint256 time);
    event ClaimToken(uint256 amount, address to);

    constructor(
        address _token,
        uint256 _price,
        uint64 _startTime,
        uint64 _endTime
    ) {
        Owner = msg.sender;
        token = IERC20(_token);
        pricePerToken = _price;
        startTime = _startTime;
        endTime = _endTime;
        cap = 750000000 * decimal;
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

    function invest()
        external
        payable
        icoState
        nonReentrant
        returns (uint256 tokenRequire)
    {
        uint256 currAmount = token.balanceOf(address(this));
        require(currAmount > 0, "ICO: Insufficient amount");
        tokenRequire = msg.value.mul(decimal).div(pricePerToken);
        require(
            (tokenRequire + totalTokenSold) <=
                tokenSalePercentage.mul(cap).div(100),
            "ICO: Crowdesale quota reached"
        );

        if (tokenRequire >= currAmount) {
            tokenRequire = currAmount;
            ethRequired = pricePerToken.mul(tokenRequire).div(decimal);
            uint256 transaferAmount = msg.value.sub(ethRequired);
            payable(msg.sender).transfer(transaferAmount);
        } else ethRequired = msg.value;

        contributers[msg.sender] = tokenRequire.add(contributers[msg.sender]);
        totalTokenSold = tokenRequire.add(totalTokenSold);

        emit Invest(ethRequired, tokenRequire, msg.sender, block.timestamp);
    }

    function claimToken() external postIcoState nonReentrant {
        uint256 transferableToken = contributers[msg.sender];
        require(transferableToken > 0, "ICO: No token to transfer");
        token.transfer(msg.sender, transferableToken);
        delete contributers[msg.sender];
        emit ClaimToken(transferableToken, msg.sender);
    }
}

// Add whitelist / other sales
