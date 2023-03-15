# Sending a File Over the Mixnet

You are now ready to send a file over the mixnet! 

You should have the following set up:

* A __User Client__ Web App 
* A __Service Provider__ backend service 
* 2 Nym websocket clients, one for each component above

To upload a file, click the 'File Upload' button and choose a file to upload. Once selected, the upload process will begin right away. The User Client will display a message showing that the file has been sent, with the Service Provider showing that it has received the file details. The SP then uploads the file, returns the IPFS metadata of the uploaded file, and sends it back to the UC via a SURB. We can then see the details sent back to our User Client, including a URL where we can access the file stored on the internet.

<img src="../../images/ipfs_tutorial_image_3.png"/>

With this template application in place at this stage, you should have enough here to enable you to build PEApps that handle the anonymous transfer of files of the internet, via the mixnet. 

The next section will take you through how to send a download request from our `user-client` back to our `service-provider`, resulting in that file being sent back to us and downloaded onto our local device. Its time to make use of that Download button!

