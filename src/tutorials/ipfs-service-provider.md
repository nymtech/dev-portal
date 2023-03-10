# Building a IPFS Service Provider 

This tutorial will focus on building an example Service Provider that utilizes IPFS for file uploads and downloads.We will then integrate Nym Websocket's into the solution in order to anonymize the packets we can send to and receive from it.Whether you're interested in building a IPFS Typescript application, or simply want to have more hands on experience with using Nym Websocket's as a developer, this tutorial will provide you with step-by-step instructions on to how to achieve just that.

> ⚠️ This tutorial will be a sequel to the previous tutorial ([Simple Service Provider](./simple-service-provider.md)) and will build upon the code that you'll end up with as a result of completing that tutorial. It is recommended that if you haven't checked out that tutorial, you should complete it before attempting this one. <br><br>Alternatively , you can visit the [repository](https://github.com/nymtech/developer-tutorials/tree/main/simple-service-provider-tutorial) of the Simple Service Provider and grab the code from there.

### What is IPFS?

[IPFS](https://ipfs.tech/) is a peer-to-peer file storage system that is globally distributed. Any computer can participate by utilizing the IPFS software , CLI or developer API's and can act as a host for storing and serving files. When a user uploads a file to the IPFS network, it becomes accessible to any other IPFS users around the world. You can learn more about IPFS and its features by referring to their documentation [here](https://docs.ipfs.tech/).

### Why use IPFS?

* Decentralized and Distributed: IPFS operates on a peer-to-peer network, offering increased reliability and stability compared to traditional client-server networks, where data is stored on a single server.

* Improved Performance: IPFS speeds up file transfers and reduces the load on a single server by breaking files into smaller pieces and distributing them across multiple nodes.

* Tamper-proof: IPFS employs cryptographic hash functions to prevent alteration of the contents of files stored on the network without detection.

