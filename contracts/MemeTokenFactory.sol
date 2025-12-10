// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MemeToken
 * @dev ERC20 Token for memes
 */
contract MemeToken is ERC20 {
    uint8 private _decimals;
    string public logoUrl;

    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint8 tokenDecimals,
        address creator,
        string memory _logoUrl
    ) ERC20(name, symbol) {
        _decimals = tokenDecimals;
        logoUrl = _logoUrl;
        _mint(creator, totalSupply * 10**tokenDecimals);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}

/**
 * @title MemeTokenFactory
 * @dev Factory for creating meme tokens with 0.01 ETH fee
 */
contract MemeTokenFactory is Ownable {
    uint256 public constant CREATION_FEE = 0.01 ether;

    struct TokenInfo {
        address tokenAddress;
        address creator;
        string name;
        string symbol;
        uint256 totalSupply;
        uint256 createdAt;
        string logoUrl;
        string bannerUrl;
    }

    mapping(address => TokenInfo[]) public creatorTokens;
    TokenInfo[] public allTokens;

    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        uint256 totalSupply,
        string logoUrl,
        uint256 timestamp
    );

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Create new meme token
     */
    function createMemeToken(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint8 decimals,
        string memory logoUrl,
        string memory bannerUrl
    ) external payable returns (address) {
        require(msg.value >= CREATION_FEE, "Insufficient creation fee");
        require(bytes(name).length > 0, "Name required");
        require(bytes(symbol).length > 0, "Symbol required");
        require(totalSupply > 0, "Supply must be > 0");

        // Create token
        MemeToken newToken = new MemeToken(
            name,
            symbol,
            totalSupply,
            decimals,
            msg.sender,
            logoUrl
        );

        address tokenAddress = address(newToken);

        // Store info
        TokenInfo memory info = TokenInfo({
            tokenAddress: tokenAddress,
            creator: msg.sender,
            name: name,
            symbol: symbol,
            totalSupply: totalSupply * 10**decimals,
            createdAt: block.timestamp,
            logoUrl: logoUrl,
            bannerUrl: bannerUrl
        });

        creatorTokens[msg.sender].push(info);
        allTokens.push(info);

        // Transfer fee to owner
        (bool success, ) = owner().call{value: msg.value}("");
        require(success, "Fee transfer failed");

        emit TokenCreated(
            tokenAddress,
            msg.sender,
            name,
            symbol,
            totalSupply,
            logoUrl,
            block.timestamp
        );

        return tokenAddress;
    }

    function getCreatorTokens(address creator)
        external
        view
        returns (TokenInfo[] memory)
    {
        return creatorTokens[creator];
    }

    function getTotalTokensCreated() external view returns (uint256) {
        return allTokens.length;
    }

    function getTokenByIndex(uint256 index)
        external
        view
        returns (TokenInfo memory)
    {
        require(index < allTokens.length, "Index out of bounds");
        return allTokens[index];
    }

    receive() external payable {}
}
