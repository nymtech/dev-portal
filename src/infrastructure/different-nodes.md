# Different Types of Nodes

Discover the intricate workings of Nym's privacy-enhancing mixnet infrastructure through our informative video, where we break down the different types of nodes and how they each play a crucial role in ensuring secure and anonymous communication.

<iframe width="700" height="400" src="https://www.youtube.com/embed/rnPpEsJS4FM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### Mixnet Infrastructure

There are few types of Nym infrastructure nodes:

#### Mix Nodes

Mix nodes play a critical role in the Nym network by providing enhanced security and privacy to network content and metadata. They are part of the three-layer mixnet that ensures that communication remains anonymous and untraceable. Mix nodes receive `NYM` tokens as compensation for their quality of service, which is measured by the network validators.

Mix nodes anonymously relay encrypted Sphinx packets between each other, adding an extra layer of protection by reordering and delaying the packets before forwarding them to the intended recipient. Additionally, cover traffic is maintained through mix nodes sending Sphinx packets to other mix nodes, making it appear as if there is a constant flow of user messages and further protecting the privacy of legitimate data packets.

With the ability to hide, reorder and add a delay to network traffic, mix nodes make it difficult for attackers to perform time-based correlation attacks and deanonymize users. By consistently delivering high-quality service, mix nodes are rewarded with NYM tokens, reinforcing the integrity of the Nym network.

### Gateways

Gateways serve as the point of entry for user data into the mixnet, verifying that users have acquired sufficient NYM-based bandwidth credentials before allowing encrypted packets to be forwarded to mixnodes. They are also responsible for safeguarding against denial of service attacks and act as a message storage for users who may go offline.

Gateways receive bandwidth credentials from users, which are periodically redeemed for `NYM` tokens as payment for their services. Users have the flexibility to choose a single gateway, split traffic across multiple gateways, run their own gateways, or a combination of these options.

In addition, gateways also cache messages, functioning as an inbox for users who are offline. By providing secure, reliable access to the mixnet and ensuring that data remains protected, gateways play a crucial role in maintaining the integrity of the Nym network.

### Validators

Validators are essential to the security and integrity of the Nym network, tasked with several key responsibilities. They utilize proof-of-stake Sybil defense measures to secure the network and determine which nodes are included within it. Through their collaborative efforts, validators create Coconut threshold credentials which provide anonymous access to network data and resources.

Validators also play a critical role in maintaining the Nym Cosmos blockchain, a secure, public ledger that records network-wide information such as node public information and keys, network configuration parameters, CosmWasm smart contracts, and `NYM` and credential transactions.


