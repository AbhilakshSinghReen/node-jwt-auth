# API Documentation

## Sign In User
### Request
url: /api/user/sign-in  
Authorization: None  
Content-Type: application/json  

Required Fields: {email: String, password: String}  
Optional Fields: {}  

### Response
Content-Type: application/json; charset=utf-8

### Example 1: Sign In Successful
#### Request
    Headers: None
    Content-Type: application/json
    Body: {
        "email": "tu1@gmail.com",
        "password": "12345678"
    }
#### Response
    Content-Type: application/json; charset=utf-8
    Status: 200
    Data: {
        "success": true,
        "result": {
            "user": {
                "_id": "636371e8be59d5a75a0f6fd5",
                "name": "tu1",
                "email": "tu1@gmail.com"
            },
            "tokens": {
                "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzYzNzFlOGJlNTlkNWE3NWEwZjZmZDUiLCJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE2NzQ0ODM3MDAsImV4cCI6MTY3NDQ4NDYwMH0.9thUDZitgc4eZrIR_f3umaMstdkQQCAo_E45K89Lyok",
                "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzYzNzFlOGJlNTlkNWE3NWEwZjZmZDUiLCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjc0NDgzNzAwLCJleHAiOjE2ODIyNTk3MDB9.ini9EqVwrKvhwpf-qfGRX-vak_qRmtS10TyqBFSHlMo"
            }
        }
    }

### Example 2: Sign In Unsuccessful: Invalid email or password
#### Request
    Headers: None
    Content-Type: application/json
    Body: {
        "email": "tu100@gmail.com",
        "password": "12345678"
    }
#### Response
    Content-Type: application/json; charset=utf-8
    Status: 400
    Data: {
        "success": false,
        "error": "Invalid credentials."
    }


## Request New Access Token
### Request
url: /api/user/request-new-access-token  
Authorization: None  
Content-Type: application/json  

Required Fields: {refreshToken: String}  
Optional Fields: {}  

### Response
Content-Type: application/json; charset=utf-8

### Example 1: New Access Token Granted
#### Request
    Headers: None
    Content-Type: application/json
    Body: {
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzYzNzFlOGJlNTlkNWE3NWEwZjZmZDUiLCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjc0NDgzOTM2LCJleHAiOjE2ODIyNTk5MzZ9.jGzAAjFz1X5csMhkupLVf1HW_CgqifhovNmUYv7hNz8"
    }
#### Response
    Content-Type: application/json; charset=utf-8
    Status: 200
    Data: {
        "success": true,
        "result": {
            "user": {
                "_id": "636371e8be59d5a75a0f6fd5",
                "name": "tu1",
                "email": "tu1@gmail.com"
            },
            "tokens": {
                "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYzNzFlOGJlNTlkNWE3NWEwZjZmZDUiLCJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE2NzQ0ODQwMDEsImV4cCI6MTY3NDQ4NDkwMX0.mmWjW_-DDnTtmnVOt40jTN_uS0FjqUmPZmYhvWHTCUs",
                "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzYzNzFlOGJlNTlkNWE3NWEwZjZmZDUiLCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjc0NDgzOTM2LCJleHAiOjE2ODIyNTk5MzZ9.jGzAAjFz1X5csMhkupLVf1HW_CgqifhovNmUYv7hNz8"
            }
        }
    }

### Example 2: Refresh token invalid, expired, or blacklisted
#### Request
    Headers: None
    Content-Type: application/json
    Body: {
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzYzNzFlOGJlNTlkNWE3NWEwZjZmZDUiLCJlbWFpbCI6InR1MUBnbWFpbC5jb20iLCJpYXQiOjE2NzA4NTI2NjYsImV4cCI6MTY3MDg1MzU2Nn0.wU2iYVyQ-k8o2u0-32sC7oTcPEwUPeJdZIObrRJ2Q4o"
    }
#### Response
    Content-Type: application/json; charset=utf-8
    Status: 401
    Data: {
        "success": false,
        "error": {
            "errorCode": 12,
            "message": "Refresh token invalid, expired, or blacklisted."
        }
    }

### Example 3: Refresh token invalid
#### Request
    Headers: None
    Content-Type: application/json
    Body: {
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzYzNzFlOGJlNTlkNWE3NWEwZjZmZDUiLCJlbWFpbCI6InR1MUBnbWFpbC5jb20iLCJpYXQiOjE2NzA4NTI2NjYsImV4cCI6MTY3MDg1MzU2Nn0.wU2iYVyQ-k8o2u0-32sC7oTcPEwUPeJdZIObrRJ2Q4o"
    }
#### Response
    Content-Type: application/json; charset=utf-8
    Status: 401
    Data: {
        "success": false,
        "error": {
            "errorCode": 12,
            "message": "Refresh token invalid."
        }
    }

## Sign Out User
### Request
url: /api/user/sign-out  
Authorization: None  
Content-Type: application/json  

Required Fields: {refreshToken: String}  
Optional Fields: {}  

