# Address-Book API
A simple address book API created using MongoDB, Express.js and Node.js.

## Overview of the features
---
1. Authentication using JWT tokens
2. APIs for user to
    * Add single or multiple contacts
    * Get single contact matching query
    * Get multiple contacts matching the query
    * Get all contacts that a user stored
    * Modify a given contact
    * Delete a given contact

## API Documentation
---

### Registration endpoint
This is the endpoint where the user registers.

Request URL : http://localhost:3000/user

A post request must be sent with a body similar to:

```javascript
{
    "username":"Test123",
    "password":"testuser1234",
    "email":"test@example.com"
}
```
The response will contain your username, email and a JWT token for you to use for requests that require authentication.
Keep in mind that your password must contain at least 7 letters.

### Authentication endpoint
This is the endpoint where the user logs in to obtain the JWT token.

Request URL: http://127.0.0.1:3000/user/login

A post request must be sent with a body similar to :

```javascript
{
    "username":"Test123",
    "password":"testuser1234"
}
```

The response is the same as that of the Registration endpoint.

### Add Contact Endpoint
The user can use this endpoint to add contacts.

Request URL: http://127.0.0.1:3000/contact

A post request must be sent with an authorization header of the form "Bearer {your_token}" and with a body of the form

```javascript
{
    "name":"test contact",
    "email":"contact@example.com",
    "address":"Address of contact",
    "mobile":3810990891
}
```
The mobile number can store 10 to 12 digits depending on whether you want to store the country code.

In case of success the response will just be the object you wanted to add with a status 200.

The email address and mobile number must be unique.

### Get single contact

The user can query his contacts to get a single contact.

A get request must be sent with an authorization header of the form "Bearer {your_token}".

Request URL : http://127.0.0.1:3000/contact

The request body must contain the keys and values with which the user wants to query the contacts.

The response will contain the contact obtained.
In case a contact was not found the server will respond with a status 404.

### Get multiple contacts matching the query

The user can query his contacts to get multiple contacts.

A get request must be sent with an authorization header of the form "Bearer {your_token}".

The request URL is of the form:
http://127.0.0.1:3000/contacts/:limit/:skip

The parameters limit and skip can be used for pagination.

The request body must contain the keys and values with which the user wants to query the contacts.

The response will contain the array of contacts obtained.In case matching contacts are not found the server will respond with a status 404.

### Get all contacts of the user

A get request must be sent with an authorization header of the form "Bearer {your_token}".

The request URL is of the form:
http://127.0.0.1:3000/allContacts/:limit/:skip

The parameters limit and skip can be used for pagination.

The response will contain an array of all the contacts. In case there a no contacts the server will respond with an error code of 404.

### Bulk add contacts

A post request must be sent with an authorization header of the form "Bearer {your_token}" .

The request URL is of the form:
http://127.0.0.1:3000/contacts

The request body must contain an array of objects similar to the object used in adding a contact.

If successful the response will have a status code of 201 and contain the array of objects you wanted to add.
If there is a validation error you will get a status code of 400 with appropriate message.

### Modify given contact

A patch request must be sent with an authorization header of the form "Bearer {your_token}" .

The request URL is :
http://127.0.0.1:3000/contact

The request body should be like

```javascript
{
    "contact":{
        //fields with which you want to query the contact to be modified
    },
    "updates":{
        //fields you want to modify
    }
}
```
It is required to specify the mobile number of the contact you want to modify in the contact object.

If successful the response will contain the unmodified version of the contact you wanted to modify with a status code of 200.
In case of a validation error you will get a status code of 400 with appropriate details.

### Delete given contact

A delete request must be sent with an authorization header of the form "Bearer {your_token}" .

The request URL is :
http://127.0.0.1:3000/contact

The request body must contain the key-value pairs of the fields you want to query on to delete.

It is required to specify the mobile number of the contact you want to delete in the contact object.

If successful the response will contain the contact you wanted to modify with a status code of 200.
In case of a validation error you will get a status code of 400 with appropriate details.





