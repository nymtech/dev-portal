# Integration FAQ

On this page, you'll find links and frequently asked questions on how to get started on integrating your project with Nym's Mixnet and its blockchain, Nyx.

## Links
### General Info 
* [Nym Website](https://nymtech.net/)
* [Nym Mixnet Explorer](https://explorer.nymtech.net/)
* [Nyx Block Explorer](https://nym.explorers.guru/)

### Codebase Info
* [Nym Platform Monorepo](https://github.com/nymtech/nym/)
* [Nym Project](https://github.com/nymtech/)

### Documentation Info
* [Documentation](https://nymtech.net/docs/) 
* Developer Portal - you are currently viewing the Developer Portal 

## Wallet Installation
The Nym wallet can be downloaded here. You can select your operating system and continue from there. You can find all the instructions related to setting up your Nym Wallet here: [https://nymtech.net/docs/stable/wallet](https://nymtech.net/docs/stable/wallet).

* What are the machine hardware requirements for Nym Wallet?
About 16GB of RAM had been recommended as a benchmark for the wallet. However you can expect its average memory usage of 100MB.

* What are the installation steps for installing Nym Wallet?
Follow the instructions in the link at the top of this section. If using Ubuntu, you will need to `chmod +X` the AppImage in your terminal before attempting to run it after downloading it.

If you want to compile the Wallet yourself as a developer, you can follow [these instructions](https://nymtech.net/docs/stable/wallet/) to achieve your desired result.

* What are the installation steps for interacting with Nyx Blockchain via `nyxd`?
To interact with the Nyx blockchain you have to use the `nyxd` binary. Instructions for compiling the binary can be found here: [https://nymtech.net/docs/stable/run-nym-nodes/nodes/rpc-node](https://nymtech.net/docs/stable/run-nym-nodes/nodes/rpc-node).

## Nyx blockchain RPC methods
### How can I use `JSON-RPC` methods to interact with the Nyx blockchain?
There are multiple ways to use `JSON-RPC` methods to interact with the Nyx blockchain. Which method you use will depend on the type of application you are integrating Nyx interactions into. 

1. the standalone `nyxd` binary, which is used for CLI wallets, RPC nodes, and validators. This binary is written in `Go`. Instructions on setting up the `nyxd` binary can be found [here](https://nymtech.net/docs/stable/run-nym-nodes/nodes/rpc-node).This is recommended for more complex commands. For full documentation check the [`gaiad documentation`]() **TODO ADD LINK** 

2. `cosmJS` **TODO** 

3. The `NymCLI` tool, a standalone rust binary which can be built and used according to the [docs](https://nymtech.net/docs/tools/nym-cli.html).It is a bit simpler to use than the `nyxd` binary, but is not recommended for complex queries, and not all commands are currently implemented.


### How do I generate an address/mnemonic for users to interact with?
**nyxd**
Use the following command, replacing `your_id` with the ID you want to use for your keypair eg:
```
./nyxd keys add your_id --chain-id=nyx --gas=auto --gas-adjustment=1.4 --fees=7000unym
```

**NymCLI**
```
./nym-cli account create
```

Both methods will generate a keypair and log the mnemonic.

### How to get block information like block height, block hash, block time as so on from the genesis block? 
**nyxd**
You would use one of the subcommands returned by this command:
```
./nyxd query tx --chain-id=nyx --gas=auto --gas-adjustment=1.4 --fees=7000unym
```

**NymCLI**
```
./nym-cli block current-height
```
A list of other Nym CLI commands and the example usage can be found [here](https://nymtech.net/docs/stable/nym-cli).

### How to get account/address balance to check there is enough coins to withdraw?
**nyxd**
```
./nyxd query bank balances <address> --chain-id=nyx --gas=auto --gas-adjustment=1.4 --fees=7000unym
```

**NymCLI**
```
./nym-cli account balance
```

### How do I transfer tokens to another address? 
**nyxd**
```
./nyxd tx bank send [from_key_or_address] [to_address] [amount] --chain-id=nyx --gas=auto --gas-adjustment=1.4 --fees=7000unym
```
**NymCLI**
```
./nym-cli account send TARGET_ADDRESS AMOUNT
```

### Does the address support the inclusion of a `memo` or `destinationTag` when doing the transfer?
Yes, it is supported.

## Nym Token 
**TODO** 

* It is similar to the existing popular cryptocurrency, such as BTC, ETH, etc?

Nym’s cryptocurrency relates to its use within its incentivised mixnet; the mixnet makes use of Smart Contracts. You can read the [Smart Contracts section](https://nymtech.net/docs/stable/smart-contracts/overview/) of our docs on how they are used.

## Nym mixnet integration 

**TODO** 