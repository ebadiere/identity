const Identity = artifacts.require('./Identity.sol')

contract('Identity', function([owner, newOwner]) {
    let identity

    beforeEach('setup contract for each test', async function () {
        identity = await Identity.new();
    });

    it('has the correct initial owner, the creator', async function () {
        assert.isTrue(await identity.isOwner(owner), "The creator should be the owner.");
    });

    it('can recognize an incorrect owner or imposter', async function () {
        assert.isFalse(await identity.isOwner(newOwner), "Incorrect owner.");
    });
})