pragma solidity ^0.4.0;

contract Proxy {
    function forward_transaction (address _destination, uint _value, bytes _bytecode) public;
    function transfer_implementer (address _implementer) public;
}
