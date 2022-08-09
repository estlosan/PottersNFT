// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
 
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
 
contract PottersNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;

    uint256 constant maxMintId = 20;
    
    Counters.Counter private currentTokenId;

    string public baseTokenURI;

    event PotterMinted(uint256 indexed tokenId);
    
    constructor() ERC721("Potters", "POT") {
    }

    function mint(address _to) external onlyOwner {
        require(currentTokenId.current() < maxMintId, "PottersNFT: Max NFT limit exceeded");
        _safeMint(_to, currentTokenId.current());
        emit PotterMinted(currentTokenId.current());
        currentTokenId.increment();
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        _requireMinted(_tokenId);
        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, _tokenId.toString()))
        : '';
    }

    function setBaseTokenURI(string calldata _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }
 
}