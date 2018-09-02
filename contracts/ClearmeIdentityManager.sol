pragma solidity ^0.4.0;
import "./ClearmeProxy.sol";

contract ClearmeIdentityManager {
    mapping(address => mapping(address => uint)) owners;
    mapping(address => address) recoveryKeys;
    mapping(address => mapping(address => uint)) limiter;
    mapping(address => uint) public migrationInitiated;
    mapping(address => address) public migrationNewAddress;

    modifier validAddress(address addr) { //protects against some weird attacks
        require(addr != address(0));
        _;
    }

//    function createIdentity(address owner, address recoveryKey) public validAddress(recoveryKey) {
//        Proxy identity = new Proxy();
//        owners[identity][owner] = now - adminTimeLock; // This is to ensure original owner has full power from day one
//        recoveryKeys[identity] = recoveryKey;
//        LogIdentityCreated(identity, msg.sender, owner,  recoveryKey);
//    }

    // Will be restricted to only past owners
    function migrate(ClearmeProxy identity) public {
        address newIdManager = migrationNewAddress[identity];
        delete migrationInitiated[identity];
        delete migrationNewAddress[identity];
        identity.transfer_implementer(newIdManager);
        delete recoveryKeys[identity];

        delete owners[identity][msg.sender];

    }
}


