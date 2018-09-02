const ClearmeProxy = artifacts.require('./ClearmeProxy.sol')

contract('ClearmeProxy', function([owner, newOwner, receiver, imposter]) {
    let clearmeProxy
    let testNum


    function getRanomNumber() {
        return Math.floor(Math.random() * (10000 - 1)) + 1;
    }

    function sendToClearmeProxy(_value) {
        return clearmeProxy.sendTransaction({
            from: owner,
            gas: 40000,
            value: _value
        });
    }

    beforeEach('Setup contract for each test', async function () {
        clearmeProxy = await ClearmeProxy.new();
        testNum = getRanomNumber();
    });

    it('Runs a basic proxy test, verifies the owner', async function () {
        assert.isTrue(await clearmeProxy.isOwner(owner), "The creator should be the owner.");
    });

    it('Can transfer the ownership when called by the owner', async function () {
        await clearmeProxy.transfer_implementer(newOwner);
        assert.isTrue(await clearmeProxy.isOwner(newOwner), "The ownership was not transfered");
    });

    it('Cannot change ownership when run by an imposter', async function () {
        errorThrown = false
        try{
            await clearmeProxy.transfer_implementer(newOwner, {from: imposter});
        } catch(e){
            errorThrown = true
        }
        assert.isTrue(errorThrown, 'An error should have been thrown')
        assert.isTrue(await clearmeProxy.isOwner(owner), "The ownership was transfered by an imposter");
        let isOwner = await clearmeProxy.isOwner.call(imposter);
        assert.isFalse(isOwner, 'Controller should not be changed');
    });

    it("Cannot transfer the ownership to the creator's address, which is the proxy address", async function () {
        await clearmeProxy.transfer_implementer(clearmeProxy.address, {from: owner});
        let isOwner = await clearmeProxy.isOwner.call(clearmeProxy.address);
        assert.isFalse(isOwner, 'Owner should not have changed');
        assert.isTrue(await clearmeProxy.isOwner(owner), "The creator should still be the owner.");
    });

    it('Owner can send a 0 eth transaction', async function () {
        try {
            await clearmeProxy.forward_transaction(receiver, 0, "0x" + testNum);
        } catch(e){
            console.log("E: " + e);
        }
    });

    it('Non-owner cannot send a 0 eth transaction', async function () {
        try {
            await clearmeProxy.forward_transaction(receiver, 0, "0x" + testNum, {from: imposter});
        } catch(e){
            assert.ok(e);
        }
    });

    it('Owner can send a 1 eth transaction', async function () {
        let initialBalance
        let ethToSend = 1
        let balance = await web3.eth.getBalance(receiver);
        initialBalance = web3.fromWei(balance, 'ether').toNumber();
        console.log("Receiver initial balance: " + initialBalance);

        let proxyContractBalance = await web3.eth.getBalance(clearmeProxy.address);
        let initialProxyContractBalance = web3.fromWei(proxyContractBalance, 'ether').toNumber();

        console.log("Proxy contract initial balance: " + initialProxyContractBalance);

        let weiToSend = web3.toWei(1, 'ether');
        await sendToClearmeProxy(weiToSend);

        proxyContractBalance = await web3.eth.getBalance(clearmeProxy.address);
        proxyContractBalanceInEther = web3.fromWei(proxyContractBalance, 'ether').toNumber();

        console.log("Proxy contract balance after initial send: " + proxyContractBalanceInEther);

        await clearmeProxy.forward_transaction(receiver, web3.toWei(proxyContractBalanceInEther, 'ether'), "0x" + testNum);
        console.log("Receiver balance after forward: " + web3.fromWei(web3.eth.getBalance(receiver).toNumber()));

        proxyContractBalance = await web3.eth.getBalance(clearmeProxy.address);
        proxyContractBalanceInEther = web3.fromWei(proxyContractBalance, 'ether').toNumber();

        console.log("Proxy contract balance after forward send: " + proxyContractBalanceInEther);
        let total = initialBalance + ethToSend;
        assert.equal(web3.fromWei(web3.eth.getBalance(receiver)).toNumber(), total, "Balances do not match");

    });

    it("Emits event on received transaction", async function () {
        let txn = await sendToClearmeProxy("200");

        let txnString = JSON.stringify(txn);
        let txnParsed = JSON.parse(txnString);

        assert.equal(txnParsed.logs[0].event, "Received");
        assert.equal(txnParsed.logs[0].args.sender, owner);
        assert.equal(txnParsed.logs[0].args.value, "200");
    });

    it("Emits event on transaction forwarded", async function () {
        let amountToSend = "250";
        await sendToClearmeProxy(amountToSend);

        let txn = await clearmeProxy.forward_transaction(receiver, amountToSend, "0x00");
        let txnString = JSON.stringify(txn);
        let txnParsed = JSON.parse(txnString);

        assert.equal(txnParsed.logs[0].event, "Forwarded");
        assert.equal(txnParsed.logs[0].args.destination, receiver);
        assert.equal(txnParsed.logs[0].args.value, amountToSend);
        assert.equal(txnParsed.logs[0].args.data, "0x00");
    });
})