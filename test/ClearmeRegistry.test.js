const ClearmeRegistry = artifacts.require('./ClearmeRegistry.sol')

contract('ClearmeRegistry', function([clearMe, identityOwner, claimIssuer]) {
    let clearmeRegistry;
    let ipfsHash = 'QmWBAr1QBWaAGaRJMcggbPiFYTBZhoHc4jBoWtKzLyZfSN';

    beforeEach('setup contract for each test', async function () {
        clearmeRegistry = await ClearmeRegistry.new();
    });

    it('can set and retrieve a registry record', async function () {
        await clearmeRegistry.setClaim(identityOwner, ipfsHash, {from: claimIssuer});
        let hashReturned = await clearmeRegistry.getClaim(identityOwner, claimIssuer);
        console.log(`Identifier returned: ${hashReturned}`);
        assert.equal(hashReturned, ipfsHash, 'Incorrect has returned');
    });

})
