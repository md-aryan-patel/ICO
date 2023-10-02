// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Token.sol";

contract ico {
    IERC20 token;
    uint256 cap;
    uint256 public pricePerToken;
    uint256 public startTime;
    uint256 public endTime;
    address Owner;
    uint256 public totalTokenSold;
    uint256 decimal = 10e18;

    uint256 tokenSalePercentage = 35;
    uint256 teamSalePercentage = 10;
    uint256 rewardPoolPercentage = 25;
    uint256 tokenReservePercentage = 12;
    uint256 partnershipPercentage = 5;
    uint256 marketingPercentage = 8;
    uint256 liquidityPercentage = 5;

    uint256 tokenAmountInEth;

    enum SaleStage {
        preICO,
        ICO,
        postICO
    }

    SaleStage stage = SaleStage.preICO;

    mapping(address => uint256) contributers;

    event Invest(uint256 amount, uint256 tokens, address by, uint256 time);
    event WithdrawICOTokens(uint256 amount, address to);

    constructor(
        address _token,
        uint256 _price,
        uint256 _startTime,
        uint256 _endTime
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
        require(uint(stage) == 0, "ICO: ICO already started or may be ended");
        _;
    }

    modifier icoState() {
        setSaleStage();
        require(uint(stage) == 1, "ICO: ICO not started yet");
        _;
    }

    modifier postIcoState() {
        setSaleStage();
        require(
            uint(stage) == 2,
            "ICO: ICO may be going on or may not be started yet"
        );
        _;
    }

    function getIcoStage() public returns (SaleStage) {
        setSaleStage();
        return stage;
    }

    function returnTimedStage() internal view returns (uint256 _state) {
        if (block.timestamp < startTime) _state = 0;
        else if (block.timestamp >= startTime && block.timestamp <= endTime)
            _state = 1;
        else if (block.timestamp > endTime) _state = 2;
        else _state = 3;
    }

    function setSaleStage() internal {
        uint256 currentState = returnTimedStage();
        require(currentState < 3, "ICO: Invalid Stage of ICO");
        if (currentState == 0) stage = SaleStage.preICO;
        else if (currentState == 1) stage = SaleStage.ICO;
        else if (currentState == 2) stage = SaleStage.postICO;
    }

    function invest() external payable icoState returns (uint256 tokenRequire) {
        uint256 currAmount = token.balanceOf(address(this));
        require(currAmount > 0, "ICO: Insufficient amount");
        tokenRequire = (msg.value / pricePerToken) * decimal;
        require(
            (tokenRequire + totalTokenSold) <=
                (tokenSalePercentage * cap) / 100,
            "ICO: Crowdesale quota reached"
        );

        if (tokenRequire >= currAmount) {
            tokenAmountInEth = (pricePerToken * currAmount) / decimal;
            uint256 transaferAmount = msg.value - tokenAmountInEth;
            contributers[msg.sender] += currAmount;
            payable(msg.sender).transfer(transaferAmount);
            totalTokenSold += currAmount;
            tokenRequire = currAmount;
        } else {
            uint256 transaferAmount = (pricePerToken * tokenRequire) / decimal;
            require(msg.value >= transaferAmount, "ICO: Insufficient fees");
            contributers[msg.sender] += tokenRequire;
            totalTokenSold += tokenRequire;
            tokenAmountInEth = msg.value;
        }
        emit Invest(
            tokenAmountInEth,
            tokenRequire,
            msg.sender,
            block.timestamp
        );
    }

    function withdrawICOToken() external postIcoState {
        uint256 transferableToken = contributers[msg.sender];
        require(transferableToken > 0, "ICO: No token to transfer");
        token.transfer(msg.sender, transferableToken);
        delete contributers[msg.sender];
        emit WithdrawICOTokens(transferableToken, msg.sender);
    }
}

// Add whitelist / other sales
