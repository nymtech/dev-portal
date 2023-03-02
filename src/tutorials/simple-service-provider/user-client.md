# Building Your User Client

## Building your User Client 
Most of the work here will be configuring and adding functionality to `src/index.ts` file, allowing you to establish and handle the websocket connection to your local Nym client, and create and send messages to the SP. 

* Replace the existing content of `src/index.ts` with: 
    
```typescript
async function main() {}

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

<img src="../../images/tutorial_image_2.png"/>

## Connecting to your Nym Client

* Follow instructions in the [Nym websocket client documentation](https://nymtech.net/docs/clients/websocket-client.html#initialising-your-client)to `init` and `run` a client. 

* Refresh your browser window. You should see a successful response, including a Nym address, in the 'Activity Log' of the UI

Your User Client application code is connected to a websocket client, and ready to send messages through the mixnet! 

In the next section, you will build the Service application you will send these messages to. 
