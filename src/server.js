const express = require("express");
require("dotenv").config();

const { connectToDb } = require("./db/db");
const testingRoutes = require("./routes/testingRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");
const userRoutes = require("./routes/userRoutes");

connectToDb();

// Load blacklist backup into redis?

const app = express();
app.use(express.json());

app.use("/api/test", testingRoutes);
app.use("/api/admin", superAdminRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));

//------------------------------------------------------

// const firebaseAdmin = require("firebase-admin");
// const firebaseServiceAccountCredentials = require("../config/FirebaseServiceAccountCredentials.json");

// firebaseAdmin.initializeApp({
//   credential: firebaseAdmin.credential.cert(firebaseServiceAccountCredentials),
// });

// const firestoreDb = firebaseAdmin.firestore();

// const Redis = require("redis");

// const redisClient = Redis.createClient();

// redisClient.

/*
Blacklisting

Store valid refresh tokens:
    userid as key and refresh token
    this is actually safer in case of redis shutdown
    I think its better to store blacklisted only and back them up occasionally using some cron job

    BUt how to handle multiple logins from the same client?
    


    
app.post("/logout", authenticateToken, async (request, response) => {
    const { userId, token, tokenExp } = request;

    const token_key = `bl_${token}`;
    await redisClient.set(token_key, token);
    redisClient.expireAt(token_key, tokenExp);

    return response.status(200).send("Token invalidated");
});



*/
