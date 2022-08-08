// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
 
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
 
contract PottersNFT is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    uint256 constant maxMintId = 20;
    
    Counters.Counter private currentTokenId;

    event PotterMinted(uint256 indexed tokenId);
    
    constructor() ERC721("Potters", "POT") {
    }

    function mint(address _to) external onlyOwner {
        
        require(currentTokenId.current() < maxMintId, "PottersNFT: Max NFT limit exceeded");
        _mint(_to, currentTokenId.current());
        emit PotterMinted(currentTokenId.current());
        currentTokenId.increment();
    }
 
}