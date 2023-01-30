# Mixnet Traffic Flow

### Technical Motivations

When you send data across the internet, it can be recorded by a wide range of observers: your ISP, internet infrastructure providers, large tech companies, and governments.

Even if the content of a network request is encrypted, observers can still see that data was transmitted, its size, frequency of transmission, and gather metadata from unencrypted parts of the data (such as IP routing information). Adversaries may then combine all the leaked information to probabilistically de-anonymize users.

The Nym mixnet provides very strong security guarantees against this sort of surveillance. It *packetizes* and *mixes* together IP traffic from many users inside the mixnet.

>For those who enjoy comparisons, Nym mixnet shares similarities with systems like Tor but offers enhanced defense against end-to-end timing attacks that can compromise user anonymity. When Tor was initially introduced in 2002, these types of attacks were considered futuristic. However, that future is now a reality.

### Mixnet Traffic Flow

The Nym mixnet re-orders encrypted, indistinguishable [Sphinx](https://cypherpunks.ca/~iang/pubs/Sphinx_Oakland09.pdf) packets as they travel through the gateways and mix nodes.

Traffic to send through the mixnet is broken up into uniformly-sized packets, encrypted in the Sphinx packet format according to the route the packet will take, and sent through the mixnet to be mixed among other real traffic and fake - but identical - 'dummy traffic'.

At each 'hop' (i.e. as a packet is forwarded from one node in the sequence to another) a layer of decryption is removed from the Sphinx packet, revealing the address of the next hop, and another Sphinx packet. The packet is then held by the node for a variable amount of time, before being forwarded on to the next node in the route.

>For more information on this, check out the [Loopix](https://nymtech.net/docs/stable/architecture/loopix/) design document on the next page.

Traffic always travels through the nodes of the mixnet like such:

<img src="/images/traffic-flow-dark.png"/>

From your Nym client, your encrypted traffic is sent to:
* The gateway your client has registered with,  
* A mix node on Layer 1 of the Mixnet, 
* A mix node on Layer 2 of the Mixnet,
* A mix node on Layer 3 of the Mixnet, 
* The recipient's gateway, which forwards it finally to...
* The recipient's Nym client, which communicates with an application.

> ⚠️ If the recipient's Nym client is offline at the time then the packets will be held by the Gateway their Nym client has registered with until they come online.

Whatever is on the 'other side' of the mixnet from your client, all traffic will travel this way through the mixnet. If you are sending traffic to a service external to Nym (such as a chat application's servers) then your traffic will be sent from the recieving Nym client to an application that will proxy it 'out' of the mixnet to these servers, shielding your metadata from them. P2P (peer-to-peer) applications, unlike the majority of apps, might want to keep all of their traffic entirely 'within' the mixnet, as they don't have to necessarily make outbound network requests to application servers. They would simply have their local application code communicate with their Nym clients, and not forward traffic anywhere 'outside' of the mixnet.

### Acks

Whenever a hop is completed, the recieving node will send back an acknowledgement ('ack') so that the sending node knows that the packet was recieved. If it does not recieve an ack after sending, it will resend the packet, as it assumes that the packet was dropped for some reason.

This is done 'under the hood' by the binaries themselves, and is never something that developers and node operators have to worry about dealing with themselves.

### Private Replies using SURBs

SURBs ('Single Use Reply Blocks') allow apps to reply to other apps anonymously.

It will often be the case that a client app wants to interact with a service of some kind, or a P2P application on someone else's machine. It sort of defeats the purpose of the whole system if your client app needs to reveal its own gateway public key and client public key in order to get a response from the service/app.

Luckily, SURBs allow for anonymous replies. A SURB is a layer encrypted set of Sphinx headers detailing a reply path ending in the original app's address. SURBs are encrypted by the client, so the recieving service/app can attach its response and send back the resulting Sphinx packet, but it never has sight of who it is replying to.

MultiSURBs were implemented in `v1.1.7`. Clients, when sending a message to another client, attach a bundle of SURBs which can be used by the receiver to construct large anonymous replies, such as files. If a reply is too large still (i.e. it would use more SURBs than sent with the original message), the receiver will use a SURB to ask the sender for more SURBs.

What this means in practice is that files can now be sent via anonymous replies.

> ⚠️ Please note that the `nym-socks5-client` currently does not have multiSURBs enabled by default to allow for a non-breaking network update, allowing network requesters to update to `v1.1.7`.