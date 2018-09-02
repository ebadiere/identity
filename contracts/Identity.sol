pragma solidity ^0.4.17;

contract Identity {
    address public owner;
    modifier onlyOwner() {
        require(isOwner(msg.sender));
        _;
    }

    // @dev constructor function. Sets contract owner
    function Identity() public {
        owner = msg.sender;
    }

    function isOwner(address addr) public view returns(bool){
        return addr == owner;
    }
}
