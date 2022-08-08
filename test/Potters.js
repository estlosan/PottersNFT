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
})