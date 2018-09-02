# clear-me-identity
Identity managing contracts.

The clearme identity is made up of an Identity and a Proxy
contracts.

The Proxy contract is an  implementation of the proposed ERC121 proxy,
that will allow for things like key recovery, as well as 
the adding and changing of owners.

The most interesting functionality illustrated by test cases
at this time is the transfering of ownership in the Identity,
and the forwarding of transactions in the Proxy.

**ToDo:**

**Refactor to use Maker Dai Dapp frameworks**
They include proxies and authority libs.


Write more test cases illustrating Identity Management features
such as adding and managing owners, and adding and managing recovery
keys.

Work on ClearmeIdentityManager has started. Key recovery use cases will be
illustrated in the coming tests.

**Running the Contracts in Trufthe

1. git clone https://github.com/clear-me/clear-me-identity.git
2. cd clear-me-identity
3. npm install -g truffle
4. npm install -g ganache-cli
5. truffle compile
6. truffle migrate
7. truffle test


