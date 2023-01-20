# Building a Simple Service Provider

:::note
You can find the full code for this tutorial [here](https://github.com/nymtech/developer-tutorials). Feel free to cross-reference your code as you build or just pull it and follow along as you go through the tutorial.
:::

In this tutorial, you'll get a taste of the technology that Nym has to offer for developers who wish to create applications provide their users with the privacy features of the mixnet.

#### What are we building?

You will be building two pieces of application code with which you can send messages through the mixnet: 
- A Typescript 'User Client' that can send messages to the mixnet. This allows us to access the mixnet through a browser on our local machine. 
- A Typescript Service Provider that can receive messages from the mixnet. 

You will also learn how to set up a pair of Nym Websocket Clients, which our application code will use to connect to the mixnet.

:::note
In production, Service Providers should generally be deployed on a remote server in order to take action on our behalf without leaking metadata such as our IP. For this tutorial through, it will also run on our local machine - we will just be looping messages through the mixnet and then back to ourselves to demonstrate how to send messages through, and listen to messages from, the mixnet. 

Subsequent tutorials will look at deploying to servers, and creating more production-ready code. 
:::

<img src="/img/tutorials/simple-websocket/nym-websocket-demo-2.png"/>

We'll be learning:
- How to build a Typescript application from Scratch.
- How to initialize a Nym Websocket Client and connect it to the mixnet.
- How to send a message through the mixnet in a format that the Service Provider can parse. 

Don’t worry if you are rusty with Javascript or Typescript, there will be plenty to copy and paste here!


#### What do we want to achieve?

We want to be able to have our User Client present us a simple form (in the web browser) which we can enter data into. Then, once we have filled the form out, press a 'Send' button that will then send that data straight to our Service Provider, via the mixnet. We will then be able to see the data we sent within the UI of the Service Provider in the web browser.


#### What is a Service Provider
'Service Providers' are the name given to any type of app that can communicate with the mixnet via a Nym Client. The [Network Requester]() is an app that takes an outbound network request from the mixnet, performs that request (e.g. authenticating with a message server and recieving new messages) and then passes the response back to the user who requested it, sheilding their metadata from the message server. 

The Service Provider covered in this tutorial is far more simple than this, as it just aims to show developers how to approach building something that can:
* connect to the mixnet, 
* listen for messages, and 
* perform some action with them (in this case, show them on a UI). 

### Prerequisites
* `node` & `npm` 
* `Typescript` 

#### Preparing your Typescript environment  

Create a new directory to start your project inside of. For this tutorial we are naming ours `Service Provider Tutorial`.  

Inside here, create another directory named `User Client`. This is the first application we're going to build.

:::note
    Our Folder Structure (so far)

    Simple Service Provider Tutorial/
    ├─ User Client/
:::

Continue to then do the following:

1. Open your terminal in the `User Client` folder you created (or by `cd`'ing to the directory), type and enter:

    ```
    npm init
    ```
    The following chunk of output (seen below) will then be presented to you. The terminal will prompt your to provide some input for the the sections name to  license. You can simply just press enter `↵` after each prompt (like the example below) and it will work just fine.

    <details>
    <summary>console output</summary>
    
    This utility will walk you through creating a `package.json` file.
    It only covers the most common items, and tries to guess sensible defaults.

    See `npm help init` for definitive documentation on these fields
    and exactly what they do.

    Use `npm install <pkg>` afterwards to install a package and
    save it as a dependency in the package.json file.

    Press ^C at any time to quit.<br/>
    package name: (user-client)<br/> 
    version: (1.0.0)<br/> 
    description:<br/> 
    entry point: (index.js)<br/> 
    test command:<br/> 
    git repository:<br/> 
    keywords:<br/> 
    author:<br/> 
    license: (ISC)<br/> 
    About to write to /Users/josephiacono/Desktop/Workspace/practice/Tutorial Reps/Simple Service Provider Tutorial/User Client/package.json:

    {<br/>
        "name": "user-client",<br/>
        "version": "1.0.0",<br/>
        "description": "",<br/>
        "main": "index.js",<br/>
        "scripts": {<br/>
            "test": "echo \"Error: no test specified\" && exit 1"<br/>
        },<br/>
        "author": "",<br/>
        "license": "ISC"<br/>
    }

    Is this OK? (yes) 
    
    </details>

    You will then notice a `package.json` file has been created in the folder.

 2. Continuing with our terminal, type and enter:
    
    ```
    npm install typescript
    ```
    After this point , we should open up our chosen IDE (VSCode, Sublime Text, etc) and open up the folder we are working in (User Client).
    Check the contents of the `package.json` file, it should look something like this:

    ```
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
    
    ```

    We can see that typescript has been added to our `dependencies`. Typescript is now in our project.


 3. Back in our terminal, type and enter:
    
    ```
    npm install ts-node --save-dev
    ```
    This package (`ts-node`) allows us to build a typescript application in a node environment.

 4. Create a new file in the 'User Client' folder (same level as `package.json`) called `tsconfig.json` Inside that file , copy and paste the code below into it.

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

#### Bundling our Application

 1. Now that we have got to this point, we want to be able to run our application on localhost to make sure everything is working okay. 
    We also want to be able to work on our application while its running and make sure it automatically picks up any saved changes when we view it on the browser. To do this , we are going to use the Parcel bundler.

    Back in your terminal, type and enter:

    ```
    npm install --global parcel-bundler
    ```

    After the npm install has finished, create a new folder called `src` in the same level as our `tsconfig.json` and `package.json` (User Client). Inside there , create 2 new files. One called `index.html` and one called `index.ts`.

    :::note
        Our Folder Structure (so far)

        Simple Service Provider Tutorial/
        ├─ User Client/
        │  ├─ src/
        │  │  ├─ index.html
        │  │  ├─ index.ts
        │  ├─ package.json
        │  ├─ tsconfig.json
    :::


 2. In our `index.html`, paste in the following code:
    
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

    And in our `index.ts`, paste the following code:

    ```
    console.log('test log')
    ```

    We're just looking to make sure we have our typescript file working when we run the application in the browser. We'll check this is just a moment.
    
    Once we have done that , navigate into our `package.json` and in the "scripts" section, just above the test command,  paste the following:

    ```
    "start": "parcel src/index.html"
    ```

    Now back in our terminal , type `npm start` and press enter.

    <img src="/img/tutorials/simple-websocket/image4.png"/>

    This will result in the above output. Open your browser to see the results [(localhost:1234)](http://localhost:1234/). You should now have a running web application with 'Test' printed on the browser window!

    The `console.log` statement in the above code can be checked by right clicking ⇧ on the browser and selecting 'Inspect' and navigating to the 'Console' section of the pane that appears. You should see 'test log' printed there. 

    
### Building the User Client

We will focus mainly on the logic of the `index.ts` file in this section. It is where we want to establish our logic which connects our application to the mixnet, construct messages that we want to send and then send it to the mixnet for a service provider to receive.

 Remember that our aim is to get two Typescript applications running, represented by the blue boxes in the diagram [above](#what-are-we-building). Everything in the middle (the mixnet) has already been taken care of for us. The first place to to start will be implementing the code that connects our Typescript Client to our Nym Websocket Client (the orange box to the right of our 'User Client').

 1. In our `index.ts`, remove the existing `console.log` statement an paste or type in the following code : 
    
    ```
    async function main() {
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
    
    main();
    ```
    * `main()` - This function will be the first function that we will want to declare in our file. It is where the main bulk of logic is 'queued up to run' within the application. This is exactly where we will want to try to make a connection with the Nym Websocket Client. We also want to call this at the bottom of the file so it is executed when we launch the application.

     * `connectWebsocket(url)` - In this function, we return a Promise which attempts to establish a websocket connection to the url value that we pass into it as our parameter. If its successful , we will be notified in our application and our websocket client, If not successful, we will receive an error in our application. We are going to write the code for this further in the tutorial.

 2. Next, we will implement the functions that will handle DOM manipulation (code which will alter our UI depending on 
    how we are interacting with our application).
    
    Underneath our `main()` declaration function in the editor, lets paste or type the following:
 
    ```
    /*
        Display messages that relates to initializing our client and client status (appearing in our activity log).
    */
    function displayClientMessage(message) {
        document.getElementById("output").innerHTML += "<p>" + message + "</p >";
    }
    
    /*
        Handle any messages that come back down the websocket.
    */
    function handleResponse(resp) {
        try {
            let response = JSON.parse(resp.data);
            if (response.type == "error") {
                displayJsonResponse("Server responded with error: " + response.message);
            } else if (response.type == "selfAddress") {
                displayJsonResponse(response);
                ourAddress = response.address;
                displayClientMessage("Our address is:  " + ourAddress + ", we will now send messages to ourself.");
            } else if (response.type == "received") {
                handleReceivedTextMessage(response)
            }
        } catch (_) {
            displayJsonResponse(resp.data)
        }
    }
    
    /*
        Handle any string message values that are received through messages sent back to us.
    */
    function handleReceivedTextMessage(message) {
        const text = message.message
        displayJsonResponse(text)
    }
    
    /*
        Display websocket responses in the Activity Log.
    */
    function displayJsonResponse(message) {
        let receivedDiv = document.createElement("div")
        let paragraph = document.createElement("p")
        paragraph.setAttribute('style', 'color: orange')
        let paragraphContent = document.createTextNode("received back >>> " + JSON.stringify(message))
        paragraph.appendChild(paragraphContent)
        
        receivedDiv.appendChild(paragraph)
        document.getElementById("output").appendChild(receivedDiv)
    }

    ```

    This may look like a big chunk of code, but dont worry, the majority of it relates to adjusting HTML elements of our `index.html`. The next thing we then want to do is define some key variables that we will want to utilize in our application.

3.  Above our `main()` declaration function , paste or type the following code:

    ```
    /*
        The address that is given to us from our mixnet client.
    */
    var ourAddress : string;
    
    /*
        Address we want to send our messages to.
    */
    var targetAddress: string;
    
    /*
        Variable that holds our websocket connection data.
    */
    var websocketConnection: any;
    ```

    These three variables will be the three main global variables of our application.

    * `ourAddress` will be populated once we get a response from the initialization of our Nym Websocket Client (which we will cover later).

    * `targetAddress` will be set by us later in the tutorial, once we boot up the Service Providers nym client.

    * `websocketConnection` will be populated once we get a successful response from our Promise within the `connectWebsocket()` function.

4.  Lets go back up to our `main()` function and continue with filling it out. Paste or type out the following code :
  
    ```
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
        
        // Set up the send button
        const sendButton = document.querySelector('#send-button');
        
        sendButton?.addEventListener('click', function handleClick(event) {
            sendMessageToMixnet(); 
        });
    }

    ```

    Accompanying this, lets provide it with the function that we currently have not defined yet - `sendSelfAddressRequest()`. Lets paste  it under our `main()`function, above the `displayClientMessage()` function that we declared earlier:

    ```
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

    ```

    * `sendSelfAddressRequest()` - Function that is called after connecting to the websocket which will attempt to retrieve the websocklet address and display it for us on the applications UI in the browser. 

    So far, our added logic into our `main()` function will do the following:

    - State the port (set to `1977`, which our Websocket Client listens to by default) and local client url (which we point to `localhost` (`127.0.0.1`)).
    - Call our `connectWebsocket()` function and assign the value it returns to `websocketConnection`, the global variable which we created earlier.
    - Handle any responses which come back from our websocket and handle it accoredinlgy depending what value is present in its type attribute within the `handleResponse()` function.
    - Call our newly added function , `sendSelfAddressRequest()` where we send a object with an attribute, `type : selfAddress`to get the address of our  Websocket Client.
    - Listen to a Send button on your `index.html` (which we will implement soon) that when its pressed, it will grab whatever data we want to send and send it through the mixnet. This will be done in a new function we will now create, `sendMessageToMixnet()`.

5.  Its time to write our next important function. Underneath our `sendSelfAddressRequest()` function in the editor, paste 
    or type out  the  code below:

    ```
    /*
        Function that gets the form data and sends that to the mixnet in a stringified JSON format.
    */
    function sendMessageToMixnet() {
    
        //Access our form elements current values
        var nameInput = (<HTMLInputElement>document.getElementById("nameInput")).value;
        var serviceSelect = (<HTMLInputElement>document.getElementById("serviceSelect")).value;
        var textInput = (<HTMLInputElement>document.getElementById("textInput")).value;
        var freebieCheck = (<HTMLInputElement>document.getElementById("freebieCheck")).checked;
        
        //Place each of the form values into a single object to be sent.
        const messageContentToSend = {
            name : nameInput,
            service : serviceSelect,
            comment : textInput,
            gift : freebieCheck
        }
        
        /*We have to send a string to the mixnet for it to be a valid message , so we use JSON.stringify to make our object into a string.*/
        const message = {
            type: "send",
            message: JSON.stringify(messageContentToSend),
            recipient: targetAddress,
            withReplySurb: false,
        }
        
        //Display our json data to ber sent
        displayJsonSend(message);
        
        //Send our message object via out via our websocket connection.
        websocketConnection.send(JSON.stringify(message));
    }

    ```

    * `sendMessageToMixnet()` - The key function the we need to send our message to our future Service Provider.

    The `sendMessageToMixnet()` function will do a few things for us:
    - Get the values from a form in the index.html (which we will create soon) and assign them to local variables within the function.
    - We insert our local variables into one object to be send to the mixnet.
    - Call a function, `displayJsonSend()`, (implemented in our next step) which will render our sent message on to the UI.
    - Use our `websocketConnection` global variable to send our message to the websocket. You'll notice that we JSON.stringify our data when passing it into the `send()` function. This is because our Nym Websocket Client will only accept messages in string format (for now) and will throw an error if the value it receives is not a string.

    Below our `sendMessageToMixnet()` function  in the editor , paste or type out the code below for our next function :

    ```
    /*
        Functions that will display responses into our activity log.
    */
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

    * `displayJsonSend(message)` - Will display the message we sent within the 'Activity Log' section of our UI code (implemented in our next step).

6.  Lets finally get our HTML file filled out with some UI that will accompany what we have in our `index.ts`.
    Replace the contents of `index.html` with the following code:

    <details>
    <summary>index.html Code</summary>

        <!doctype html>
        <html>
            <head>
                <style>
                    .headerContainer{
                        align-items: end;
                        display: flex;
                        margin-left: 10px;
                        margin-top: 10px;
                        margin-bottom: 20px;
                    }
                    .container{
                        width: 400px;
                        margin-left: 20px;
                    }
                    </style>
                <meta charset="UTF-8">
                <title>Mixnet Websocket Starter Client</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.css" integrity="sha512-KXol4x3sVoO+8ZsWPFI/r5KBVB/ssCGB5tsv2nVOKwLg33wTFP3fmnXa47FdSVIshVTgsYk/1734xSk9aFIa4A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            </head>
            <body>
                <div class="headerContainer">
                    <img class="ui small image" src="https://nymtech.net/img/docs/FAVICON_DARK.png" style="height:45px;width:45px;">
                    <h1 style="margin-left: 10px;margin-top: 20px">Mixnet Websocket Starter User Client</h1>
                </div>
                
                <div class="container">
                    <form class="ui form">
                        <div class="field">
                            <label>Name</label>
                            <input type="text" id="nameInput" name="nameInput" value="Freddy">
                            </div>
                        <div class="field">
                            <label>Service</label>
                            <select class="ui dropdown" id="serviceSelect" name="serviceSelect">
                            <option value="service_1">Service 1</option>
                            <option value="service_2">Service 2</option>
                            <option value="service_3">Service 3</option>
                            </select>
                        </div>
                        <div class="field">
                            <label>Message</label>
                            <input type="text" id="textInput" name="textInput" value="Hello, Service Provider. I would like to use a service!">
                        </div>
                        <div class="field">
                            <div class="ui checkbox">
                            <input type="checkbox" id="freebieCheck" name="freebieCheck">
                            <label for="checkbox"> Send me free stuff.</label>
                            </div>
                        </div>
                    </form>
                    <div class="field" style="margin-top: 10px;">
                        <button class="ui button" id="send-button"><i class="icon location arrow"></i>Send</button>
                    </div>
                </div>
                
                <div class="ui icon message" style="margin-left:20px;max-width: fit-content;">
                    <i class="question circle icon"></i>
                    <div class="content">
                        <div class="header">
                            How it works
                            </div>
                            <p>Once you have started your Nym Websocket client(s), you can fill out the form and send data to the mixnet using the <b>"Send"</b> button.</p>
                            <p>Your message will then be relayed through your Nym Websocket client running on the port (specified using --port in the command line) which is set to 1977 by default.</p>
                            <p>Below, you can see the activity log. <b style='color: #36d481;'>Sent</b> messages will display in <b style='color: #36d481;'>green</b> while <b style='color: orange;'>received</b> messages will display in <b style='color: orange;'>orange</b>.</p>
                    </div>
                </div>
                
                <h3 style="margin-left:10px">Activity Log</h3>
                
                <p style="background-color: #202124;color: #fff;">
                    <span id="output"></div>
                </p>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js" integrity="sha512-aVKKRRi/Q/YV+4mjoKBsE4x3H+BkegoM/em46NNlCqNTmUYADjBbeNefNxYV7giUp0VxICtqdrbqU7iVaeZNXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.js" integrity="sha512-Xo0Jh8MsOn72LGV8kU5LsclG7SUzJsWGhXbWcYs2MAmChkQzwiW/yTQwdJ8w6UA9C6EVG18GHb/TrYpYCjyAQw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
                <script src="index.ts"></script>
            </body>
        </html>

    </details>

    Save the file in the editor and lets go back to our console window. Lets go ahead and type :

    ```
    npm start
    ```
    Then, lets go back to [localhost:1234](http://localhost:1234/) and check the result. We should now have a new UI for our application!

### Connecting our Nym Websocket Client

At this point, we should have all our code at this point be able to make the first simple websocket connection that we are looking for. 
Lets go ahead and get ourselves a copy of the Websocket Client (the orange boxes that we see in our initial [diagram](#what-are-we-building), to the right of the blue 'User Client' box).


Go to [the Github releases page](https://github.com/nymtech/nym/releases), find the latest binaries release , expand the ▶ Assets section and click on the ❒ `nym-client` option (Ubuntu or macOS).

Alternatively if your having issues (or using a different operating system), go [here]() and follow instructions to build the binaries from the monorepo. 

Once we have this up and running, we can get to the real nitty gritty of connecting and executing of our websocket functionality. For ease of showing the folder structure, we are placing the `nym-client` in the 'Simple Mixnet Websocket' folder for this demo. Place it wherever you want on your computer, and execute it by running the following commands from that directory. 

:::note
    Our Folder Structure (so far)

    Simple Service Provider Tutorial/
    ├─ User Client/
    │  ├─ src/
    │  │  ├─ index.html
    │  │  ├─ index.ts
    │  ├─ package.json
    │  ├─ tsconfig.json
    ├─ nym-client
:::

Over in your terminal, `cd` to the folder you placed your `nym-client` binary and execute the following command:

```
./nym-client init --id websocket-client
```
The resulting output will look something like this:

<img src="/img/tutorials/simple-websocket/image7.png"/>

<br/>
<br/>

:::note
This address you see in the screenshots (along with the other addresses in this tutorial) will be different to the one you have when you execute this command. Each address generated by each client will be different.
:::

We can see from this output that this command does the following:
- Starts using a gateway on the mixnet.
- Generates and address for our Websocket Client.

Next, within the same terminal, lets run the following command:

```
./nym-client run --id websocket-client 
```

Our Websocket Client for our Typescript Script is now up and running! Let's have a look at what is happening in our 
application on [localhost:1234](http://localhost:1234/) in the browser. Give the page a refresh. 

<img src="/img/tutorials/simple-websocket/image9.png"/>

We have a response in our 'Activity Log' section at the bottom of our application UI. We can see that we got a successful response from our websocket, hence we were able to get back the address we saw in the above terminal output. Lets try something here. Terminate the terminal process by holding `CTRL + C`.  After that, lets tgo back to [localhost:1234](http://localhost:1234/).

<img src="/img/tutorials/simple-websocket/image10.png"/>

Excellent, so we also know that our error code for a missing websocket connection is also working for us. Lets get that client back up and running by using:

```
 ./nym-client run --id websocket-client 
```

So now we can get on to connecting it to a Service Provider.

### Adding our Service Provider

Its time to get a full circle of websocket functionality up and running. Like our User Client, the Service Provider is a Typescript application, bundled using Parcel, and has the same npm dependencies. Lets re-iterate the same steps we went through earlier.

Lets go ahead back to our root folder 'Simple Service Provider Tutorial' and create a new directory, 'Service Provider'

:::note
    Our Folder Structure (so far)

    Simple Service Provider Tutorial/
    ├─ User Client/
    │  ├─ src/
    │  │  ├─ index.html
    │  │  ├─ index.ts
    │  ├─ package.json
    │  ├─ tsconfig.json
    ├─ nym-client
    ├─ Service Provider/

:::

Continue to then do the following:

1. Open up a second terminal on your screen, working in the 'Service Provider' directory you created (or by `cd`'ing to the directory), type and enter:

    ```
    npm init
    ```
    The following chunk of output (seen below) will then be presented to you. The terminal will prompt your to provide some input for the the sections name to  license. You can simply just press enter `↵` after each prompt (like the example below) and it will work just fine.

    <details>
    <summary>console output</summary>
    
    This utility will walk you through creating a `package.json` file.
    It only covers the most common items, and tries to guess sensible defaults.

    See `npm help init` for definitive documentation on these fields
    and exactly what they do.

    Use `npm install <pkg>` afterwards to install a package and
    save it as a dependency in the package.json file.

    Press ^C at any time to quit.<br/>
    package name: (service-provider)<br/> 
    version: (1.0.0)<br/> 
    description:<br/> 
    entry point: (index.js)<br/> 
    test command:<br/> 
    git repository:<br/> 
    keywords:<br/> 
    author:<br/> 
    license: (ISC)<br/> 
    About to write to /Users/josephiacono/Desktop/Workspace/practice/Tutorial Reps/Simple Service Provider Tutorial/Service Provider/package.json:

    {<br/>
        "name": "service-provider",<br/>
        "version": "1.0.0",<br/>
        "description": "",<br/>
        "main": "index.js",<br/>
        "scripts": {<br/>
            "test": "echo \"Error: no test specified\" && exit 1"<br/>
        },<br/>
        "author": "",<br/>
        "license": "ISC"<br/>
    }

    Is this OK? (yes) 
    
    </details>

    You will then notice a `package.json` file has been created in the folder.

2. Continuing with our terminal, type and enter:
    
    ```
    npm install typescript
    ```
    After this point , we should open up our chosen IDE (VSCode, Sublime Text, etc) and open up the folder we are working in (Service Provider).
    Check the contents of the `package.json` file, it should look something like this:

    ```
    {
        "name": "service-provider",
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
    
    ```

    We can see that typescript has been added to our `dependencies`. Typescript is now in our project.

3. Back in our terminal, type and enter:
    
    ```
    npm install ts-node --save-dev
    ```
    This package (`ts-node`) allows us to build a typescript application in a node environment.

4. Create a new file in the 'Service Provider' folder (same level as `package.json`) called `tsconfig.json` Inside that file , copy and paste the code below into it.

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
5. Now that we have got to this point, we want to be able to run our application on localhost to make sure everything is working okay. 
    We also want to be able to work on our application while its running and make sure it automatically picks up any saved changes when we view it on the browser. To do this , we are going to use the Parcel bundler.

    Back in your terminal, type and enter:

    ```
    npm install --global parcel-bundler
    ```

    After the npm install has finished, create a new folder called `src` in the same level as our `tsconfig.json` and `package.json` (Service Provider folder). Inside there , create 2 new files. One called `index.html` and one called `index.ts`.

    :::note
        Our Folder Structure (so far)

        Simple Service Provider Tutorial/
        ├─ User Client/
        │  ├─ src/
        │  │  ├─ index.html
        │  │  ├─ index.ts
        │  ├─ package.json
        │  ├─ tsconfig.json
        ├─ Service Provider/
        │  ├─ src/
        │  │  ├─ index.ts
        │  │  ├─ index.html
        │  ├─ package.json
        │  ├─ tsconfig.json
        ├─ nym-client
    :::

6. Then, in your `package.json` in your 'Service Provider' folder, within the `“scripts”` section. Check that the `“start” `line looks    like this:

    ```
    "start": "parcel src/index.html --port 1235",
    ```
    With the addition on this line, we have ensured that the application will run on localhost:1235, so it wont conflict with our User Client application running in the browser, which as we have seen previously runs on port 1234.

#### Service Provider Typescript Code

So lets fill out our code for our `index.ts`. Below you'll find the entire logic for the file. You'll notice that we share similar functions to the 'User Client' code apart from a few distinctions regarding the purposes of a few functions. Type or paste out the below code into our `index.ts`:

<details>
    <summary>index.ts Code</summary>      

    
    interface MessageData {
        name : string;
        service : string;
        comment : string;
        gift : boolean;
    }

    /*
        Comprehensive name as opposed to 'Message' for purposed related to understanding the mixnet.
    */
    interface MixnetMessage {
        message : string;
        replySurb : boolean; // Marked when we want to use a 'Single Use Reply Block', a distinct piece of functionality on the mixnet.
        type : string // 'sent' or 'received'
    }

    var ourAddress : string;
    var websocketConnection : any;
    var recievedMessageData : string[] = [];

    async function main() {
        var port = '1978' // client websocket listens on 1977 by default, change if yours is different
        var localClientUrl = "ws://127.0.0.1:" + port;

        /*
            Set up and handle websocket connection to our desktop client.
        */

        websocketConnection = await connectWebsocket(localClientUrl).then(function (c) {
            return c;
        }).catch(function (err) {
            display("Websocket connection error. Is the client running with <pre>--connection-type WebSocket</pre> on port " + port + "?");
        })

        websocketConnection.onmessage = function (e) {
            handleResponse(e);
        };

        sendSelfAddressRequest();
    }

    function decodeStringifiedMessage(message : string){
        let parsedMessage : MessageData;
        
        // We need to decode the message that we have received from our client, where it was JSON.stringify'd before it was sent to our service provider.
        message = message.replace(/\//g,"");

        // After using 'string.replace()' as above, we can turn our data back into an object. This will make it match our attributes defined in the MessageData interface
        parsedMessage = JSON.parse(message);

        // Make a new string value which we can pass into the UI (Received Message Data section).
        return '<b>Name: </b>' + parsedMessage.name + ' , <b>Service: </b>' + parsedMessage.service + ' ,<b> Personal Comment: </b>' + parsedMessage.comment + ' , <b>Wants Free Stuff?: </b>' + translateYesOrNo(parsedMessage.gift)
    }

    function translateYesOrNo(result : boolean){
        if(result == true) return 'Yes';
        return 'No';
    }

    /*
        Function that renders the contents of our recievedMessageData array in the Received Message Data section of our UI.
    */
    function renderMessageList(){

        var str = '<ul>'

        recievedMessageData.forEach(function(message) {
        str += ' <div class="item"><i class="check circle icon" style="color:orange"></i>'+ message + '</div>';
        }); 

        str += '</ul>';
        document.getElementById("slideContainer").innerHTML = str;
    }

    /*
         Handle any messages that come back down the websocket. 
    */
    function handleResponse(responseMessageEvent : MessageEvent) {
        try {
            let response = JSON.parse(responseMessageEvent.data);
            if (response.type == "error") {
                displayJsonResponseWithoutReply("Server responded with error: " + response.message);
            } else if (response.type == "selfAddress") {
                displayJsonResponseWithoutReply(response);
                ourAddress = response.address;
                display("Our address is:  " + ourAddress);
            } else if (response.type == "received") {
                handleReceivedMessage(response)
            }
        } catch (_) {
            displayJsonResponseWithoutReply(responseMessageEvent.data)
        }
    }

    function handleReceivedMessage(message : MixnetMessage) {
        const text = message.message
        
        //Make the message that we receive appear in the Activity Log.
        displayJsonResponseWithoutReply(text)

        //Remove slashes , convert message back into json object and add it to our received messages data section.
        recievedMessageData.push(decodeStringifiedMessage(text));

        //Re-render our UI to display our updated received message data.
        renderMessageList();
    }

    /*
        Send a message to the mixnet client, asking what our own address is. 
    */
    function sendSelfAddressRequest() {
        var selfAddress = {
            type: "selfAddress"
        }
        websocketConnection.send(JSON.stringify(selfAddress));
    }

    /*
        Set up and handle websocket connection to our desktop client.
    */
    function display(message : string) {
        console.log('in display');
        console.log(message);
        document.getElementById("output").innerHTML += "<p>" + message + "</p >";
    }

    /*
        Function that takes a the incoming message (as sting) as a parameter and displays it as a new entry in the Activity Log.
    */
    function displayJsonResponseWithoutReply(message : string) {
        let receivedDiv = document.createElement("div")
        let paragraph = document.createElement("p")

        paragraph.setAttribute('style', 'color: orange')
        let paragraphContent = document.createTextNode("received >>> " + JSON.stringify(message))
        paragraph.appendChild(paragraphContent)

        receivedDiv.appendChild(paragraph)
        document.getElementById("output").appendChild(receivedDiv)
    }

    /*
        Function that connects our application to the mixnet Websocket. We want to call this first in our main function.
    */
    function connectWebsocket(url) {
        return new Promise(function (resolve, reject) {
            var server = new WebSocket(url);
            console.log('connecting to Mixnet Websocket (Nym Client)...')
            server.onopen = function () {
                resolve(server);
            };
            server.onerror = function (err) {
                reject(err);
            };

        });
    }

    main();

    
    
</details>

Lets go over the functions presented in the above chunk of code and what they do:

* `decodeStringifiedMessage(message)` - Since our message coming from the User Client will come through as a stringified message (as per our implementation earlier), we will need to 'decode' the message to then display it as an object on our Service Provider UI in the browser. This function takes in the incoming data and filters any slashes ('/\') by using the `string.replace`method to reverse the formatting done by the 'stringification' of our objet that was done by the User Client. We then call `JSON.parse` to then get our data back it its original form (the data structure we created our message in when we filled out and submitted the form in the User Client) and then return a string that we will utilize in our `handleReceivedMessage()` function. 

* `translateYesOrNo(result)` - Implemented in our previous function, `decodeStringifiedMessage(message)`, we take in a boolean value as our result parameter and translate `false` to 'No' and `true` to 'Yes'. This helps make up part of the UI implemented in the `index.html` (coming up in our next step).

* `renderMessageList()` - A function that re-renders a UI element in our `index.html` when a new valid message is received, decoded and added to our `recievedMessageData` array. In our `index.html`, we will have a 'Received Message Data' section which will render each element of our `recievedMessageData` array.

* `handleReceivedMessage(message)` - When the message is recieved, we want to display it in our 'Activity Log' section, similar to the method we implemented in our 'User Client'. In this function, we'll call `recievedMessageData.push(decodeStringifiedMessage(text))`. This will add the result of the message that passes through our `decodeStringifiedMessage(message)` to the `recievedMessageData` array. We then call `renderMessageList()` so we can see then newly recieved data in the 'Received Message Data' of our UI.

* `main()` - Just like our 'User Client', our `main()` function will still be the function in charge of our initializing and executing our application. We connect to our websocket in the exact same way as we do in our 'User Client' code except we want to set our `port` local variable to '1978'. This is so we don't have a conflict with the other Nym Websocket Client (the one that we are running for our User Client on `port` 1977). So when we launch our second Nym Websocket Client, we will set the `--port` to 1978 when we get to initializing it (coming up further in the tutorial).

The good news is that we can re-use the remaining functions from our 'User Client':
- `sendSelfAddressRequest()`
- `display(message)`
- `displayJsonResponse(message)`
- `connectWebsocket(url)`

We're going to be connecting to a Nym Websocket Client in the exact same way as we did with our 'User Client', so we can don't have to change these functions.

#### Service Provider HTML Code

Its time to fill out our `index.html` code for our Service Provider so we can get a UI up and running on our browser when we eventually start out application. Copy and paste the below code into our Service Providers `index.html`.


<details>
    <summary>index.html Code</summary>    

    
    <!doctype html>
    <html>
        <head>
            <style>
                .headerContainer{
                align-items: end;
                display: flex;
                margin-left: 10px;
                margin-top: 10px;
                }
                .container{
                    width: 400px;
                    margin-left: 20px;
                }
            </style>
            <meta charset="UTF-8">
            <title>Mixnet Websocket Starter Service Provider</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.css" integrity="sha512-KXol4x3sVoO+8ZsWPFI/r5KBVB/ssCGB5tsv2nVOKwLg33wTFP3fmnXa47FdSVIshVTgsYk/1734xSk9aFIa4A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        </head>
        <body>
            <div class="headerContainer">
            <img class="ui small image" src="https://nymtech.net/img/docs/FAVICON_DARK.png" style="height:45px;width:45px;">
            <h1 style="margin-left: 10px;margin-top: 20px">Mixnet Websocket Starter Service Provider</h1> 
            </div>

            <h3 style="margin-left: 20px;">Recieved Message Data</h3>
            <div class="ui list">
            <div id="slideContainer"></div>
            </div>

            <hr>

            <div class="ui icon message" style="margin-left:20px;max-width: fit-content;">
                <i class="question circle icon"></i>
                <div class="content">
                    <div class="header">
                        How it works
                    </div>
                    <p>Once you have started your Nym Websocket client(s), this demo service providr will listen to messages that ocme through clients.</p>
                    <p>For local testing purposes, make sure that you use the '--port' param when starting your Nym Client. Make sure that its running on a differentn port than the one thats sends messages to this application.</p>
                    <p>Below, you can see the activity log. <b style='color: #36d481;'>Sent</b> messages will display in <b style='color: #36d481;'>green</b> while <b style='color: orange;'>received</b> messages will display in <b style='color: orange;'>orange</b>.</p>
                </div>
            </div>
            
            <h3 style="margin-left:10px">Activity Log</h3>

            <p style="background-color: #202124;color: #fff;">
                <span id="output"></div>
            </p>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js" integrity="sha512-aVKKRRi/Q/YV+4mjoKBsE4x3H+BkegoM/em46NNlCqNTmUYADjBbeNefNxYV7giUp0VxICtqdrbqU7iVaeZNXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.js" integrity="sha512-Xo0Jh8MsOn72LGV8kU5LsclG7SUzJsWGhXbWcYs2MAmChkQzwiW/yTQwdJ8w6UA9C6EVG18GHb/TrYpYCjyAQw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
            <script src="index.ts"></script>
        </body>
    </html>
    
</details>

Save the file and lets continue to get our websocket websocket connection up and running.

#### Getting the Service Provider connected.

Lets get get our Service Provider's Websocket Client up and running.

In our `Service Provider` folder, open up a second terminal and execute the following command


```
npm start
```
:::note
    Our Folder Structure (Recap)

    Simple Service Provider Tutorial/
    ├─ User Client/
    │  ├─ src/
    │  │  ├─ index.html
    │  │  ├─ index.ts
    │  ├─ package.json
    │  ├─ tsconfig.json
    ├─ Service Provider/
    │  ├─ src/
    │  │  ├─ index.ts
    │  │  ├─ index.html
    │  ├─ package.json
    │  ├─ tsconfig.json
    ├─ nym-client
:::


We should then have the following screen appear when we open a new tab in the web browser on url : [localhost:1235](http://localhost:1235/).

<img src="/img/tutorials/simple-websocket/image11.png"/>

So we can see that the Service Provider is wanting to listen to a websocket connection on port `1978` but currently it cant find one. 

That's our cue to open up another terminal window in our project root folder (Simple Service Provider Tutorial) and get ourselves a second instance of our Nym Websocket Client running. Once again, will be executing the same commands as last time with the `nym-client` file, but this time with a different `--port` and `--id`.

Go back to the folder where you placed your `nym-client` file and open up a new terminal window there.
Type and enter the following

```
./nym-client init --id service-provider --port 1978
./nym-client run --id service-provider
```
We then have our second Nym Websocket Client up and running. Lets go back to our browser back to our Service Provider tab and look at what's changed. Give the browser window a refresh:

<img src="/img/tutorials/simple-websocket/image12.png"/>

Same as our User Client, we got a successful response from the websocket. All good so far.

We now want to send messages to from our User Client to our Service provider. We have just this one step left to do. Back in the `index.ts` of our User Client code, we need to do the following:

Assign the global variable `targetAddress` that we initialized at the top of our code file to the value of our Service Providers websocket client address (the address stated in the screenshot above).

```
/*
   Address we want to send our messages to.
*/
var targetAddress = 'FR2dKwFTFDPN1DSBUehbWea5RXTEf2tQGUz1L7RsxGHT.QndBs9qMtNH5s3RXmnP96FgzAeFV6nwLNB6hrGGvUN2@62F81C9GrHDRja9WCqozemRFSzFPMecY85MbGwn6efve';
```

:::note
As mentioned earlier, your address will be different to the one seen here in this tutorial. Use the one that you generated for your Service Provider via the second instance of your Nym Websocket Client.
:::

Save that and refresh both of our web applications in the browser. At this point, we should have the following set up:

4 Terminals Open 
- 1 User Client Web App running,
- 1 Service Provider App running, 
- 2 Nym Websocket Clients for each of those two web applications.

<img src="/img/tutorials/simple-websocket/image13.png"/>

<br/>
<br/>

2 Applications (UI) running in the browser 
- 1 User Client.
- 1 Service Provider.

Now , let's send a message from one to the other!

Go to our Client Application and fill out the form that we constructed with our HTML Code earlier in the tutorial:

<img src="/img/tutorials/simple-websocket/image14.png"/>

<br/>
<br/>

When you are ready, Go ahead and hot that send button. Once you have done that have a look at your Service Provider application in your browser:

<img src="/img/tutorials/simple-websocket/image15.png"/>

<br/>
<br/>

There you have it, a message sent from a User Client to a Service Provider over the mixnet, creating a simple web application solution in the process.
















    

    





    



   
