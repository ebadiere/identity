pragma solidity ^0.4.17;
import "./Identity.sol";
import "./libs/interfaces/Proxy.sol";

contract ClearmeProxy is Identity, Proxy{

    modifier onlyImplementer() {
        require(isOwner(msg.sender));
        _;
    }

    event Forwarded (address indexed destination, uint value, bytes data);
    event Received (address indexed sender, uint value);

    function () payable public {
        Received(msg.sender, msg.value);
    }

    function forward_transaction(address _destination, uint _value, bytes _data) public onlyOwner {
        require(executeCall(_destination, _value, _data));
        Forwarded(_destination, _value, _data);
    }

    function transfer_implementer(address _implementer) public onlyOwner {
        if (_implementer != address(this)){
            owner = _implementer;
        }
    }

    // copied from GnosisSafe
    // https://github.com/gnosis/gnosis-safe-contracts/blob/master/contracts/GnosisSafe.sol
    function executeCall(address to, uint256 value, bytes data) internal returns (bool success) {
        assembly {
            success := call(gas, to, value, add(data, 0x20), mload(data), 0, 0)
        }
    }
}
