const should = require('chai').should();
const { BN,constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { MAX_NFT_MINT } = require('./helpers/constants.js');
const msgErrors = require('./helpers/errorMessages.js');

const PottersNFT = artifacts.require('PottersNFT');

contract('PottersNFT', ([owner, user, ...accounts]) => {

    let pottersNFTContract;
    beforeEach('Deploy contracts', async () => {
        pottersNFTContract = await PottersNFT.new({ from: owner });
    })
    describe('Deploy test', () => {
        it("Should deploy contract", async () => {
            const nftName = 'Potters';
            const pottersNFT =  await PottersNFT.new();
            (await pottersNFT.name()).should.be.equal(nftName);
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

    })
    describe('Mint', () => {
        it("Should allow mint NFT for user with owner", async() => {
            const tokenIndex = 0;
            await pottersNFTContract.mint(user, { from: owner });
            (await pottersNFTContract.ownerOf(tokenIndex)).should.be.equal(user);
        })
        it('Should deny mint NFT with user', async() => {
            const to = owner;
            await expectRevert(
                pottersNFTContract.mint(to, { from: user }), 
                msgErrors.ownable
            )
        })
        it('Should deny mint more than max limit with owner', async() => {
            const to = owner;
            for(let i = 0; i < MAX_NFT_MINT; i++) {
                await pottersNFTContract.mint(user, { from: owner });
            }
            await expectRevert(
                pottersNFTContract.mint(to, { from: owner }), 
                msgErrors.nftMintLimit
            )
        })
    })
    describe('Metadata', () => {
        beforeEach('Mint NFT', async() => {
            const tokenIndex = 0;
            const baseURI = 'https://mytestserver.com/';
            await pottersNFTContract.mint(user, { from: owner });
            (await pottersNFTContract.ownerOf(tokenIndex)).should.be.equal(user);
            await pottersNFTContract.setBaseTokenURI(baseURI, { from: owner });
        })

        it('Should get metadata form NFT', async() => {
            const tokenIndex = 0;
            const tokenURI = `https://mytestserver.com/${tokenIndex}`;
            (await pottersNFTContract.tokenURI(tokenIndex)).should.be.equal(tokenURI);
        })

    })
})