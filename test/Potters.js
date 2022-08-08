
const PottersNFT = artifacts.require('PottersNFT');


contract('PottersNFT', ([owner, user, ...accounts]) => {

    describe('Deploy test', () => {
        it("Should deploy contract", async () => {
            const pottersNFTContract =  await PottersNFT.new();
            await pottersNFTContract
        })
    })
})