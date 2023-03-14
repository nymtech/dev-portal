# Modifying Your Service Provider Code

Ensure that you're viewing your `index.ts` file within your `service-provider` folder. Like our `user-client`, our code modifications will be made here.

## Adding our new imports and variables.

At the top of our file, add in the following code

```typescript
import WebSocket, { MessageEvent } from "ws"; 
import { create } from 'ipfs-core' <--- Add Line
import fetch from 'node-fetch'; <--- Add Line

var ourAddress: string;
var websocketConnection: any;

var ipfsNode: any; <--- Add Line
var ipfsVersion: any; <--- Add Line

```
* `ipfs-core` - A great tool for javascript developers, [IPFS Core](https://www.npmjs.com/package/ipfs-core). It contains all you need to integrate IPFS into your application. In a nutshell, it simplifies the development process and reduces the amount of boilerplate code needed to interact with the IPFS network, as well as reducing the amount of components needed that would be normally required when building traditional IPFS applications.

* `node-fetch` - We import [node-fetch](https://www.npmjs.com/package/node-fetch) to parse the base64-encoded representation of the file data that we send to this Service Provider , converting it to a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) that we then upload to IPFS. You'll see how this is implemented further down on this page.

* `ipfsNode` - This global variable will store the data returned by the `create()` function of the `ipfs-core` library. It returns a Promise that resolves to an IPFS node object, the key component needed in order to interact with the IPFS Network.

* `ipfsVersion` - This value will hold the string value of the IPFS version that we are currently on. We will display this within our `service-providers` console output.

## Modifying our `main()` function.

Subsequently , we will be initializing our `ipfsNode` & `ipfsVersion` variables on starting up the application. Add the following lines at the bottom of your main function below.

```typescript
async function main() {
  var port = '1978' 
  var localClientUrl = "ws://127.0.0.1:" + port;

  // Set up and handle websocket connection to our desktop client.
  websocketConnection = await connectWebsocket(localClientUrl).then(function (c) {
      return c;
  }).catch(function (err) {
      console.log("Websocket connection error. Is the client running with <pre>--connection-type WebSocket</pre> on port " + port + "?");
      console.log(err);
  })

  websocketConnection.onmessage = function (e : any) {
      handleResponse(e);
  };

  sendSelfAddressRequest();

  ipfsNode = await create(); <--- Add line
  ipfsVersion = await ipfsNode.version(); <--- Add line

  console.log('IPFS Version:', ipfsVersion.version); <--- Add line
}
```

## Modifying our `handleResponse()` function.

```typescript
function handleResponse(responseMessageEvent : MessageEvent) {
  try {
      let response = JSON.parse(responseMessageEvent.data.toString());
      if (response.type == "error") {
        console.log("\x1b[91mAn error occured: " + response.message + "\x1b[0m")
      } else if (response.type == "selfAddress") {
        ourAddress = response.address;
        console.log("\x1b[94mOur address is: " + ourAddress + "\x1b[0m")
      } else if (response.type == "received") {
        let messageContent = JSON.parse(response.message)

        //Insert this if statement in the download implementation of the tutorial
        if(messageContent.fileCid){
            console.log('\x1b[93mRecieved download request: \x1b[0m');
            console.log('\x1b[92mFile hash : ' + messageContent.fileCid + '\x1b[0m');
            getAndSendBackDownloadableFile(messageContent.fileCid,messageContent.fileName,messageContent.fileType,response.senderTag);
        } else {
            console.log('\x1b[93mRecieved : \x1b[0m');
            console.log('\x1b[92mName : ' + messageContent.name + '\x1b[0m');

            /* Remove this code.

            console.log('\x1b[92mComment : ' + messageContent.comment + '\x1b[0m');
            console.log('\x1b[93mSending response back to client... \x1b[0m')
	        sendMessageToMixnet(response.senderTag)

            */

            console.log('\x1b[92mLast Modified : ' + messageContent.lastModifiedDate + '\x1b[0m');
            console.log('\x1b[92mType : ' + messageContent.type + '\x1b[0m');
            console.log('\x1b[92mSize : ' + readFileSize(messageContent.size) + '\x1b[0m');
            console.log('\x1b[93mUploading file to IPFS... \x1b[0m');
            uploadToIPFS(messageContent,response.senderTag);
        }
      }
  } catch (_) {
        console.log('something went wrong in handleResponse');
  }
}

```
Above , we have modified our `console.log` statements in order to fit the incoming file data that we want to try and upload. We then want to call our new function `uploadToIPFS` which we will implement in a following section on this page. Before we do that, we should implement a helper function, `readFileSize()` that can translate the `size` value our `messageContent` object holds.

## Modifying our `readFileSize()` function.

We intake the amount of bytes (as a long number value) as a parameter our function. The logic as seen below calculates the file size in a human-readable format (e.g. 1.23 MB) and returns it as a string. 

```typescript

function readFileSize(bytes : number, si=false, dp=1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si 
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return bytes.toFixed(dp) + ' ' + units[u];
}

```

## Implementing our `uploadToIPFS()` function.

```typescript
async function uploadToIPFS(dataToUpload : any,senderTag : string){
  let fileContent;

  const blob = await fetch(dataToUpload.dataUrl).then((response: { blob: () => any; }) => response.blob());
  fileContent = await blob.arrayBuffer();

  const file = await ipfsNode.add({
    path: dataToUpload.name,
    content: fileContent
  })

  console.log('Added file:', file.path, file.cid.toString());

  // We add type param once we move onto the implement download section
  sendMessageToMixnet(file.path,file.cid.toString(),dataToUpload.type,senderTag);
}
```
* `fileContent` - A variable to store our file data which we will upload to the IPFS network.

* `blob` - As we mentioned earlier, we want to convert our received base64-encoded representation of the file data from our `user-client` to a Blob. We then use the Blobs member function, `arrayBuffer()` to get the files contents which we then store inside our `fileContent`variable.

* `ipfsNode.add()` - The simple, quick and easy function we utilize from the `ipfs-core` library. We pass an object that includes our `fileContent` straight into the functions parameters, along with specifying a path which we can get directly from our `dataToUpload` object we passed into the our `uploadToIPFS()` in the first place.

We then log the output uploaded files information in our Service Providers console, which includes the files hash (`cid`) that IPFS assigns to it. We then pass this hash into our `sendMessageToMixnet()` function, along with the uploaded files path and type. We will , of course , need to modify our `sendMessageToMixnet()` to process these parameters.

## Modifying our `sendMessageToMixnet()` function.

As we can see in our previous function, our `sendMessageToMixnet()` takes in new parameters. Add the `path`,`cid` and `type` parameters into the declaration as seen below.

```typescript
function sendMessageToMixnet(path: string,cid: string,type : string,senderTag: string) { <--- Adjust parameters

  /* Remove this code

  const messageContentToSend = {
    text: 'We recieved your request - this reply sent to you anonymously with SURBs',
    fromAddress : ourAddress
  }

  */

  // Place each of the form values into a single object to be sent.
  const messageContentToSend = {
      text: 'We recieved your request - this reply sent to you anonymously with SURBs',
      fromAddress : ourAddress,
      filePath : path,
      fileCid : cid,
      fileType : type
  }
  
  const message = {
      type: "reply",
      message: JSON.stringify(messageContentToSend),
      senderTag: senderTag
  }
  
  // Send our message object via out via our websocket connection.
  websocketConnection.send(JSON.stringify(message));
}
```

All we are doing here is adding the uploaded files information into the `messageContentToSend` object which will then get passed to our websocket. Our `user-client` will receive this message as a [SURB](https://nymtech.net/docs/architecture/traffic-flow.html#private-replies-using-surbs) since we are still passing our senderTag into our `message` object.

## Connecting to your Nym Client and Starting the application

As previously stated , you can follow instructions in the [Nym websocket client documentation](https://nymtech.net/docs/clients/websocket-client.html#initialising-your-client) to `init` and `run` a `nym-client`.

```admonish caution title=""
Remember to `init` and `run` this client using port `1978` to avoid port clashes by using `--port 1978` parameter. 
```
Lets go ahead and start our application. In your terminal opened up in the `service-provider` directory , run the following command:

```
npm run start:dev
```
You should see a successful response, including a Nym address, in your console: 

```
> service-provider@1.0.0 start:dev
> nodemon ts-node-esm src/index.ts

[nodemon] 2.0.21
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: ts,js
[nodemon] starting `ts-node ./src/index.ts ts-node-esm src/index.ts`
connecting to Mixnet Websocket (Nym Client)...
Our address is: FR2dKwFTFDPN1DSBUehbWea5RXTEf2tQGUz1L7RsxGHT.QndBs9qMtNH5s3RXmnP96FgzAeFV6nwLNB6hrGGvUN2@62F81C9GrHDRja9WCqozemRFSzFPMecY85MbGwn6efve
Swarm listening on /ip4/127.0.0.1/tcp/4002/p2p/12D3KooWQRkSBTHy5PxoNhHH3duSn13DVttQno9K8pfas6QZfv2C
Swarm listening on /ip4/192.168.178.56/tcp/4002/p2p/12D3KooWQRkSBTHy5PxoNhHH3duSn13DVttQno9K8pfas6QZfv2C
Swarm listening on /ip4/127.0.0.1/tcp/4003/ws/p2p/12D3KooWQRkSBTHy5PxoNhHH3duSn13DVttQno9K8pfas6QZfv2C
IPFS Version: 0.16.1
```

## Set Service Address in User Client
The final step of this tutorial is to update our User Client code with the address of the now-running Service Provider so it can send it a message.  

Copy the SP's Nym address from your console and set it as the value of the `targetAddress` variable of the `index.ts` file back inside our `user-client` folder.

```typescript
var targetAddress: string = 'FR2dKwFTFDPN1DSBUehbWea5RXTEf2tQGUz1L7RsxGHT.QndBs9qMtNH5s3RXmnP96FgzAeFV6nwLNB6hrGGvUN2@62F81C9GrHDRja9WCqozemRFSzFPMecY85MbGwn6efve';
```















