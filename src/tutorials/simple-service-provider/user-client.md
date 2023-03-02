# Building Your User Client

## Building your User Client 
Most of the work here will be configuring and adding functionality to `src/index.ts` file, allowing you to establish and handle the websocket connection to your local Nym client, and create and send messages to the SP. 

* Replace the existing content of `src/index.ts` with: 
    
```typescript
async function main() {
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

`main()` will the majority of the app's logic. It's best to declare it at the start of the file and call it at the end to run when launching the application.

`connectWebsocket(url)` returns a `Promise` that attempts to create a websocket connection to `url`. If the connection is successful, you will get a notification in your running application in the browser, as well as the connected Nym client. If it fails an error will be displayed in the browser. 

* Now to implement the functions that will handle DOM (Document Object Model) manipulation. Add the following below `connectWebsocket()`:
   
```typescript
function handleResponse(resp) {
    try {
        let response = JSON.parse(resp.data);
        if (response.type == "error") {
            displayJsonResponse("Server responded with error: " + response.message);
        } else if (response.type == "selfAddress") {
            ourAddress = response.address;
            displayClientMessage("Our address is:  " + ourAddress + ", we will now send messages to ourself.");
        } else if (response.type == "received") {
            handleReceivedTextMessage(response)
        }
    } catch (_) {
            displayJsonResponse(resp.data)
    }
}
       
function handleReceivedTextMessage(message) {
    const text = JSON.parse(message.message);
    displayJsonResponse(text);
}
        
function displayJsonResponse(message) {
    let receivedDiv = document.createElement("div")
    let paragraph = document.createElement("p")
    paragraph.setAttribute('style', 'color: orange')
    let textNode = document.createTextNode(message.text + " From - " + message.fromAddress)
    paragraph.appendChild(textNode)
            
    receivedDiv.appendChild(paragraph)
    document.getElementById("output").appendChild(receivedDiv)
}

function displayClientMessage(message) {
    document.getElementById("output").innerHTML += "<p>" + message + "</p >";
}
```

`handleResponse()` parses the type of any messages received from the websocket, and handles forwarding the message on to the appropriate function depending on this `type`. You can find documentation on these types [here](https://nymtech.net/docs/clients/websocket-client.html#message-types). 

`handleReceivedTextMessage()` ensures that data is `json` data before displaying on the UI. 

`displayJsonResponse()` is responsible for displaying received messages on the UI, creating a new `<p>` HTML element for each message that needs to be displayed on screen.

`displayClientMessage()` displays the address of the connected Nym client.  

* Declare the following variables above `main()`  

```typescript
var ourAddress:          string;
var targetAddress:       string;
var websocketConnection: any;
```

`ourAddress` takes the value of the connected Nym client address.

`targetAddress` will be the Nym address of the SP. 

`websocketConnection` populated upon a successful response from `connectWebsocket()`. 

* Add the following to `main()`:
  
```typescript
async function main() {
    var port = '1977' // client websocket listens on 1977 by default.
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
            
    const sendButton = document.querySelector('#send-button');
            
    sendButton?.addEventListener('click', function handleClick(event) {
        sendMessageToMixnet(); 
    });
}
```

And between `main()` and `displayClientMessage()`:

```typescript
function sendSelfAddressRequest() {
    var selfAddress = {
        type: "selfAddress"
    }
    displayJsonSend(selfAddress);
    websocketConnection.send(JSON.stringify(selfAddress));
}
```

`sendSelfAddressRequest()` sends a `selfAddress` message to the connected websocket client, passing the response to `displayJsonSend()` to be displayed on your UI. 

`main()` now contains logic for: connecting to a local Nym client, getting its address with a `selfAddress` message, and displaying it on the UI. Now your app can display its connection status, letting you know whether it is(n't) connected to a running client! 

* Underneath `sendSelfAddressRequest()` implement a function to send messages down the websocket connection to the SP:

```typescript
function sendMessageToMixnet() {

    var nameInput = (<HTMLInputElement>document.getElementById("nameInput")).value;
    var serviceSelect = (<HTMLInputElement>document.getElementById("serviceSelect")).value;
    var textInput = (<HTMLInputElement>document.getElementById("textInput")).value;
            
    const messageContentToSend = {
        name : nameInput,
        service : serviceSelect,
        comment : textInput,
        fromAddress : ourAddress
    }
           
    const message = {
        type: "send",
        message: JSON.stringify(messageContentToSend),
        recipient: targetAddress,
        withReplySurb: false,
    }
          
    displayJsonSend(message);
            
    websocketConnection.send(JSON.stringify(message));
}
```

Nym clients accept messages in either binary or JSON formats. Since you are sending JSON data, you need to `stringify` any `message`s you wish to send through the mixnet 

* Below `sendMessageToMixnet()`, add the following:

```typescript
function displayJsonSend(message) {
    let sendDiv = document.createElement("div")
    let paragraph = document.createElement("p")
    paragraph.setAttribute('style', 'color: #36d481')
    let paragraphContent = document.createTextNode("sent >>> " + JSON.stringify(message))
    paragraph.appendChild(paragraphContent)
            
    sendDiv.appendChild(paragraph)
    document.getElementById("output").appendChild(sendDiv)
}
```

`displayJsonSend()` displays sent messages in the "Activity Log" section of the UI.

* Replace the contents of `src/index.html` with the following:

```html
<!doctype html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Mixnet Websocket Starter Client</title>
        <link rel="stylesheet" href="../assets/styles.css"/>
    </head>
    <body>
        <div class="content" role="main">
            <div class="toolbar">
                <h3>Mixnet Websocket Starter User Client</h3>
            </div>
                
            <div class="section-container">
              
                <label for="nameInput" class="form-field-label">Name</label>
                <input id="nameInput" type="text" value="Freddy" name="nameInput">

                <label class="form-field-label">Service</label>
                <select class="" id="serviceSelect" name="serviceSelect">
                    <option value="service_1">Service 1</option>
                    <option value="service_2">Service 2</option>
                    <option value="service_3">Service 3</option>
                </select>

                <label for="textInput" class="form-field-label">Comment</label>
                <input id="textInput" type="text" value="Hello, Service Provider. I would like to use a service!" name="textInput">
            
                <div id="send-button">
                    <label for="send-button" class="submit-button">Send</label>
                </div>
            </div>
        </div>
            
        <div class="" style="margin-left:20px;max-width: fit-content;">
            <div style="color: white;margin-bottom: 2rem;">
                <h4>How it works</h4>
                    <p>Once you have started your nym-client(s), you can fill out the form and send data to the mixnet using the <b>"Send"</b> button.</p>
                    <p>Your message will then be relayed through your nym-client running on the port (specified using --port in the command line) which is set to 1977 by default.</p>
                    <p>Below, you can see the activity log. <b style='color: #36d481;'>Sent</b> messages will display in <b style='color: #36d481;'>green</b> while <b style='color: orange;'>received</b> messages will display in <b style='color: orange;'>orange</b>.</p>
            </div>
        </div>
            
        <h3 style="margin-left:10px">Activity Log</h3>
            
        <p class="output-container">
            <span id="output"></div>
        </p>
        <script src="index.ts"></script>
    </body>
