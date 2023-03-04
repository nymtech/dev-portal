# Building a Image Upload Service Provider with IPFS.

In this guide, developers will be able to observe how using Nym Websocket Client can be utilized to create a Service Provider that will be able to receive data from a Client, perform a requested operation and then return the results of that operation back to the client.


#### What are we building?

In this tutorial, you will learn how to build a client that allows a user to upload an image to the browser and send it through the mixnet, via our Websocket Client. 

You'll also then learn how to create a typescript Service Provider, which will receive the image that our client sent. The Service Provider will then upload that image to IPFS and return the results of that back to the client.

We will be building:
- A TypeScript client for uploading images to be passed to a WebSocket client and sent through the mixnet.
- An Angular TypeScript service provider that can receive images from the client and upload them to IPFS via a built-in js-ipfs node. The service provider will then return the URL of the uploaded file to the client.
- We will also refresh our knowledge of using the WebSocket clients that we used in the previous tutorial.

> ⚠️ Service providers are usually run on remote servers to keep metadata private, but for demonstration purposes, this tutorial will show how to run it on a local machine using looped messages through the Nym Mixnet.

<img src="../images/ifps-sp-image.png"/>

We'll dive into the process of creating a Typescript application in a similar process to how we have done previously. We will then also utilise a pre-built Angular Typescript codebase that includes a packaged IPFS node provided by the [IPFS Examples repository](https://github.com/ipfs-examples) repository. Each application will have its own Nym Websocket Client to append their images or messages to, which we will also configure.

