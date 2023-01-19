# SOCKS Proxy (CLI)
 
>The `socks5` client now also supports SOCKS4 and SOCKS4A protocols as well as SOCKS5.

The Nym socks5 client allows you to proxy traffic from a desktop application through the mixnet, meaning you can send and receive information from remote application servers without leaking metadata which can be used to deanonymise you, even if you're using an encrypted application such as Signal. 

### Download or compile socks5 client 

If you are using OSX or a Debian-based operating system, you can download the `nym-socks5-client` binary from our [Github releases page](https://github.com/nymtech/nym/releases).

If you are using a different operating system, head over to the [Building Nym]() page for instructions on how to build the repository from source. 

### Initialise your socks5 client 

Use the following command to initialise your socks5 client with the address of a Nym-operated [Network Requester]() as a provider (the endpoint that will be proxying your traffic out of the mixnet) for ease: 

```
./nym-socks5-client init --id quickstart --provider 74cfBD1hkozPUrhcZksrwHucq2Hkn6f2S5LBcnDSPa6L.4QsA5Epmf1fhrnKPNPs545QiLmwpLGRk4oZ7z136PD6L@EEyq16v63aotPBCepxUpCgAojrNasZ6Hk1PjpRyBAdEp 
```

### Start your socks5 client 

Now your client is initialised, start it with the following: 

```
./nym-socks5-client run --id quickstart
```

### Proxying traffic

After completing the steps above, your local socks5 Client will be listening on `localhost:1080` ready to proxy traffic to the Network Requester set as the `--provider` when initialising. 

When trying to connect your app, generally the proxy settings are found in `settings->advanced` or `settings->connection`. 

Here is an example of setting the proxy connecting in Blockstream Green:

![Blockstream Green settings](/images/blockstream-green.gif)

Most wallets and other applications will work basically the same way: find the network proxy settings, enter the proxy url (host: **localhost**, port: **1080**).

In some other applications, this might be written as **localhost:1080** if there's only one proxy entry field.

## Further reading 

If you want to dig more into the architecture and use of the socks5 client check out its documentation [here]().