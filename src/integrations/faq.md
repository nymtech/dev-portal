# Integration FAQ

On this page, you'll find frequently asked questions on how to get started on integrating your project with Nym's Mixnet and its blockchain, Nyx.

### General Information 
##### Where can I find Nym's Website?
https://nymtech.net/

##### Where can I find Nym's Blockchain Explorer?
https://nym.explorers.guru/

### Github Code Information
##### Where can I find Nym's main monorepo?

https://github.com/nymtech/nym/

##### Where can I find Nym's developer documentation?
(You are currently viewing the Nym Docs)<br/>
https://nymtech.net/docs/stable/overview

### Wallet Installation

The Nym wallet can be downloaded here. You can select your operating system and continue from there. You can find all the instructions related to setting up your Nym Wallet here: https://nymtech.net/docs/stable/wallet.

##### What are the machine hardware requirements for Nym Wallet?
About 16GB of RAM had been recommended as a benchmark for the wallet. However you can expect its average memory usage of 100MB.

##### What are the installation steps for installing Nym Wallet?
Follow the instructions in the link at the top of this section. If using Ubuntu, you will need to `chmod +X` the AppImage in your terminal before attempting to run it after downloading it.

If you want to compile the Wallet yourself as a developer, you can follow [these instructions](https://nymtech.net/docs/stable/wallet/) to achieve your desired result.

##### What are the installation steps for interacting with Nyx Blockchain via `nyxd`?
To interact with the Nyx blockchain you have to use the `nyxd` binary. Instructions for compiling the binary can be found here: https://nymtech.net/docs/stable/run-nym-nodes/nodes/rpc-node.

### Exchange Integration Documents and RPC Methods

##### How can we use JSON-RPC methods to interact with the Nyx blockchain?

There are two ways to use JSON-RPC methods to interact with the Nyx blockchain:
1. the `nyxd` binary, which is used for CLI wallets, RPC nodes, and validators. Instructions on setting up the `nyxd` binary can be found [here](https://nymtech.net/docs/stable/run-nym-nodes/nodes/rpc-node).This is recommended for more complex commands.

2. The Nym CLI tool, a CLI tool which can be built via the build instructions [here](https://nymtech.net/docs/stable/nym-cli).It is a bit simpler to use than the `nyxd` binary, but is not recommended for complex queries.


##### How do I generate address/mnemonic for users to interact with?

_Nyxd:_<br/>
Use the following command, replacing `your_id` with the ID you want to use for your keypair eg:
```
./nyxd keys add your_id --chain-id=nyx --gas=auto --gas-adjustment=1.4 --fees=7000unym
```

_NymCLI:_<br/>
Use the following command:
```
./nym-cli account create
```

Both methods will generate a keypair and log the mnemonic.

##### c) How to get block information like block height, block hash, block time as so on from the genesis block? Also what is the most important to get from the transactions in each block?

_Nyxd:_<br/>
You would use one of the subcommands returned by this command:
```
./nyxd query tx --chain-id=nyx --gas=auto --gas-adjustment=1.4 --fees=7000unym
```
_NymCLI:_<br/>
```
./nym-cli block current-height
```
A list of other Nym CLI commands and the example usage can be found [here](https://nymtech.net/docs/stable/nym-cli).

##### How to get account/Address balance to check there is enough coins to withdraw?

_Nyxd:_<br/>
Use the following command:
```
./nyxd query bank balances <address> --chain-id=nyx --gas=auto --gas-adjustment=1.4 --fees=7000unym
```

_Nym CLI:_<br/>
Use the following command:
```
./nym-cli account balance
```

##### How do I transfer tokens to another address? 

_Nyxd:_<br/>
```
./nyxd tx bank send [from_key_or_address] [to_address] [amount] --chain-id=nyx --gas=auto --gas-adjustment=1.4 --fees=7000unym
```
_NymCLI:_<br/>
```
./nym-cli account send TARGET_ADDRESS AMOUNT
```

##### Do the address support memo or destinationTag when doing the transfer?

Yes, it is supported.

### Nym Token

##### It is similar to the existing popular cryptocurrency, such as BTC, ETH, etc?

Nym’s cryptocurrency relates to its use within its incentivised mixnet; the mixnet makes use of Smart Contracts. You can read the [Smart Contracts section](https://nymtech.net/docs/stable/smart-contracts/overview/) of our docs on how they are used.


### RPC client

##### IS there a Java RPC client?

There is no java RPC client. The binary used for RPC calls is written in Go. A guide to setting up a RPC node for the Nyx blockchain can be found [here](https://nymtech.net/docs/stable/run-nym-nodes/nodes/rpc-node/).
