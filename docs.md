## Chill&chat API documentation
Welcome to the Chill&chat API documentation, This documentation will have the information about the API endpoints and how to call each of the endpoints using Javascript. You may use the index below to navigate the documentation.

### Contents 
- [Using the documentation](https://github.com/Chillandchat/api/edit/master/docs.md#using-the-documentation)
- [Login endpoint](https://github.com/Chillandchat/api/edit/master/docs.md#login-endpoint)

### Using the documentation 
This documentation can used to get all the api information to be used in your programs. Every endpoint will have an example code snippet, you are welcome to copy and paste in into your program. Furthermore, the example snippets are written in Javascript and will be using the fetch/post functions to send requests to the server.

### Login endpoint
The login endpoint in used to authenticate the user for Chill&chat, this endpoint will search the MongoDB database and find the user as well as comparing the password. The enpoint will return a status '200' on success, '400' on incorrect user credentials or api key and '500' on a server processing error. You can find the endpoint's source in ```/src/endpoints/login.ts```.

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