### Response
Content-Type: application/json; charset=utf-8

### Example 1: Sign Out Successful
#### Request
    Headers: None
    Content-Type: application/json
    Body: {
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzYzNzFlOGJlNTlkNWE3NWEwZjZmZDUiLCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjcxNTIzMTMxLCJleHAiOjE2NzkyOTkxMzF9.3gRRm60Gy_Z3mdnBC2ydliRH6ATb6Eqk6nAY2itTuOg"
    }
#### Response
    Content-Type: application/json; charset=utf-8
    Status: 200
    Data: {
        "success": true
    }


## Request Reset Password
### Request
url: /api/user/request-reset-password  
Authorization: None  
Content-Type: application/json  

Required Fields: {email: String}  
Optional Fields: {}  

### Response
Content-Type: application/json; charset=utf-8

### Example 1: Reset Password Email sent Successfully
#### Request
    Headers: None
    Content-Type: application/json
    Body: {
        "email":"tu1@gmail.com"
    }
#### Response
    Content-Type: application/json; charset=utf-8
    Status: 200
    Data: {
        "success": true,
        "result": {
            "message": "Email sent."
        }
    }

### Example 2: No User with this email exists
#### Request
    Headers: None
    Content-Type: application/json
    Body: {
        "email":"tu100@gmail.com"
    }
#### Response
    Content-Type: application/json; charset=utf-8
    Status: 200
    Data: {
        "success": false,
        "result": {
            "error": {
                "errorCode": 1,
                "message": "No user signed up with this email."
            }
        }
    }

## Verify Reset Password Token and Id
### Request
url: /api/user/verify-reset-password-token-and-id  
Authorization: None  
Content-Type: application/json  

Required Fields: {_id: String, token: String}  
Optional Fields: {}  

### Response
Content-Type: application/json; charset=utf-8

### Example 1: Token and Id Verified
#### Request
    Headers: None
    Content-Type: application/json
    Body: {
        "_id":"636371e8be59d5a75a0f6fd5",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzYzNzFlOGJlNTlkNWE3NWEwZjZmZDUiLCJlbWFpbCI6InR1MUBnbWFpbC5jb20iLCJpYXQiOjE2NzExMTkxNTMsImV4cCI6MTY3MTEyMDA1M30.-XOxqZEo34O9udAxyuKcJI2qqet7rTM5Q5P-JJ7gkI4"
    }
#### Response
    Content-Type: application/json; charset=utf-8
    Status: 200
    Data: {
        "success": true,
        "result": {
            "userDetails": {
                "_id": "636371e8be59d5a75a0f6fd5",
                "name": "tu1",
                "email": "tu1@gmail.com"
            }
        }
    }

### Example 2: Token already used
#### Request
    Headers: None
    Content-Type: application/json
    Body: {
        "email":"tu100@gmail.com"
    }
#### Response
    Content-Type: application/json; charset=utf-8
    Status: 200
    Data: {
        "success": false,
        "result": {
            "error": {
                "errorCode": 1,
                "message": "Reset password token already used."
            }
        }
    }

### Example 3: Token expired
#### Request
    Headers: None
    Content-Type: application/json
    Body: {
        "_id":"636371e8be59d5a75a0f6fd5",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzYzNzFlOGJlNTlkNWE3NWEwZjZmZDUiLCJlbWFpbCI6InR1MUBnbWFpbC5jb20iLCJpYXQiOjE2NzExMTkxNTMsImV4cCI6MTY3MTEyMDA1M30.-XOxqZEo34O9udAxyuKcJI2qqet7rTM5Q5P-JJ7gkI4"
    }
#### Response
    Content-Type: application/json; charset=utf-8
    Status: 400
        Data: {
        "success": false,
        "error": {
            "errorCode": 2,
            "message": "Reset password token expired."
        }
    }

### Example 4: Invalid Token
#### Request
    Headers: None
    Content-Type: application/json
    Body: {
        "_id":"636371e8be59d5a75a0f6fd5",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzYzNzFlOGJlNTlkNWE3NWEwZjZmZDUiLCJlbWFpbCI6InR1MUBnbWFpbC5jb20iLCJpYXQiOjE2NzExMTkxNTMsImV4cCI6MTY3MTEyMDA1M30.-XOxqZEo34O9udAxyuKcJI2qqet7rTM5Q5P-JJ7gkI4000"
    }
#### Response
    Content-Type: application/json; charset=utf-8
    Status: 400
    Data: {
        "success": false,
        "error": {
            "errorCode": 3,
            "message": "Invalid reset password token."
        }
    }

### Example 5: Unknown Verification Error
#### Request
    Headers: None
    Content-Type: application/json
    Body: {
        "email":"tu100@gmail.com"
    }
#### Response
    Content-Type: application/json; charset=utf-8
    Status: 500
    Data: {
        "success": false,
        "result": {
            "error": {
                "errorCode": 4,
                "message": "Unknown token verification error."
            }
        }
    }
