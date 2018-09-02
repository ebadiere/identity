pragma solidity ^0.4.17;

contract ClearmeRegistry {

    address public owner;

    mapping(address => mapping(address => string)) public registry;

    function ClearmeRegistry() public {
        owner = msg.sender;
    }

    function setClaim(address _subject, string _identifier) public {
        registry[msg.sender][_subject] = _identifier;
    }

    function getClaim(address _subject, address _issuer) public view returns (string) {
        return registry[_issuer][_subject];
    }

}
