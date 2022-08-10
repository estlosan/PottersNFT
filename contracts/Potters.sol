// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
 
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
 
contract PottersNFT is VRFConsumerBaseV2, ERC721Enumerable, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;

    // Chainlink constants
    bytes32 constant  keyHash = 0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15;
    uint32 constant callbackGasLimit = 35000;
    uint16 constant requestConfirmations = 3;
    uint32 constant numWords =  1;

    uint256 constant maxMintId = 5;
    
    Counters.Counter private currentTokenId;

    string public baseTokenURI;
    string public baseExtension = ".json";
    
    // Chainlink Subscription
    uint64 s_subscriptionId;
    VRFCoordinatorV2Interface public coordinatorContract;

    mapping(uint256 => address) public userByRequestId;
    mapping(address => uint256) public randomNumberByUser;
    mapping(uint256 => bool) public repeatedNumbers;

    event PotterMinted(uint256 indexed tokenId);
    event PotterReserved(uint256 indexed tokenId);
    
    constructor(address _vrfCoordinator, uint64 subscriptionId, string memory _baseTokenURI)
    VRFConsumerBaseV2(_vrfCoordinator)
    ERC721("Potters", "POT") 
    {
        baseTokenURI = _baseTokenURI;
        coordinatorContract = VRFCoordinatorV2Interface(_vrfCoordinator);
        s_subscriptionId = subscriptionId;
    }

    function mint() external {
        require(randomNumberByUser[msg.sender] != 0, "PottersNFT: Call reserveRandomNFT before calling mint function");
        uint256 randomTokenId = generateRandomNumber();
        _safeMint(msg.sender, randomTokenId);
        randomNumberByUser[msg.sender] = 0;
        emit PotterMinted(currentTokenId.current());
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        _requireMinted(_tokenId);
        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, _tokenId.toString(), baseExtension))
        : '';
    }

    function reserveRandomNFT() external {
        uint256 actualTokenId = currentTokenId.current();
        require(actualTokenId < maxMintId, "PottersNFT: Max NFT limit exceeded");
        require(randomNumberByUser[msg.sender] == 0, "PottersNFT: Token mint pending, call mint function");
        currentTokenId.increment();
        uint256 requestId = coordinatorContract.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        userByRequestId[requestId] = msg.sender;
        emit PotterReserved(actualTokenId);
    }

    function setBaseTokenURI(string calldata _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function setBaseExtension(string calldata _baseExtension) external onlyOwner {
        baseExtension = _baseExtension;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function generateRandomNumber() internal returns(uint256) {
        uint256 randomNumber = randomNumberByUser[msg.sender] % maxMintId;
        while(repeatedNumbers[randomNumber]) {
            randomNumber = (randomNumber + 1) % maxMintId;
        }
        repeatedNumbers[randomNumber] = true;
        return randomNumber;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomNumber
    ) internal override {
        address user = userByRequestId[requestId];
        randomNumberByUser[user] = randomNumber[0];
    }

}