</html>
```

Lets add the finishing touches to the UI by adding in the stylesheet which we specified at the top of `index.html`: 

```
mkdir -p src/assets
touch src/assets/styles.css
```

**todo grab this with curl from github and add contents to styles** 

* Return back to your terminal and run:

```
npm start
```

Return to [localhost:1234](http://localhost:1234/)) and you should see an updated UI.  

<img src="../images/tutorial_image_2.png"/>

## Connecting the nym-client
This far into the tutorial, we should have functioning __User Client__ to make the initial websocket connection that we're looking for. To connect our __nym-client__, go to [releases page](https://github.com/nymtech/nym/releases) to download the latest binaries release of the `nym-client`. Alternatively, download [here](https://nymtech.net/docs/stable/run-nym-nodes/build-nym/) and follow instructions to build the binaries from the monorepo. Once the `nym-client` latest binaries has been downloaded, we can begin connecting and executing of our websocket functionality.  

1.  Open a new terminal window, and `path/to/the/release` folder, and run the following to initialize your first `nym-client`:

    ```
    ./nym-client init --id user-client
    ```
    <details>
        <summary>Console Output</summary>
        
            _ __  _   _ _ __ ___
            | '_ \| | | | '_ \ _ \
            | | | | |_| | | | | | |
            |_| |_|\__, |_| |_| |_|
                    |___/

                    (client - version {{platform_release_version}})

            
        Initialising client...
        Client "user-client" was already initialised before! Config information will be overwritten (but keys will be kept)!
        Not registering gateway, will reuse existing config and keys
        2023-01-30T09:22:11.446Z INFO  config > Configuration file will be saved to "/Users/oliveranyanwu_nym_tech/.nym/clients/user-client/config/config.toml"
        Saved configuration file to "/Users/oliveranyanwu_nym_tech/.nym/clients/user-client/config/config.toml"
        Using gateway: 5Ao1J38frnU9Rx5YVeF5BWExcnDTcW8etNe9W2sRASXD
        Client configuration completed.

        Version: 1.1.4
        ID: user-client 
        Identity key: 5hjx1NGdGfd4rGDPfB2r8E85dEVZ6vgy135fP3nMuWWM
        Encryption: LwnvsnVzwUCMxxLM8e6HZ395pSPc9NDdmCXtHHVMfCG
        Gateway ID: 5Ao1J38frnU9Rx5YVeF5BWExcnDTcW8etNe9W2sRASXD
        Gateway: ws://178.18.240.56:9001
        Client listening port: 1977

        The address of this client is: 5hjx1NGdGfd4rGDPfB2r8E85dEVZ6vgy135fP3nMuWWM.LwnvsnVzwUCMxxLM8e6HZ395pSPc9NDdmCXtHHVMfCG@5Ao1J38frnU9Rx5YVeF5BWExcnDTcW8etNe9W2sRASXD
    </details>

    > ⚠️ The client address generated by executing a command in a terminal will always be unique and distinct from the address generated by any other client executing the same command.

2.  Run the `nym-client` using:

    ```
    ./nym-client run --id user-client 
    ```

    <details>
        <summary>Console Output</summary>


                    (client - version {{platform_release_version}})

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
        2023-01-30T09:28:54.077Z INFO  nym_client::client                                                        > The address of this client is: 5hjx1NGdGfd4rGDPfB2r8E85dEVZ6vgy135fP3nMuWWM.LwnvsnVzwUCMxxLM8e6HZ395pSPc9NDdmCXtHHVMfCG@5Ao1J38frnU9Rx5YVeF5BWExcnDTcW8etNe9W2sRASXD
    </details>

    The __nym-client__ for our Typescript Script is now up and running, and we can refresh the browser application to see the changes. In the 'Activity Log' of the UI, there's a successful response from our websocket, thus we're able to see the same address from our terminal. If we were to terminate our `nym-client`, we can an error on the browser UI stating a missing websocket connection. This is a good sign of error handling.

    We can now rerun the same `nym-client`.

