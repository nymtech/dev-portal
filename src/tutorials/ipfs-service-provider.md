# Building a Image Upload Service Provider with IPFS.

In this guide, developers will be able to observe how using Nym Websocket Client can be utilized to create a Service Provider that will be able to receive data from a Client, perform a requested operation and then return the results of that operation back to the client.


#### What are we building?

In this tutorial, you will learn how to build a User Client that allows a user to upload an image to the browser and send it through the mixnet, via our Nym Websocket Client. You'll also then learn how to create a typescript Service Provider, which will recieve the image that our client sent.The Service Provider will then upload that image to IPFS and return the results of that back to the User Client.

We will be buildiing:
- A User Client written in TypeScript, which allows for uploading images to then be passed to a Nym Websocket Client to be sent through the mixnet.
- A Angular Typescript Service Provider, which can receive images from the User Client and then uploads it to IPFS via a built-in js-ipfs node. The service provider will then return the uploaded file url back to the User Client.
- We will also be refreshing our knowledge on using the Nym Websocket Clients that we used in the previous tutorial.

> ⚠️ Service providers are usually run on remote servers to keep metadata private, but for demonstration purposes, this tutorial will show how to run it on a local machine using looped messages through the mixnet.

<img src="../images/ifps-sp-image.png"/>

We'll dive into the process of creating a Typescript application in a similar process to how we have done previously. We will then also utilize a pre-built Angular Typescript codebase that includes a packaged IPFS node provided by the [IPFS Examples repository](https://github.com/ipfs-examples) repo. Each application will have its own Nym Websocket Client to append their images/messages to, which we will also configure.

You don't need to have any expertise in Angular or Typescript in order navigate this tutorial as we will go through setting up our applications step by step. Feel free to re-use any functionality you discover that might useful.

To assist in your learning, the complete code for this tutorial is available on [Github](https://github.com/nymtech/developer-tutorials). You can use it as a reference while building or simply download it and follow along as you progress through the tutorial."

#### What do we want to achieve?

We are looking to create a a method of sending image data anonymously to a Service Provider, which will then upload our image to the [IPFS (InterPlanetary File System) ](https://ipfs.tech/). We then want the url of the image we uploaded to IPFS to be returned to our User Client.

#### What is IPFS?

IPFS is a globally distributed file storage system that operates on a peer-to-peer network. Any computer can participate by downloading the IPFS software and acting as a host for storing and serving files. Once a file is uploaded to the IPFS network by a user, it can be accessed and retrieved by any other IPFS user worldwide.

IPFS allows for developers to utilize their API features to integrate into applications they are developing. You can find out more in their documentation [here](https://js.ipfs.tech/).

#### Why use IPFS?
- Decentralized and distributed: IPFS is a peer-to-peer network, so it can provide more reliability and stability compared to traditional client-server networks, where data is stored on a single server.
- Improved performance: IPFS can speed up file transfers and reduce the load on a single server by breaking files into smaller pieces and distributing them across multiple nodes.
- Tamper-proof: IPFS uses cryptographic hash functions to ensure that the contents of files stored on the network cannot be altered without being detected.

### Prerequisites.
* `node` & `npm` 
* A copy of the Nym Websocket Client (nym-client) on your local machine. If you need to acquire one, visit [here on how to build the Nym Monorepo](https://nymtech.net/docs/binaries/building-nym.html)

### Building the User Client.
#### Setting up our Application
Make a new directory called `ipfs-upload-service-tutorial` and inside it create another folder named `user-client`.

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

#### Writing the application logic.

In our `index.ts`, we will remove our `console.log` statement and then copy and paste the code found below. This code is what we need to initialize our Websocket, same to the code we have in our last tutorial, but with a couple of additional elements.

```
/*
    The address that is given to us from our mixnet client.
*/
var ourAddress : string;

/*
    Address we want to send our messages to.
*/
var targetAddress: string = 'EGDHEwXhYHEiu15emXAvsvqWBtAVXazPAYYJNEbmfHsV.GmjtZwTA4jFeUniMzj3mQR5BMiEGwB1qYtbg3v9jgMho@3sMAn8JPJc9p8nENaBJGPhUEebiA7kNxP4nGhMgGaZqG';

/*
    Variable that holds our websocket connection data.
*/
var websocketConnection: any;

/*
    Variable that holds our selectedPayload data.
*/
var selectedPayload: any;

const fileInput = document.querySelector('#fileInput')
const sendFileButton = document.querySelector('#sendFile') as HTMLButtonElement

async function main() {
    var port = '1977' // client websocket listens on 1977 by default.
    var localClientUrl = "ws://127.0.0.1:" + port;
    
    // Set up and handle websocket connection to our desktop client.
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

/*
    Get out address to log in the activity log so we know what our address is in the mixnet via our application UI
*/
function sendSelfAddressRequest() {
    var selfAddress = {
        type: "selfAddress"
    }
    displayJsonSend(selfAddress);
    websocketConnection.send(JSON.stringify(selfAddress));
}

/* Connect to a websocket. */
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
```



### Building the Service Provider.

