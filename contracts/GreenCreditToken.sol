// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GreenCreditToken is ERC20 {
    address payable public EcoChainPlatformOwner;
    uint public tokenPrice;
    IERC20 public pyusdToken;

    mapping(address => bool) public GovernmentAccounts;
    mapping(address => bool) public IndustryAccounts; 
    mapping(address => bool) public IndividualAccounts;

    mapping(address => uint) public IndustryAllowance;

    constructor(uint initTokenPrice) ERC20("GreenCredit", "GCT") {
        EcoChainPlatformOwner = payable(msg.sender);
        // tokenPrice should be in PYUSD units (6 decimals)
        // e.g., 1000000 = 1 PYUSD
        tokenPrice = initTokenPrice;
        pyusdToken = IERC20(0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9);
        _mint(EcoChainPlatformOwner, 100 * 10**decimals());
    }

    modifier onlyPlatformOwner() {
        require(
            msg.sender != EcoChainPlatformOwner,
            "you are not a platform owner"
        );
        _;
    }

    function burnToken(address _address, uint _tokenCount) public {
        require(
            balanceOf(_address) >= _tokenCount * 10**decimals(),
            "token count is not enough"
        );
        _burn(_address, _tokenCount * 10**decimals());
    }

    //Gov functionalities
    function grantGovernmentPrivilege(address _account) public {
        GovernmentAccounts[_account] = true;
        _mint(msg.sender, 1000 * 10**decimals());
    }

    modifier onlyGovernment() {
        require(
            GovernmentAccounts[msg.sender] == true,
            "only government authority can use this function"
        );
        _;
    }

    function setTokenPrice(uint newPrice) public onlyGovernment {
        tokenPrice = newPrice;
    }

    function initialAllowance(
        address _industry,
        uint _maxAllowance,
        uint _tokenCount
    ) public onlyGovernment {
        require(_industry != address(0), "Invalid addresses");
        require(
            IndustryAccounts[_industry] == true,
            "given address must be an industry"
        );
        require(_tokenCount > 0, "token Count must be greater than 0");
        IndustryAllowance[_industry] = _maxAllowance;
        _transfer(msg.sender, _industry, _tokenCount * 10**decimals());
    }

    // Reward distribution to the public
    function registerIndividual() public {
        require(!IndividualAccounts[msg.sender], "Already registered as an individual");
        IndividualAccounts[msg.sender] = true;
    }

    modifier onlyIndividual() {
        require(
            IndividualAccounts[msg.sender],
            "Only registered individual users can call this function"
        );
        _;
    }

    function collectReward(uint rewardAmount) public onlyIndividual {
        require(rewardAmount > 0, "Reward amount must be greater than 0");

        _mint(msg.sender, rewardAmount * 10**decimals());
    }

    //Industry functionalities
    function grantIndustryPrivilege(address _account) public {
        IndustryAccounts[_account] = true;
    }

    modifier onlyIndustry() {
        require(
            IndustryAccounts[msg.sender] == true,
            "only industry authority can use this function"
        );
        _;
    }

    event tokenPurchased(
        address indexed _industryId,
        address indexed _govId,
        uint indexed _tokenCount,
        uint _taxFee
    );

    // buy a token from Government and pay the tax fee for emission
    function buyToken(
        address _to,
        uint _tokenCount,
        address _govAddress
    ) public onlyIndustry {
        require(_tokenCount > 0, "Token count must be greater than 0");
        require(IndustryAllowance[_to] >= _tokenCount, "Allowance exceeded");

        uint totalCost = tokenPrice * _tokenCount;
        require(pyusdToken.balanceOf(msg.sender) >= totalCost, "Insufficient PYUSD balance");

        // Transfer PYUSD from buyer to government
        require(pyusdToken.transferFrom(msg.sender, _govAddress, totalCost), "PYUSD transfer failed");

        _mint(_to, _tokenCount * 10**decimals());
        IndustryAllowance[_to] = IndustryAllowance[_to] - _tokenCount;
        emit tokenPurchased(_to, _govAddress, _tokenCount, totalCost);
    }

    // ==== Carbon credit trading system ====

    struct TokenListing {
        address seller;
        uint tokenAmount;
        uint price;
        bool isActive;
    }

    mapping(uint => TokenListing) public listings;
    uint public listingCount;

    event TokensListed(
        address indexed seller,
        uint tokenAmount,
        uint price
    );
    event TokensPurchasedFromMarketplace(
        address indexed buyer,
        address indexed seller,
        uint tokenAmount,
        uint price
    );

    modifier validBalance(uint _tokenCount) {
        require(
            balanceOf(msg.sender) >= _tokenCount * 10**decimals(),
            "Insufficient balance"
        );
        _;
    }

    function listTokensForSale(uint _tokenCount, uint _price)
        public
        onlyIndustry
        validBalance(_tokenCount)
    {
        require(_tokenCount > 0 && _price > 0, "Invalid amount or price");

        listings[listingCount] = TokenListing({
            seller: msg.sender,
            tokenAmount: _tokenCount,
            price: _price,
            isActive: true
        });

        emit TokensListed(msg.sender, _tokenCount, _price);
        listingCount++;
    }

    // buy the listed token
    function buyTokensFromMarketpalce(uint _listingId) public onlyIndustry {
        TokenListing storage listing = listings[_listingId];
        require(listing.isActive, "Listing is not active");
        require(pyusdToken.balanceOf(msg.sender) >= listing.price, "Insufficient PYUSD balance");

        // Transfer PYUSD from buyer to seller
        require(pyusdToken.transferFrom(msg.sender, listing.seller, listing.price), "PYUSD transfer failed");

        _transfer(
            listing.seller,
            msg.sender,
            listing.tokenAmount * 10**decimals()
        );

        listing.isActive = false;

        emit TokensPurchasedFromMarketplace(
            msg.sender,
            listing.seller,
            listing.tokenAmount,
            listing.price
        );
    }
}
