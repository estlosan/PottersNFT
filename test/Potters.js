const should = require('chai').should();
const { BN,constants, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');
const { MAX_NFT_MINT } = require('./helpers/constants.js');
const msgErrors = require('./helpers/errorMessages.js');

const PottersNFT = artifacts.require('PottersNFT');
const VRFCoordinatorMock = artifacts.require('VRFCoordinatorMock');

contract('PottersNFT', ([owner, user, ...accounts]) => {

    let pottersNFTContract;
    beforeEach('Deploy contracts', async () => {
        const baseTokenURI = 'https://mytestserver.com/'
        const subscriptionId = 0;
        vrfCoordinatorMockContract = await VRFCoordinatorMock.new({ from: owner });
        pottersNFTContract = await PottersNFT.new(vrfCoordinatorMockContract.address, subscriptionId, baseTokenURI, { from: owner });
    })
    describe('Deploy test', () => {
        it("Should deploy contract", async () => {
            const nftName = 'Potters';
            const subscriptionId = 0;
            const baseTokenURI = 'https://mytestserver.com/'
            pottersNFTContract = await PottersNFT.new(vrfCoordinatorMockContract.address, subscriptionId, baseTokenURI, { from: owner });
            (await pottersNFTContract.name()).should.be.equal(nftName);
        })
    })
    describe('Set functions', () => {
        it('Should allow set URI base from owner', async() => {
            const uriBase = "TestBase";
            await pottersNFTContract.setBaseTokenURI(uriBase, { from: owner });
            (await pottersNFTContract.baseTokenURI()).should.be.equal(uriBase);
        })
        it('Should deny set URI base from user', async() => {
            const uriBase = "TestBase";
            await expectRevert(
                pottersNFTContract.setBaseTokenURI(uriBase, { from: user }), 
                msgErrors.ownable
            )
        })
        it('Should allow set URI base extension from owner', async() => {
            const baseExtension = ".json";
            await pottersNFTContract.setBaseExtension(baseExtension, { from: owner });
            (await pottersNFTContract.baseExtension()).should.be.equal(baseExtension);
        })
        it('Should deny set URI base extension from user', async() => {
            const uriBase = "TestBase";
            await expectRevert(
                pottersNFTContract.setBaseExtension(uriBase, { from: user }), 
                msgErrors.ownable
            )
        })

    })
    describe('Random mint', () => {
        it("Should allow mint NFT for user with owner", async() => {
            const tokenIndex = 0;
            await pottersNFTContract.reserveRandomNFT({ from: owner });
            await vrfCoordinatorMockContract.generateRandomSeed(5); // Seed % maxMintId == (TokenId 0)
            await pottersNFTContract.mint({ from: owner });
            (await pottersNFTContract.ownerOf(tokenIndex)).should.be.equal(owner);
        })
        it('Should deny mint NFT without previous reservation', async() => {
            await expectRevert(
                pottersNFTContract.mint({ from: user }), 
                msgErrors.randomNumberPending
            )
        })
        it('Should deny mint more than max limit with owner', async() => {
            for(let i = 0; i < MAX_NFT_MINT; i++) {
                await pottersNFTContract.reserveRandomNFT({ from: owner });
                await vrfCoordinatorMockContract.generateRandomSeed(i + 5); // Seed % maxMintId == (i + TokenId 0)
                await pottersNFTContract.mint({ from: owner });
            }
            await expectRevert(
                pottersNFTContract.reserveRandomNFT({ from: owner }),
                msgErrors.nftMintLimit
            )
        }) 
    })
    describe('Metadata', () => {
        beforeEach('Mint NFT', async() => {
            const tokenIndex = 0;
            const baseURI = 'https://mytestserver.com/';
            await pottersNFTContract.reserveRandomNFT({ from: owner });
            await vrfCoordinatorMockContract.generateRandomSeed(5); // Seed % maxMintId == (TokenId 0)
            await pottersNFTContract.mint({ from: owner });
            (await pottersNFTContract.ownerOf(tokenIndex)).should.be.equal(owner);
            await pottersNFTContract.setBaseTokenURI(baseURI, { from: owner });
        })

        it('Should get metadata form NFT', async() => {
            const tokenIndex = 0;
            const tokenURI = `https://mytestserver.com/${tokenIndex}.json`;
            (await pottersNFTContract.tokenURI(tokenIndex)).should.be.equal(tokenURI);
        })
    })
})