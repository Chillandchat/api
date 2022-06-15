<p align="center"how><img src="https://github.com/Chillandchat/api/blob/master/logo.svg/" style="width:200px;"/></p>

# Chill&chat API documentation
Welcome to the Chill&chat API documentation, This documentation will have the information about the API endpoints and how to call each of the endpoints using Javascript. You may use the index below to navigate the documentation.

### Contents 
- [Using the documentation](https://github.com/Chillandchat/api/blob/master/docs.md#using-the-documentation)
- [Login endpoint](https://github.com/Chillandchat/api/blob/master/docs.md#login-endpoint)
- [Block user endpoint](https://github.com/Chillandchat/api/blob/master/docs.md#block-user-endpoint)
- [Create room endpoint](https://github.com/Chillandchat/api/blob/master/docs.md#create-rooom-endpoint)
- [Get all roms endpoint](https://github.com/Chillandchat/api/blob/master/docs.md#get-all-room-endpoint)
- [Get messages endpoint](https://github.com/Chillandchat/api/blob/master/docs.md#get-message-endpoint)
- [Get user info endpoint](https://github.com/Chillandchat/api/blob/master/docs.md#get-user-info-endpoint)
- [Get users info endpoint(Deprecated)](https://github.com/Chillandchat/api/blob/master/docs.md#get-users-endpointdeprecated)
- [Join room endpoint](https://github.com/Chillandchat/api/blob/master/docs.md#join-room-endpoint)

### Using the documentation 
This documentation can used to get all the api information to be used in your programs. Every endpoint will have an example code snippet, you are welcome to copy and paste in into your program. Furthermore, the example snippets are written in Javascript and will be using the fetch/post functions to send requests to the server.

## Login endpoint
The login endpoint is used to authenticate the user for Chill&chat, this endpoint will search the MongoDB database and find the user as well as comparing the password. The enpoint will return a status '200' on success, '400' on incorrect user credentials, '401' on invalid api key or '500' on a server processing error. You can find the endpoint's source in ```/src/endpoints/login.ts```. Furthermore, the endpoint will take 2 arguments including, 'username ' which is the username inputted by the user. And the very self explanatory 'password' argument which takes the password that was given.

### Example 
```js

post("http://<URL>/api/login?key=<YOUR_API_KEY>", {
    username: "<USERNAME>",
    password: "<PASSWORD>"
}).then((res) => {
    console.log(res);
}).catch((err) => {
    console.error(err);
});

```
## Block user endpoint
The block user endpoint is used for blocking a user by changing the 'blocked' element in the MongoDB database. The endpoint will return a status of '200' on success, '401' on invalid api key, '400' on invalid user or '500' on a internal server error. You may find the source file of this endpoint in ```/src/endpoints/blockUser.ts```. Furthermore, the 'user' argument is the user to target and apply the effect to, and the 'blockStatus' argument is the status of the user to be changed in the 'blocked' element. 

### Example
```js

post("http://<URL>/api/block_user?key=<YOUR_API_KEY>", {
    user: "<TARGET_USER>",
    blockStatus: true // Boolean value
}).then((res) => {
    console.log(res);
}).catch((err) => {
    console.error(err);
});

```
## Create room endpoint
The create room endpoint is also pretty self explanatory, this endpoint will create a new document of a room in the MongoDB database following the structure and scheme of ```/src/schema/roomSchema.ts```. This endpoint will return a status of '201' on success, '401' on invalid api key or '500' on a internal sever error. Furthermore, there are 4 arguments to be supplied to the endpoint. The 'id' argument is the id of the room, usually created with the [uuid package](https://www.npmjs.com/package/uuid). The 'name' argument is the display name of the room, the 'user' argument is the starting user in the room, and the 'passcode' argument is the passcode of the room. I hope all of these arguments are very self explanatory. 

### Example
```js

post("http://<URL>/api/create-room?key=<YOUR_API_KEY>", {
    id: "<ID>", // I suggest creating a id using v4() function from the uuid library.
    name: "<ROOM_NAME>",
    user: "<USER>",
    passcode:"<PASSCODE>"
}).then((res) => {
    console.log(res);
}).catch((err) => {
    console.error(err);
});

```
## Get all room endpoint 
This is the get all room endpoint is a endpoint where a user is inputted, and all the rooms that the user belongs in will be returned. The source of the endpoint can found at: ```/src/endpoints/getAllRooms.ts```. Furthermore, the endpoint will return a status of '200' on success, '401' on invalid api key or '500' on server internal error. As I said above, the 'user' argument is the user to search up.

### Example 
```js

fetch("http://<URL>/api/get-rooms?key=<YOUR_API_KEY>&user=<USER>")
.then((res) => {
    console.log(res);
}).catch((err) => {
    console.error(err);
});

```
## Get message endpoint
This is the get message endpoint, this endpoint will return all the messages in the room provided. This endpoint will return '200' on success, '401' on invalid api key or '500' on internal serve error. Furthermore, the source files of this endpoint is stored at ```/src/endpoints/getMessages.ts```. And there's only one argument for this endpoint which the 'room' argument, this argument will specify the room to search messages from, again this endpoint is quite self explanatory.

### Example 
```js

fetch("http://<URL>/api/get-messages?key=<YOUR_API_KEY>&room=<ROOM>")
.then((res) => {
    console.log(res);
}).catch((err) => {
    console.error(err);
});

```
## Get user info endpoint
This is the the get user endpoint, as the name suggests the endpoint will get the uesr info of a specified user, the source of this endpoint can be found at: ```/src/endpoints/getUserInfo.ts```. This endpoint will return '200' on success, '401' on incorrect api key or '500' on internal sevrer error. Furthermore, this endpoint will expect a 'username' argument which is the username of the user to search. 

### Example 
```js

fetch("http://<URL>/api/get-user-info?key=<YOUR_API_KEY>&user=<USER>")
.then((res) => {
    console.log(res);
}).catch((err) => {
    console.error(err);
});

```
## Get users endpoint(Deprecated) 
This is the get user endpoint, this endpoint will get all the user's information from the MongoDB database. This endpoint does not have any arguments, the endpoint will return '200' on success, '401' on invalid api key or '500' on internal server error. Furthermore, endpoint's source is at: ```/src/endpoints/getUsers.ts```. As a side note, this endpoint is no longer used by the Chill&chat frontend.

### Example
```js

fetch("http://<URL>/api/get-users?key=<YOUR_API_KEY>")
.then((res) => {
    console.log(res);
}).catch((err) => {
    console.error(err);
});

```
## Home endpoint
This is the home endpoint where it just sends a static .html file to the user. The source of the endpoint can be found at: ```/src/endpoints/home.ts```, I have no idea why anyone would look at that.

## Join room endpoint
This is the join room endpoint, this endpoint will create a room in the database once called. The source of the the endpoint can be found at: ```/src/endpoints/joinRoom.ts```. Furthermore, the endpoint will execept a 'id' argument which is the id of room to join, a 'user' argument which is the user to add to the room and finally a 'passcode' argument which as the name suggests it's the passcode for the room. Also, the endpoint will return a status of '200' on sucess, '400' on error, '401' on a invalid API key and '500' on server error. 

### Example
```js

post("http://<URL>/api/join-room?key=<YOUR_API_KEY>", {
    id: "<ROOM_ID>",
    user: "<USER>",
    passcode: "<PASSCODE>" // Must be raw unencrypted passcode!!
}).then((res) => {
    console.log(res);
}).catch((err) => {
    console.error(err);
});

```
##
#
[Back to top](https://github.com/Chillandchat/api/blob/master/docs.md#chillchat-api-documentation)