To assist in your learning, the complete code for this tutorial is available on [Github](https://github.com/nymtech/developer-tutorials). You can use it as a reference while building or simply download it and follow along as you progress through the tutorial.

#### What do we want to achieve?

We are looking to create a a method of sending image data anonymously to a Service Provider, which will then upload our image to the [IPFS (InterPlanetary File System) ](https://ipfs.tech/). We want the URL of the image we uploaded to IPFS to be returned to our User Client. We also want a manual way of uploading files to IPFS directly from the service provider itself so that we can clearly separate IPFS and Mixnet logic if we need to debug our application and determine whether IPFS or the Nym Websocket Clients have failed.

#### What is IPFS?

IPFS is a peer-to-peer file storage system that is globally distributed. Any computer can participate by downloading the IPFS software and acting as a host for storing and serving files. When a user uploads a file to the IPFS network, it becomes accessible to any other IPFS user around the world. This feature allows developers to integrate its API features into the applications they are developing. You can learn more about IPFS and its features by referring to their documentation [here](https://js.ipfs.tech/).

#### Why use IPFS?
- Decentralised and Distributed: IPFS operates on a peer-to-peer network, offering increased reliability and stability compared to traditional client-server networks, where data is stored on a single server.
- Improved Performance: IPFS speeds up file transfers and reduces the load on a single server by breaking files into smaller pieces and distributing them across multiple nodes.
- Tamper-proof: IPFS employs cryptographic hash functions to prevent alteration of the contents of files stored on the network without detection.

### Prerequisites
* `node` & `npm` 
* `Typescript` 


#### Preparing your TypeScript environment 

- Make a new directory called `ipfs-upload-service-tutorial` and inside it create another folder named `user-client`.

- Also create an `/assets` folder in the root directory. Inside, create a `/styles` folder with a `styles.css` file and a `images`


Continue to then do the following:

1.  `path/to/the/user-client` folder you created, and run:

    ```
    npm init
    ```
Continue just press enter after each prompt to confirm the configuration.

<details>
    <summary>Console Output</summary>
       
        This utility will walk you through creating a `package.json` file.
        It only covers the most common items, and tries to guess sensible defaults.

        See `npm help init` for definitive documentation on these fields
        and exactly what they do.

        Use `npm install <pkg>` afterwards to install a package and
        save it as a dependency in the package.json file.

        Press ^C at any time to quit.
        package name: (user-client)
        version: (1.0.0)
        description:
        entry point: (index.js)
        test command:
        git repository: 
        keywords:
        author: 
        license: (ISC) 
        About to write to path/to/directory/user-client/package.json:

        {
            "name": "user-client",
            "version": "1.0.0",
            "description": "",
            "main": "index.js",
            "scripts": {
                "test": "echo \"Error: no test specified\" && exit 1"
            },
            "author": "",
            "license": "ISC"
        }

        Is this OK? (yes) 
</details>

A `package.json` file has been created in the folder.

2. Then in the same terminal, run:

```
npm install typescript
```
After the installation has been completed, check to see that the typescript dependencies have been added. The `package.json` file should look like this:

    {
        "name": "user-client",
        "version": "1.0.0",
        "description": "",
        "main": "index.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "author": "",
        "license": "ISC",
        "dependencies": {
            "typescript": "^4.9.3"
        }
    }
    

3. Now run in your terminal:
    
```
npm install ts-node --save-dev
```
The package (`ts-node`) allows us to build a typescript application in a node environment.

4. Create a new file in the `user-client` folder called `tsconfig.json`. Paste the following code into the file:

```
{
    "compilerOptions": {
        "module": "commonjs",
        "esModuleInterop": true,
        "target": "es6",
        "moduleResolution": "node",
        "sourceMap": true,
        "outDir": "dist"
    },
    "lib": ["es2015"]
}
```

#### Bundling the Application

To build and run our application locally, we require a tool that allows us to work on it while it's running and instantly reflects saved changes on the browser.

1. This can be achieved through the installation of Parcel bundler using the following command in your terminal window:

```
npm install --global parcel-bundler
```

After completing the installation process, start by creating a `src` folder within the `user-client` folder. Within this `src` folder, create two new files:
* `index.html` 
* `index.ts`


 2. Paste the following the `index.html`:
    
    ```
    <!DOCTYPE html>
    <html>
        <head>
            <title>App Test</title>
            <meta charset="utf-8"/>
        </head>
        <body>
            <h1>Test</h1>
            <div id="app"></div>
            <script src="index.ts"></script>
        </body>
    </html>

    ```

    And in the `index.ts`:

    ```
    console.log('test log')
    ```

This will ensure that our TypeScript file is functional when the application is launched in the browser.
    
3. Navigate to the `package.json` file and in the `"scripts"` array, add the following above `"test"`:

```
"start": "parcel src/index.html"
```

Now back in our terminal , run `npm start`.

<img src="../images/tutorial_image_1.png"/>

Open your browser at [localhost:1234](http://localhost:1234/). 

Your web application is now up and running with `Test` displayed on the browser window.

Checking the `console.log` output is done by right-clicking on the browser and selecting __Inspect__, then navigating to the __Console__ section of the resulting panel. You should see the message `test log` displayed there.


### Building the User Client

1. Replace the existing content of the `index.ts` file in the `user-client` folder with this function:

```
    async function main() {
        var port = '1977' 
        var localClientUrl = "ws://127.0.0.1:" + port;
        
        websocketConnection = await connectWebsocket(localClientUrl).then(function (c) {
            return c;
        }).catch(function (err) {
            displayClientMessage("Websocket connection error. Is the client running with <pre>--connection-type WebSocket</pre> on port " + port + "?");
        })

        websocketConnection.onmessage = function (e) {
            handleResponse(e);
        };
        
        sendSelfAddressRequest();
        
        fileInput.addEventListener('change', onFileChange, false);
    }

    function connectWebsocket(url) {
        return new Promise(function (resolve, reject) {
            var server = new WebSocket(url);
            console.log('connecting to Websocket Server (Nym Client)...')
            server.onopen = function () {
                resolve(server);
            };
            server.onerror = function (err) {
                reject(err);
            };
        });
    }

    main();
```

* `main()` - This first function will hold the majority of the logic and initiate the connection with the Nym Websocket Client. It's best to declare it at the start of the file and call it at the end to run when launching the application.

* `connectWebsocket(url)` - In this function, we return a Promise that tries to set up a websocket connection to the url we provide as a parameter. If the connection is successful, we will get a notification in our application and websocket client. If it fails, we'll receive an error in our app.

2. Above our `main()` function, add the following code:

```
var ourAddress : string;

var targetAddress: string = '';

WebsocketConnection: any;

var selectedPayload: any;

const fileInput = document.querySelector('#fileInput')
```
These variables are the main global variables of our application.

* `ourAddress` - Automatically filled in upon receipt of a reply from the Nym Websocket client's initialization.

* `targetAddress` - A manually set parameter for the Service Provider's Nym client.

* `websocketConnection` - Populated upon a successful response from our Promise within the `connectWebsocket()` function.

* `fileInput` - For storing the value of an input element that's added to the `index.html`. We then attach an `EventListener` that will trigger a function called `onFileChange` when a file change is detected by the browser, such as when a file is selected from the device's file explorer.

3. Currently the `sendSelfAddressRequest()` has not been defined. Add the following under between the `main()` and `displayClientMessage()` functions:

```
    function sendSelfAddressRequest() {
        var selfAddress = {
            type: "selfAddress"
        }
        displayJsonSend(selfAddress);
        websocketConnection.send(JSON.stringify(selfAddress));
    }

```
* `sendSelfAddressRequest()` - Function that retrieves the websocket address and displays it on the browser's UI after connecting to the websocket.

4. Add the following under the `connectWebsocket(url)`function:

```
function onFileChange(){
    selectedPayload = document.getElementById('fileInput').files[0];
    var reader = new FileReader();
    reader.readAsDataURL(document.getElementById('fileInput').files[0]);
    reader.addEventListener('load', readAndSendFile);
}

function readAndSendFile(event) {
    let blobResult = event.target.result
    sendMessageToMixnet(blobResult);
}
```

* `onFileChange()` - Whenever the user selects a file it sets it as selectedPayload which reads the file as a data URL using FileReader, therefore triggering the `readAndSendFile` function once the file has been successfully read.

* `readAndSendFile(event)` - Triggered by the `FileReader` load event and sends the contents of the file (stored in `event.target.result` as `blobResult`) using the `sendMessage` function.

5. Underneath the `sendSelfAddressRequest()` function, add the following:

```
function sendMessageToMixnet(payload) {
    
    var messageContentToSend  = {
         lastModified: selectedPayload.lastModified,
         lastModifiedDate: selectedPayload.lastModifiedDate,
         name: selectedPayload.name,
         size: selectedPayload.size,
         type: selectedPayload.type,
         dataUrl: payload
    };  
    
    const message = {
        type: "send",
        message: JSON.stringify(messageContentToSend),
        recipient: targetAddress,
        withReplySurb: false,
    }
    
    displayJsonSend(message);
    
    websocketConnection.send(JSON.stringify(message));
}

function handleResponse(resp) {
    try {
        let response = JSON.parse(resp.data);
        if (response.type == "error") {
            displayJsonReceived("Server responded with error: " + response.message);
        } else if (response.type == "selfAddress") {
            displayJsonReceived(response);
            ourAddress = response.address;
            console.log(ourAddress)
            displayClientMessage("Our address is:  " + ourAddress + ", we will now send messages to ourself.");
        } else if (response.type == "received") {
            handleReceivedMessage(response)
        }
    } catch (_) {
        displayJsonReceived(resp.data)
    }
}
```
> For guide consistency, we will convert our message to a string format before transmission. Before sending the image over the mixnet, we will first send the Blob (base64) value of the image to our service provider. The length of the Blob value increases with the size of the image, but it is necessary to send it to IPFS so that it can process the data. We can then retrieve the resulting IPFS URL from that operation, which we eventually want to obtain.

* `sendMessageToMixnet()` - The key function that will allow our Service Provider messages to receive messages. Firstly, it will gets the values from a form in the `index.html` and assign them to local variables within the function, inserting the local variables into one object to be sent to the mixnet. Secondly, calling the `displayJsonSend()` function to render the sent message on to the UI. Lastly, the `websocketConnection` global variable will send our message to the websocket. 

* `handleResponse()` - Responsible for sorting messages it receives from the mixnet based on the `type` property of the response. It then invokes the appropriate function that the data requires.

At this point, we have some more functions that we need to write as indicated by our new functions. Underneath our new code, type or paste the following:

6. Next, implement the functions that will handle DOM (Document Object Model) manipulation allowing the alteration of the UI depending on our interaction with the application. 

Before the `main()` declaration at the end of the file, add the following:

```
    function displayClientMessage(message) {
        document.getElementById("output").innerHTML += "<p>" + message + "</p >";
    }

    function handleReceivedMessage(message) {
        const stringifiedMessage = message.message
        displayJsonReceived(stringifiedMessage)
    }

    function displayJsonSend(message) {
        let sendDiv = document.createElement("div")
        let messageLog = document.createElement("p")

        messageLog.setAttribute('style', 'color: #36d481');

        let lineContent;

        if (message.type == 'selfAddress'){
            lineContent = document.createTextNode("Sent ourselves our address.")
        } else {
            let decodedMessage = message.message.replace(/\//g,"");

            let parsedMessage = JSON.parse(decodedMessage);

            lineContent = document.createTextNode("⬆ Sent File : " + parsedMessage.name)
        }

        messageLog.appendChild(lineContent)
        sendDiv.appendChild(messageLog)
        document.getElementById("output").appendChild(sendDiv)
    }

    function displayJsonReceived(message) {
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        let parsedMessage = JSON.parse(message);
        
        let dataLog = {
            url : parsedMessage.url,
            name: parsedMessage.name,
            dataUrl : parsedMessage.dataUrl,
            time : today.toUTCString()
        }
        
        let receivedDiv = document.createElement("div");
        let messageLogLine1 = document.createElement("p");
        let messageLogLine2 = document.createElement("p");

        messageLogLine1.setAttribute('style', 'color: orange;word-break: break-word;');
        messageLogLine2.setAttribute('style', 'color: orange;word-break: break-word;');

        let line1Contents;
        let line2Contents;

        if (parsedMessage.type == 'selfAddress'){
            line1Contents = document.createTextNode("Initialized Mixnet Websocket.");
            line2Contents = document.createTextNode('Our address : ' + parsedMessage.address);
        } else {
            line1Contents = document.createTextNode("⬇ " + dataLog.time + " | " + dataLog.name);
            line2Contents = document.createTextNode('Link: ' + dataLog.url);
        }

        messageLogLine1.appendChild(line1Contents);
        messageLogLine2.appendChild(line2Contents);
        
        receivedDiv.appendChild(messageLogLine1);
        receivedDiv.appendChild(messageLogLine2);
        document.getElementById("output").appendChild(receivedDiv);
    }
```

* `displayJsonReceived()` - Responsible for sorting the contents of a received message from the mixnet. It's dependent on nature of the `selfAddress` request or an actual message from our service provider with the URL we're seeking.

* `displayJsonSend()` - Similar to the `displayJsonReceived()` function, however invoked when a message is sent.


8. Replace the current `index.html` with the following, to reflect our output on the UI:

```
    <!doctype html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Mixnet Websocket File Upload Client for IPFS</title>
            <link rel="stylesheet" href="../assets/styles/styles.css">
        </head>
        <body style="background-color: #242c3d;font-family: sans-serif;">
            <div class="toolbar" role="banner">
                <span class="toolbar-title">IPFS Image Upload Service Provider for Mixnet</span>
                <div class="spacer"></div>
                <a
                  href="https://nymtech.net/"
                  title="Nym"
                  target="_blank"
                >
                  <img src="../assets/images/nym-logo-icon.png" alt="Nym Logo" width="48" height="48">
                </a>
                <h3> X </h3>
                <a
                  href="https://docs.ipfs.tech/"
                  title="IPFS"
                  target="_blank"
                >
                  <img src="../assets/images/ipfs-logo-icon.png" alt="IPFS Logo" width="48" height="48">
                </a>
                <div class="toolbar-tag">
                    <p>Client
                    </p>
                </div>
            </div>
            <div class="content" role="main">
                
                <div class="section-container">
                    <div class="file-upload">
                        <label for="fileInput" class="file-upload-label">UPLOAD image</label>
                        <input id="fileInput" class="file-upload-input" type="file" accept="image/jpeg, image/png"/>
                    </div>
                </div>

                <div class="section-container">
                    <h3>Activity Log</h3>
                    <h5>Sent and received data will be logged below.</h5>
                
                    <p style="background-color: #202124;color: #fff;padding: 1rem;">
                        <span id="output"></div>
                    </p>
                </div>
            </div>

            <script src="index.ts"></script>

        </body>
    </html>
```

> The reference of the `index.ts` within the script tag of the `<body>` allows for our application to be bundled by parcel correctly.

> ⚠️ Make sure to save all files before proceeding!

9. Inside the `styles.css` in `path/to/the/assets/styles` folder in the root directory, copy and paste the CSS default styling for the application from this [GitHub link](need link to css from github here). 

Also inside the `/images` in `path/to/the/assets` folder in the root directory, add the images for the application from this [GitHub link](). 

<!--need link to image from github here--->

> ⚠️ Make sure to save all files before proceeding!

9. Return back to your terminal and run:

```
npm start
```

Return to your open browser and you should see a new UI has been created: 

<img src="../images/ipfs-upload-service-tutorial/ipfs-user-client-1.png"/>

Here is where the websocket client up and running.

### Connecting the Nym Websocket Client

This far into the tutorial, we should have functioning User Client to make the initial websocket connection that we're looking for. To connect our Nym Websocket client, go to [releases page](https://github.com/nymtech/nym/releases) to doewnload the latest binaries release of the `nym-client`. Alternatively, download [here](https://nymtech.net/docs/binaries/building-nym.html) and follow instructions to build the binaries from the monorepo. Once the `nym-client` latest binaries has been downloaded, we can begin connecting and executing of our websocket functionality.  

One you are ready, proceed to follow the instructions below:

1. Open a new terminal window, and `path/to/the/release` folder, and run the following to initialize your first `nym-client`:

```
./nym-client init --id websocket-client
```
<details>
    <summary>Console Output</summary>
       
          _ __  _   _ _ __ ___
         | '_ \| | | | '_ \ _ \
         | | | | |_| | | | | | |
         |_| |_|\__, |_| |_| |_|
                |___/

                 (client - version 1.1.4)

        
    Initialising client...
    Client "websocket-client" was already initialised before! Config information will be overwritten (but keys will be kept)!
    Not registering gateway, will reuse existing config and keys
     2023-01-30T09:22:11.446Z INFO  config > Configuration file will be saved to "/Users/oliveranyanwu_nym_tech/.nym/clients/websocket-client/config/config.toml"
    Saved configuration file to "/Users/oliveranyanwu_nym_tech/.nym/clients/websocket-client/config/config.toml"
    Using gateway: 5Ao1J38frnU9Rx5YVeF5BWExcnDTcW8etNe9W2sRASXD
    Client configuration completed.

    Version: 1.1.4
    ID: websocket-client
    Identity key: 5hjx1NGdGfd4rGDPfB2r8E85dEVZ6vgy135fP3nMuWWM
    Encryption: LwnvsnVzwUCMxxLM8e6HZ395pSPc9NDdmCXtHHVMfCG
    Gateway ID: 5Ao1J38frnU9Rx5YVeF5BWExcnDTcW8etNe9W2sRASXD
    Gateway: ws://178.18.240.56:9001
    Client listening port: 1977

    The address of this client is: 5hjx1NGdGfd4rGDPfB2r8E85dEVZ6vgy135fP3nMuWWM.LwnvsnVzwUCMxxLM8e6HZ395pSPc9NDdmCXtHHVMfCG@5Ao1J38frnU9Rx5YVeF5BWExcnDTcW8etNe9W2sRASXD

</details>

> ⚠️ The client address generated by executing a command in a terminal will always be unique and distinct from the address generated by any other client executing the same command.

2. Run the `nym-client` using:

```
./nym-client run --id websocket-client 
```
<details>
    <summary>Console Output</summary>

          _ __  _   _ _ __ ___
         | '_ \| | | | '_ \ _ \
         | | | | |_| | | | | | |
         |_| |_|\__, |_| |_| |_|
                |___/

                 (client - version 1.1.4)

        
     2023-01-30T09:28:52.773Z INFO  client_core::client::base_client::non_wasm_helpers > loading existing surb database
     2023-01-30T09:28:52.775Z INFO  client_core::client::replies::reply_storage::backend::fs_backend::manager > Database migration finished!
     2023-01-30T09:28:52.776Z ERROR client_core::client::replies::reply_storage::backend::fs_backend          > the client hasn't undergone through graceful shutdown the last time it's gone down - we can't trust its reply surbs or stored encryption keys. They shall get purged
     2023-01-30T09:28:52.777Z INFO  client_core::client::replies::reply_storage::backend::fs_backend          > it's been over 6 days and 163 hours since we last used our data store. our reply surbs are already outdated - we're going to purge them now.
     2023-01-30T09:28:52.778Z INFO  client_core::client::replies::reply_storage::backend::fs_backend          > it's been over 6 days and 163 hours since we last used our data store. our reply keys are already outdated - we're going to purge them now.
     2023-01-30T09:28:52.778Z INFO  client_core::client::replies::reply_storage::backend::fs_backend          > it's been over 6 days and 163 hours since we last used our data store. our used sender tags are already outdated - we're going to purge them now.
     2023-01-30T09:28:52.779Z INFO  client_core::client::base_client                                          > Starting nym client
     2023-01-30T09:28:52.956Z INFO  gateway_client::client                                                    > the gateway is using exactly the same protocol version as we are. We're good to continue!
     2023-01-30T09:28:52.960Z INFO  client_core::client::base_client                                          > Obtaining initial network topology
     2023-01-30T09:28:54.077Z INFO  client_core::client::base_client                                          > Starting topology refresher...
     2023-01-30T09:28:54.077Z INFO  client_core::client::base_client                                          > Starting received messages buffer controller...
     2023-01-30T09:28:54.077Z INFO  client_core::client::base_client                                          > Starting mix traffic controller...
     2023-01-30T09:28:54.077Z INFO  client_core::client::base_client                                          > Starting real traffic stream...
     2023-01-30T09:28:54.077Z INFO  client_core::client::base_client                                          > Starting loop cover traffic stream...
     2023-01-30T09:28:54.077Z INFO  nym_client::client                                                        > Starting websocket listener...
     2023-01-30T09:28:54.077Z INFO  nym_client::websocket::listener                                           > Running websocket on "127.0.0.1:1977"
     2023-01-30T09:28:54.077Z INFO  nym_client::client                                                        > Client startup finished!
     2023-01-30T09:28:54.077Z INFO  nym_client::client                                                        > The address of this client is: CuERihx3cBjCJto7XEequFVkKpbqc5rjCZEqad3nRAjz.54ka55cZTEkjzybb6h189mozgmpqn62rgnQqejyvjKfW@EBT8jTD8o4tKng2NXrrcrzVhJiBnKpT1bJy5CMeArt2w

</details>

The Websocket Client for our Typescript User CLient is now up and running, and we can refresh the browser application to see the changes. In the 'Activity Log' of the UI, there's a successful response from our websocket, thus we should be able to see the same address from our terminal. If we were to terminate our `nym-client`, we can an error on the browser UI. This is a good sign of error handling.

We can now rerun the same `nym-client`.

You should now see the following changes in the browser window of our User Client:

<img src="../images/ipfs-upload-service-tutorial/ipfs-user-client-2.png"/>

We can see that our User Client was able to access the websocket on port 1977, detecting our Nym Websocket Client, which successfully returned our required mixnet address. Its time to continue to our next big part of the guide!

### Building the Service Provider

We're making use of the pre-built Angular code provided by the IPFS JS Project [here](https://github.com/ipfs-examples/js-ipfs-browser-angular).

Clone the repository to your local machine and store the folder inside project root folder `ipfs-upload-service-tutorial`.

#### Setting up our Application

Open the folder (`js-ipfs-angular-broswer-main`) and there should be several files. Before running `npm install`, we must need to go to our `package.json` and make a few additions:

1. Replace the`"dependencies"` section of the `package.json` with following:
```
"dependencies": {
    "@angular-builders/dev-server": "^7.3.1",
    "@angular/animations": "^13.2.0",
    "@angular/common": "^13.2.0",
    "@angular/compiler": "^13.2.0",
    "@angular/core": "^13.2.0",
    "@angular/forms": "^13.2.0",
    "@angular/platform-browser": "^13.2.0",
    "@angular/platform-browser-dynamic": "^13.2.0",
    "@angular/router": "^13.2.0",
    "@libp2p/interface-peer-id": "^1.0.2",
    "global": "^4.4.0",
    "ipfs-core": "^0.16.0",
    "ipfs-core-types": "^0.12.0",
    "ipfs-http-client": "^59.0.0",
    "rxjs": "^7.5.2",
    "tslib": "^2.3.0",
    "zone.js": "~0.11.4"
},

```

> ⚠️ Make sure to save all files before proceeding!

2. Return back to your terminal and run:

```
npm start
```

Go to [localhost:4200](http://localhost:4200/) in a new broswer tab. Your browser window should look something like this:

<img src="../images/ipfs-upload-service-tutorial/angular-app-1.png"/>

#### Frontend Development

The Angular application should be successfully built and running in the browser.

Now were going to be implementing the majority of our code for this application within the `js-ipfs-browser-angular-main/src/app/` folder. The `app.component.ts` file is where we have working JS IPFS code that will get us the id, version and the status of the built-in IPFS node upon starting up the application.

1. Change the named variables `id`, `version` and `status` in the class `AppComponent` function with following:

```
  ipfsId: PeerId | null = null;
  ipfsVersion: string | null  = null;
  ipfsClientStatus: string | null  = null;

```

> Naming our variables this way will save us any confusion with other objects.

2. Rename the `start()` function to `initializeApplication()`. The `ngOnInit()` function should look like this:

```
ngOnInit() {
    this.initializeApplication();
  }

async initializeApplication() {
    const id = await this.IPFSService.getId();
    this.ipfsId = id.id;

    const version = await this.IPFSService.getVersion();
    this.ipfsVersion = version.version

    const status = await this.IPFSService.getStatus();
    this.ipfsClientStatus = status ? 'Online' : 'Offline'
}

```

* `ngOnInit()` -  A method is an Angular life cycle hook that gets triggered once a component is constructed and initialized. It provides an ideal spot to perform initialization logic, such as setting default values for component properties or making API requests to fetch data. It's important to note that the `ngOnInit()` method is invoked only once during the component's life cycle, and it executes before the component is displayed on the page.

3. Setting up our websocket connection code for connecting to a Nym Websocket Client, requires running on a new port 1978. Replace the `constructor()` function with the following:

```
constructor(private IPFSService: IpfsService,){

  const websocketSubject = webSocket({
    url: 'ws://localhost:' + this.port,
    deserializer: (e) =>{
      if(e.type == 'message'){
        if(typeof(e.data) == 'string'){
          let jsonParsedMessage = JSON.parse(e.data);
          this.processMessage(jsonParsedMessage.message,websocketSubject);
        } else {
          e.data.text().then((message: string) => {
            let jsonParsedMessage = JSON.parse(this.trimMessage(message));
            this.processMessage(jsonParsedMessage,websocketSubject);
          })
        }
      }
    }
  });
  
  websocketSubject.subscribe({
    next: response => {
      console.log('Subject: message received: ' + response)
    },
    error: err => {
      console.log('Subject: error received: ' + err)
    }, 
    complete: () => console.log('Subject: complete') 
  });
  
}
```

Once you've pasted that, Angular will prompt you to add in the imports required from `rxjs` in order for the app to compile successfully.

> RxJS WebSockets is a library for using WebSockets in an Angular application with RxJS observable. With RxJS WebSockets, you can easily subscribe to WebSocket events as observable in your Angular application, allowing you to use functional reactive programming to handle the data streams coming from the WebSocket.


4. In the `app.component.ts`, add the following to top of the file:

```
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
```

5. Declare the port variable which the websocket logic will utilise. This can be placed about the new `contructor()` function:

```
port = '1978'
```

6. Declare our `trimMessage()` function under the `constructor()` function by adding the following:

```
trimMessage(message : string){
    let index = message.indexOf("{");
    let trimmedMessage = message.substring(index);
    return trimmedMessage;
}
```

* `trimMessage()` - A function that uses the `indexOf()` method on the message parameter to locate the position of the first instance of the character `{` in the string. This is done to handle any unexpected characters that might precede the initial curly brace, which defines the JSON structure within the string. I then uses `substring()` method to extract a new string, `trimmedMessage`, starting from the index of the `{` character until the end of the original message string.

7. A `proccessMessage()` function still needs to be declared. Underneath the `initializeApplication()` function, add the following:

```
  async processMessage(response : any,websocketSubject : WebSocketSubject<any>){

  let message = response;
  let blob : any;
  
  if (typeof(message) == 'string'){
      let parsedMessage = JSON.parse(message);

      this.dataUrlToBlob(parsedMessage.dataUrl,parsedMessage.type).then( blobValue => {
          blob = blobValue
      }).then( async() => {
        const filesAdded = await this.IPFSService.addFile({path: message.name,content: blob},'Client');
        parsedMessage.cid = filesAdded.cid;
      }).then( () => {
        let messageContent = {
          url : 'https://ipfs.io/ipfs/' + parsedMessage.cid,
          name : parsedMessage.name,
          dataUrl : parsedMessage.dataUrl
        }
  
        const mixnetMessage = {
          type: "send",
          message: JSON.stringify(messageContent),
          recipient: this.targetMixnetAddress,
          withReplySurb: false,
        }

        websocketSubject.next(mixnetMessage);
  
        this.logData(parsedMessage,'Client'); 
      })
  } else if(typeof(message) == 'object'){

      this.dataUrlToBlob(message.dataUrl,message.type).then( blobValue => {
          blob = blobValue
      }).then( async() => {
        const filesAdded = await this.IPFSService.addFile({path: message.name,content: blob},'Client');
        message.cid = filesAdded.cid;
      }).then( () => {
        let messageContent = {
          url : 'https://ipfs.io/ipfs/' + message.cid,
          name : message.name,
          dataUrl : message.dataUrl
        }
  
        const mixnetMessage = {
          type: "send",
          message: JSON.stringify(messageContent),
          recipient: this.targetMixnetAddress,
          withReplySurb: false,
        }

        websocketSubject.next(mixnetMessage);
  
        this.logData(message,'Client');
      })
  }
}

```

- `processMessage()`- Receives a message via a WebSocket connection and sends it to the intended recipient through the same connection. Two parameters, `response` and `websocketSubject`, allow the message to be received and sent using the `next()` method. The function begins by checking the type of response to determine whether it's an object or a string. If it's a string, it gets parsed into an object. If it's an object, the code moves to the `else if` condition. Next, the function converts the `dataUrl` property of the message into a `Blob` object with the dataUrlToBlob method. After the conversion, the `addFile()` method from the `IPFSService` is used to add the blob as a file to IPFS.

Finally, the function sends the processed message to the target mixnet address specified by the `targetMixnetAddress` property through the WebSocket. This is done by calling the` next()` method on the websocketSubject with a mixnetMessage object as the argument. The WebSocket automatically handles the process of stringifying the entire message. The `logData()` function is called in both cases, which updates the user interface when a message is received and processed.

8. Declare the `targetMixnetAddress` global variable the top of the file, where the `port = '1978'` is stated:

```
  targetMixnetAddress : string = '';
```
 Implement the rest of the functions underneath `processMessage()` function by adding the following code:

```
async dataUrlToBlob(dataURI : string,type : string){
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: type });
}

logData(file: any,methodOfRequest: string){

    let fileLog! : FileLogData
    let dateTime = new Date()

        if(methodOfRequest == 'Manual'){
            fileLog  = {
            name : file.name,
            type : file.type,
            methodOfRequest : 'Manual Upload',
            size : this.readFileSize(file.size),
            dateTime : dateTime.toUTCString(),
            lastModifiedDate : file.lastModifiedDate,
            dataUrl: this.currentSelectedSingleFileBlob,
            cid: file.cid
        }
        } else if (methodOfRequest == 'Client'){
            fileLog = {
            name : file.name,
            type : file.type,
            methodOfRequest : 'Client Upload',
            size : this.readFileSize(file.size),
            dateTime : dateTime.toUTCString(),
            lastModifiedDate : file.lastModifiedDate,
            dataUrl: file.dataUrl,
            cid: file.cid
        }
    }

    this.dataLogItems.push(fileLog);
    this.resetFileInput();
}
```

* `dataUrlToBlob()` - Decodes a base64-encoded data URI string using the `atob` method to convert it to a byte string. It creates an ArrayBuffer of the same length as the byte string and creates a Uint8Array `ia` backed by the ArrayBuffer. Using a for loop, it iterates over each character in the byte string and sets the corresponding element in the Uint8Array to the character's ASCII code. The final value obtained is what we aim to upload to IPFS.

* `logData()` - Takes two arguments, `file` and `methodOfRequest`. It starts by declaring a variable called `fileLog`, which is of type `FileLogData` and initialised to an empty object. It also creates a new "Date" object called `dateTime`. The function then uses an `if-else` statement to check the value of `methodOfRequest`. Depending on the second parameter's value, the `fileLog` variable will be initialized with different outputs.

9. Define the type `FileLogData` that the `logData()` function will utilise in order manipulate data in an organised manner.  In `/app` folder, create a new file called `file-log-data.ts` and add the following code:

```
export interface FileLogData{
    name: string;
    type: string;
    size: string;
    methodOfRequest: string;
    dateTime : string;
    lastModifiedDate?: string;
    dataUrl: string;
    cid?: string;
}
```
Then return to the `app.component.ts` file and add the following the top of the file:
```
import { FileLogData } from './file-log-data';
```

10. Next is to make additions and changes to the `ipfs.service.ts file`. Lets open it and have a look inside:

In Angular, a service is a reusable piece of code that can be used to perform specific tasks, such as fetching data, performing calculations, and handling logic that is independent of any particular component. Services are typically used to centralise and share business logic, data, and other functionality across multiple components in an Angular application, promoting separation of concerns and making the code easier to maintain and test.

Each endpoint will query to the built-in app IPFS node and perform its respected operation. Implement the `addFile()` function at the bottom of the file.
```
async addFile(object : any,uploadMethod: string): Promise<any> {
    const node = await this.ipfs;
    return await node.add(object);
}
```

11. Next is to implement the remaining of the `logData()` function:

```
    readFileSize(bytes : number, si=false, dp=1) {
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

    resetFileInput() {
        this.currentSelectedSingleFileBlob = '';
        this.fileInputReference.nativeElement.value = "";
    }

```

* `readFileSize()` -  Converts the size of the file from bytes to a human-readable format, such as KiB, MB, or GB, depending on the size of the file.

* `resetFileInput()` -  To ensure that no file is selected after an action has been performed with it, we clear our global variables.


12. The addition of the next set of variables allows for the `logData()` and `resetFileInput()` functions to work as intended. Declare these new global variables above the `constructor()`:

```
@ViewChild('fileInput')
fileInputReference!: ElementRef;

currentSelectedSingleFile : any = null;
currentSelectedSingleFileBlob : string = '';
selectedFileInfo : string = '';

```

* `@ViewChild` - Decorates in Angular enables you to access a DOM element or directive declared in a component's template. By injecting a reference to the DOM element or directive into the component class, you can interact with it, such as reading its properties, calling its methods, or modifying its styles. In this scenario, we use `@ViewChild` to reference our File Input element in the HTML template, which we will implement shortly.

The other three global variables `currentSelectedSingleFile`,`currentSelectedSingleFileBlob` and `selectedFileInfo`, act as temporary data storage between functions when they are executed in the application

13. The last part of the component code enables Manual Image Upload. Beneath the rest of our code, add the following:

```
  async uploadFile(file: any){
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', (e) => {
      this.getBlobAndUpload(e)
    });
  }

  async getBlobAndUpload(event : any) {
    this.currentSelectedSingleFileBlob = event.target.result;    

    const filesAdded = await this.IPFSService.addFile({path: this.currentSelectedSingleFile.name,content: this.currentSelectedSingleFile},'Manual');
    console.log("Added file:", filesAdded.path, filesAdded.cid);

    this.currentSelectedSingleFile.cid = filesAdded.cid;
    this.logData(this.currentSelectedSingleFile,'Manual');
  }

  onFileSelect(input: HTMLInputElement){

    function formatBytes(bytes: number): string {
      const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const factor = 1024;
      let index = 0;

      while (bytes >= factor) {
        bytes /= factor;
        index++;
      }

      return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
    }

    const file = input!.files![0];
    this.currentSelectedSingleFile = file;
    this.selectedFileInfo = `${file.name} (${formatBytes(file.size)})`;
  }
}

```

* `readFileSize()` - An event listener is attached to the reader object using the addEventListener method. The event listener listens for the load event, which is fired when the `readAsDataURL` method has finished reading the contents of the file.When the load event is fired, the `getBlobAndUpload` method is called with the event object as an argument.


* `readFileSize()` - An event listener is attached to the reader object using the addEventListener method. The event listener listens for the load event, which is fired when the readAsDataURL method has finished reading the contents of the file.When the load event is fired, the getBlobAndUpload method is called with the event object as an argument.


* `onFileSelect()` - When a manual file upload has taken place on the UI via the respective input element on the HTML code(coming up). It reads the file size in bytes passes that as information for our image.


#### Setting our HTML Template and Styling.

1. Inside the `app.component.html` in `path/to/js-ipfs-browser-angular-main/src/app` folder in the root directory, replace HTML default for the application from this [GitHub link](need link to css from github here). 


2. Inside the `app.component.css` in `path/to/js-ipfs-browser-angular-main/src/app` folder in the root directory, replace CSS default styling for the application from this [GitHub link](need link to css from github here). 


3. Return back to `app.component.ts`, replace this block with the following:

```
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None, <--- New Line
})
```

> Angular `encapsulation` refers to the mechanism that isolates styles defined in a component from affecting the rest of the application. By default, Angular uses "Emulated" encapsulation, which adds a unique attribute to each component's styles, making them scoped to that component only. There's another option, `"ViewEncapsulation.None"`, which disables this mechanism, meaning that styles defined in a component will not be scoped to that component and will be globally available to the rest of the application.


4. Finally, create a new folder`/images/ui` in `path/to/the/assets` folder in the root directory of `js-ipfs-browser-angular-main`, add the images for the application from this [GitHub link](). 

<!--need link to image from github here--->

> ⚠️ Make sure to save all files before proceeding!


Run the following:
```
npm start
```

You should now have something that looks like this in the browser window when you navigate to [localhost:4200](http://localhost:4200/):

<img src="../images/ipfs-upload-service-tutorial/angular-app-2.png"/>


#### Initializing our Service Provider's Nym Websocket Client and linking

One you are ready, proceed to follow the instructions below:

1. Open a new terminal window, and `path/to/the/release` folder, and run the following to initialize your first `nym-client`:

```
./nym-client init --id service-provider
```
<details>
    <summary>Console Output</summary>
       
          _ __  _   _ _ __ ___
         | '_ \| | | | '_ \ _ \
         | | | | |_| | | | | | |
         |_| |_|\__, |_| |_| |_|
                |___/

                 (client - version 1.1.4)

        
    Initialising client...
    Client "websocket-client" was already initialised before! Config information will be overwritten (but keys will be kept)!
    Not registering gateway, will reuse existing config and keys
     2023-01-30T09:22:11.446Z INFO  config > Configuration file will be saved to "/Users/oliveranyanwu_nym_tech/.nym/clients/websocket-client/config/config.toml"
    Saved configuration file to "/Users/oliveranyanwu_nym_tech/.nym/clients/websocket-client/config/config.toml"
    Using gateway: 5Ao1J38frnU9Rx5YVeF5BWExcnDTcW8etNe9W2sRASXD
    Client configuration completed.

    Version: 1.1.4
    ID: websocket-client
    Identity key: 5hjx1NGdGfd4rGDPfB2r8E85dEVZ6vgy135fP3nMuWWM
    Encryption: LwnvsnVzwUCMxxLM8e6HZ395pSPc9NDdmCXtHHVMfCG
    Gateway ID: 5Ao1J38frnU9Rx5YVeF5BWExcnDTcW8etNe9W2sRASXD
    Gateway: ws://178.18.240.56:9001
    Client listening port: 1977

    The address of this client is: EGDHEwXhYHEiu15emXAvsvqWBtAVXazPAYYJNEbmfHsV.GmjtZwTA4jFeUniMzj3mQR5BMiEGwB1qYtbg3v9jgMho@3sMAn8JPJc9p8nENaBJGPhUEebiA7kNxP4nGhMgGaZqG

</details>

> ⚠️ The client address generated by executing a command in a terminal will always be unique and distinct from the address generated by any other client executing the same command.

2. Run the `nym-client` using:

```
./nym-client run --id service-provider 
```
<details>
    <summary>Console Output</summary>

          _ __  _   _ _ __ ___
         | '_ \| | | | '_ \ _ \
         | | | | |_| | | | | | |
         |_| |_|\__, |_| |_| |_|
                |___/

                 (client - version 1.1.4)

        
     2023-01-30T09:28:52.773Z INFO  client_core::client::base_client::non_wasm_helpers > loading existing surb database
     2023-01-30T09:28:52.775Z INFO  client_core::client::replies::reply_storage::backend::fs_backend::manager > Database migration finished!
     2023-01-30T09:28:52.776Z ERROR client_core::client::replies::reply_storage::backend::fs_backend          > the client hasn't undergone through graceful shutdown the last time it's gone down - we can't trust its reply surbs or stored encryption keys. They shall get purged
     2023-01-30T09:28:52.777Z INFO  client_core::client::replies::reply_storage::backend::fs_backend          > it's been over 6 days and 163 hours since we last used our data store. our reply surbs are already outdated - we're going to purge them now.
     2023-01-30T09:28:52.778Z INFO  client_core::client::replies::reply_storage::backend::fs_backend          > it's been over 6 days and 163 hours since we last used our data store. our reply keys are already outdated - we're going to purge them now.
     2023-01-30T09:28:52.778Z INFO  client_core::client::replies::reply_storage::backend::fs_backend          > it's been over 6 days and 163 hours since we last used our data store. our used sender tags are already outdated - we're going to purge them now.
     2023-01-30T09:28:52.779Z INFO  client_core::client::base_client                                          > Starting nym client
     2023-01-30T09:28:52.956Z INFO  gateway_client::client                                                    > the gateway is using exactly the same protocol version as we are. We're good to continue!
     2023-01-30T09:28:52.960Z INFO  client_core::client::base_client                                          > Obtaining initial network topology
     2023-01-30T09:28:54.077Z INFO  client_core::client::base_client                                          > Starting topology refresher...
     2023-01-30T09:28:54.077Z INFO  client_core::client::base_client                                          > Starting received messages buffer controller...
     2023-01-30T09:28:54.077Z INFO  client_core::client::base_client                                          > Starting mix traffic controller...
     2023-01-30T09:28:54.077Z INFO  client_core::client::base_client                                          > Starting real traffic stream...
     2023-01-30T09:28:54.077Z INFO  client_core::client::base_client                                          > Starting loop cover traffic stream...
     2023-01-30T09:28:54.077Z INFO  nym_client::client                                                        > Starting websocket listener...
     2023-01-30T09:28:54.077Z INFO  nym_client::websocket::listener                                           > Running websocket on "127.0.0.1:1977"
     2023-01-30T09:28:54.077Z INFO  nym_client::client                                                        > Client startup finished!
     2023-01-30T09:28:54.077Z INFO  nym_client::client                                                        > The address of this client is: EGDHEwXhYHEiu15emXAvsvqWBtAVXazPAYYJNEbmfHsV.GmjtZwTA4jFeUniMzj3mQR5BMiEGwB1qYtbg3v9jgMho@3sMAn8JPJc9p8nENaBJGPhUEebiA7kNxP4nGhMgGaZqG

</details>

Look at the browser window for [localhost:4200](http://localhost:4200/) and it should present a user interface similar to this:

<img src="../images/ipfs-upload-service-tutorial/angular-app-3.png"/>

3. To connect the two applications using their Nym Websocket Client addresses, copy the clients address : 
(`EGDHEwXhYHEiu15emXAvsvqWBtAVXazPAYYJNEbmfHsV.GmjtZwTA4jFeUniMzj3mQR5BMiEGwB1qYtbg3v9jgMho@3sMAn8JPJc9p8nENaBJGPhUEebiA7kNxP4nGhMgGaZqG`). Your address will be different from this one of course.

Lets paste that address back into our User Client code , inside `index.ts` and assign the global variable `targetAddress`:

```
var targetAddress: string = 'EGDHEwXhYHEiu15emXAvsvqWBtAVXazPAYYJNEbmfHsV.GmjtZwTA4jFeUniMzj3mQR5BMiEGwB1qYtbg3v9jgMho@3sMAn8JPJc9p8nENaBJGPhUEebiA7kNxP4nGhMgGaZqG';

```

From here we can then just copy the the value seen on our User Client's active UI session in the browser and copy the User's Nym Websocket Clients address from there. You'll also find it in the output of the nym-client, just like we did with the Service Provider:

<img src="../images/ipfs-upload-service-tutorial/ipfs-user-client-3.png"/>

Once you've copied this address, we want to go back over to our Angular Service Provider , to the `app.component.ts` and assign it to the `targetMixnetAddress` global variable we declared earlier in the guide:

```
  targetMixnetAddress : string = 'CuERihx3cBjCJto7XEequFVkKpbqc5rjCZEqad3nRAjz.54ka55cZTEkjzybb6h189mozgmpqn62rgnQqejyvjKfW@EBT8jTD8o4tKng2NXrrcrzVhJiBnKpT1bJy5CMeArt2w';

```
### Running our Applications.

Lets go ahead and give the whole thing a shot.

1. Upload a picture to the User Client by clicking on the upload button, Once a file has been selected, it will be sent to the websocket automatically and you'll see a notification appear in the activity log.

<img src="../images/ipfs-upload-service-tutorial/demo-ipfs-1.png"/>

2. You'll receive a response and the Service Provider UI will be updated with our sent image. IPFS attempts to upload the image as soon as it received by the Service Provider it via the websocket.

<img src="../images/ipfs-upload-service-tutorial/demo-ipfs-2.png"/>

3. We receive a message from the Service Provider back in our User Client with the link to image uploaded to IPFS.

<img src="../images/ipfs-upload-service-tutorial/ipfs-user-client-3.png"/>
