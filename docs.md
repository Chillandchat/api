<p align="center"how><img src="https://github.com/Chillandchat/api/blob/master/logo.svg/" style="width:200px;"/></p>

# Chill&chat API documentation
Welcome to the Chill&chat API documentation, This documentation will have the information about the API endpoints and how to call each of the endpoints using Javascript. You may use the index below to navigate the documentation.

### Contents 
- [Using the documentation](https://github.com/Chillandchat/api/edit/master/docs.md#using-the-documentation)
- [Login endpoint](https://github.com/Chillandchat/api/edit/master/docs.md#login-endpoint)
- [Block user endpoint](https://github.com/Chillandchat/api/edit/master/docs.md#block-user-endpoint)
- [Create room endpoint](https://github.com/Chillandchat/api/edit/master/docs.md#create-rooom-endpoint)

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
## Create rooom endpoint
The create room endpoint is also pretty self explanatory, this endpoint will create a new document of a room in the MongoDB database following the structure and scheme of ```/src/schema/roomSchema.ts```. This endpoint will return a status of '201' on success, '401' on invalid api key or '500' on a internal sever error. Furthermore, there are 4 arguments to be supplied to the endpoint. The 'id' argument is the id of the room, usually created with the [uuid package](https://www.npmjs.com/package/uuid). The 'name' argument is the display name of the room, the 'user' argument is the starting user in the room, and the 'passcode' argument is the passcode of the room. I hope all of these arguments are very self explanatory. 

### Example
```js

post("http://<URL>/api/create_room?key=<YOUR_API_KEY>", {
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
