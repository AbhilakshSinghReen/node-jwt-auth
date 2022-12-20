const mongoose = require("mongoose");

async function connectToDb() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `Database connection established. Connection host: ${conn.connection.host}`
    );
  } catch (error) {
    console.log(`Unable to connect to the database.`);
    console.log(error);

    console.log("Stopping the server.");
    process.exit();
  }
}

module.exports = { connectToDb };
