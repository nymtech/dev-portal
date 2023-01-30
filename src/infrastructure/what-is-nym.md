# What is Nym?

Nym is a privacy platform. It provides strong network-level privacy against sophisticated end-to-end attackers, and anonymous access control using blinded, re-randomizable, decentralized credentials. Our goal is to allow developers to build new applications, or upgrade existing apps, with privacy features unavailable in other systems.

The Nym platform knits together several privacy technologies, integrating them into a system of cooperating networked nodes.

At a high level, our technologies include:

1) A mixnet, which encrypts and mixes Sphinx packet traffic so that it cannot be determined who is communicating with whom. Our mixnet is based on a modified version of the Loopix design.

2) A privacy enhancing signature scheme called Coconut. Coconut allows a shift in thinking about resource access control, from an identity-based paradigm based on who you are to a privacy-preserving paradigm based on right to use.

3) Sphinx, a way of transmitting armoured, layer-encrypted information packets which are indistinguishable from each other at a binary level.

4) The Nyx blockchain, a general-purpose CosmWasm-enabled smart contract platform, and the home of the smart contracts which keep track of the mixnet.
The most important thing to note is that these technologies ensure privacy at two different levels of the stack: network data transmission, and transactions.

Our technology ensures privacy at two different levels of the stack: network data transmission, and transactions.

### Power of a Mixnet: An overlay network for network level traffic privacy

Our mixnet design is based on the [Loopix Anonymity System](https://arxiv.org/abs/1703.00536), somewhat modified to provide better quality of service guarantees.

In this brief video, our Head of Research and creator of the Loopix mixnet paper, Ania Piotrowska, delves into the design of the Loopix mixnet in depth at USENix 2017.

<iframe width="700" height="400" src="https://www.youtube.com/embed/R-yEqLX_UvI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

The Nym mixnet effectively addresses privacy concerns by utilizing network nodes to mix messages, making them unidentifiable to adversaries. Each packet is layer encrypted, and binary-padded so that it's indistinguishable from all other packets. Incoming packets are "mixed" with all other messages inside the node. That is, the node strips one layer of packet encryption, and adds a small random transmission delay, so that messages are not emitted in the same order as which they arrived.

Next, the message is sent to another mix node, decrypted and mixed again, then to a third mixnode for further mixing. Finally, the message is delivered to its destination gateway.

As long as there's enough traffic flowing through the nodes, even an adversary who can record the whole internet will not be able to trace the packet flow through the system.

The Nym mixnet mitigates against packet-dropping attacks by malicious nodes, and ensures quality-of-service, via loop traffic. Clients send messages which loop back to themselves. This allows clients to assure themselves that messages are being delivered properly. It also provides cover traffic to ensure that enough messages are going through the system to provide privacy.

Privacy Enhanced Applications (PEAPs) that need to defend against network-level monitoring can utilize the Nym mixnet to protect against network-level surveillance.

The end result is that adversaries are unable to monitor Privacy Enhanced Applications (PEAPs) using Nym even if they can record all internet traffic. The adversary can tell that a user's PEAP has connected to the mixnet; beyond that, it's impossible to say whether they are doing encrypted chat, file transfer, or interacting with another PEAP.

### Revolutionising Privacy: The Incentivized Mixnet, A First of Its Kind

Nym is a pioneering mixnet solution that sets itself apart from other mixnets by being incentivized. This unique approach rewards network participants for providing privacy-enhancing services to users, leading to a more secure and efficient network. The incentivized structure of Nym ensures that nodes are motivated to provide top-notch performance and robust security, as they are financially rewarded for doing so. 

Nym sets itself apart from other privacy-focused networks by implementing a unique incentivization model. This incentivization model is built around the `NYM` token, which is used to pay for services on the network and reward participants who contribute to the network's security and functionality. This creates a system where the network is self-sustaining and the incentives of all participants are aligned towards maintaining the privacy and security of the network. This incentivization model is what makes Nym the first of its kind as an incentivized mixnet, making it a highly innovative and secure solution for privacy-focused applications.

### ELI5 Understanding of the Implications of Nym

Nym is a type of technology that is designed to keep your online activities private. Essentially, it helps hide your data from anyone who might be trying to spy on you, such as hackers or government agencies. The way Nym works is by "mixing" your data with other users' data, making it much more difficult for anyone to single out and track just your information. 

This system is unique because it provides an incentive for people to participate and help improve the network, making it stronger and more secure for everyone. By breaking down Nym and understanding its implications, you can see why it's an important tool for anyone who values their privacy online.
