# Implementing Nym 

### Understanding Nym clients

A large proportion of the Nym mixnet's functionality is implemented client-side, including:

* Determining network topology - what mixnodes exist, what their keys are, etc.
* Registering with a gateway
* Authenticating to a gateway
* Receiving and decrypting messages from the gateway
* Creation of layer-encrypted Sphinx packets
* Sending Sphinx packets with real messages
* Sending Sphinx packet *cover traffic* when no real messages are being sent

Nym clients now all also support packet *retransmission*. What this means is that if a client sends 100 packets to a gateway, but only receives an acknowledgement ('ack') for 95 of them, it will resend those 5 packets to the gateway again, to make sure that all packets are received.

In the next few sections we will discuss how to integrate Nym clients into your apps.
### Types of Nym clients

At present, there are three Nym clients:

* The native (websocket) client
* The SOCKS5 client
* The wasm (webassembly) client

You need to choose which one you want incorporate into your app. Which one you use will depend largely on your preferred programming style and the purpose of your app.

#### Websocket client

The Nym Websocket client is a software tool that allows for communication between a user's device and a Nym mixnet node over a WebSocket connection. This client allows for secure, encrypted communication through the Nym network, enabling users to send and receive data in a private and anonymous manner. By utilizing the Websocket protocol, the Nym Websocket client provides real-time, bi-directional communication between the user and the Nym network.

For more information and guidance on how to implement the Nym Websocket client, please visit [here](https://nymtech.net/docs/stable/integrations/websocket-client).

#### SOCKS5 client

The Nym SOCKS5 client is a software tool that acts as a proxy between a user's device and the Internet. The client establishes a secure connection to a Nym mixnet node, and forwards the user's network traffic through this connection, providing privacy and anonymity for the user. By using the SOCKS5 protocol, the Nym SOCKS5 Client allows for applications that do not have built-in support for proxy connections to still benefit from the privacy and security offered by the Nym network. In simple terms, the Nym SOCKS5 client acts as a bridge between the user's device and the Internet, routing all traffic through the Nym network for added privacy and security.

For more information and guidance on how to implement the Nym SOCKS5 client, please visit [here](https://nymtech.net/docs/stable/integrations/socks5-client).

#### Webassembly client

The Nym WebAssembly (WASM) client is a software tool that runs in a user's web browser and allows for secure, encrypted communication with a Nym mixnet node. The WASM Client is implemented as a WebAssembly module, allowing it to run efficiently and natively within the user's browser, without the need for additional software installations. The Nym WASM Client provides a secure connection to the Nym network, allowing users to send and receive data in a private and anonymous manner while browsing the web. By utilizing WebAssembly, the Nym WASM client enables users to benefit from the privacy and security offered by the Nym network directly within their web browser, providing a convenient and user-friendly solution for online privacy and security.

For more information and guidance on how to implement the Nym Webassembly client, please visit [here](https://nymtech.net/docs/stable/integrations/wasm-client).

### Commonalities between clients

The Nym client packages offer similar functionality to privacy application developers. To maintain a persistent connection and be ready to receive messages from gateway nodes, they must run continuously. The packages involve registering and verifying with gateways and encrypting Sphinx packets for secure communication.

### Nym-Built Applications

#### NymConnect

[Nym Connect](/quickstart/nymconnect-gui.html) is a privacy-focused network layer for communication and data exchange, designed as a one-button GUI application that wraps around the `nym-socks5-client` to proxy application traffic through the Mixnet.


### Community-Built Applications

Discover a comprehensive list of community-built applications powered by Nym on our dedicated [Community Applications](/community-resources/community-applications.md) page.