# Integrating with Nyx for payments

If you want to integrate with Nym in order to send `NYM` tokens (for instance, if running a `NYM` <-> `BTC` swap application, or using `NYM` for payments), then you will need to interact with the Nyx blockchain. 

Nyx, as outlined [elsewhere](https://nymtech.net/docs/stable/architecture/network-overview) in this documentation, is the blockchain supporting the Nym network, hosting both the `NYM` and `NYX` cryptocurrencies, the CosmWasm smart contracts keeping track of the network, and (coming soon) facilitating Coconut Credential generation. It is built with the [Cosmos SDK](https://tendermint.com/sdk/).

There are two ways you might wish to interact with the Nyx blockchain: the `nym-cli` tool, or the `nyxd` binary, which is the same binary used to create our validators. In the majority of cases, the `nym-cli` tool will be more than sufficient, and is easier to use than the `nyxd` binary. 

## Using the `nym-cli` tool

The `nym-cli` tool has its own documentation page, which can be found [here](/)

## Using the `nyxd` validator binary
The `nyxd` binary is a standard compilation of the Cosmos SDK `gaiad` binary compiled with the `wasmd` module enabled so we can use `cosmwasm` smart contracts. Make sure to check the [`gaiad`](https://hub.cosmos.network/main/hub-overview/overview.html) and [`cosmwasm`](https://docs.cosmwasm.com/docs/1.0/) documentation if you want to dig into functionality not covered by our own docs. 

It can be compiled by completing the 'Building your validator' step outlined in the [Validator](https://nymtech.net/docs/stable/run-nym-nodes/nodes/validators) documentation. 

For command help, run: 

```
./nyxd --help
```

## Recommended setup 

We recommend that users wanting to integrate with Nyx for cryptocurrency payments set up their own RPC Node, in order to be able to reliably query the blockchain and send transactions without having to worry about relying on 3rd party validators. 

The guide to setting up an RPC node can be found [here](https://nymtech.net/docs/stable/run-nym-nodes/nodes/rpc-node). 

