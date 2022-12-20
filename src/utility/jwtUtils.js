const jwt = require("jsonwebtoken");
const { readFileSync, writeFileSync } = require("fs");
// require("./")

dummyRedisFilePath = __dirname + "\\this-is-redis.json";

function generateJwt(data, expiresIn) {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
}

function cleanUpDummyRedis() {
  const stringifiedRedisData = readFileSync(dummyRedisFilePath);
  const redisData = JSON.parse(stringifiedRedisData);

  const checkDate = new Date();

  const newRedisData = [];

  for (let i = 0; i < redisData.length; i++) {
    if (Date.parse(redisData[i][0]) > checkDate) {
      newRedisData.push(redisData[i]);
    }
  }

  try {
    writeFileSync(dummyRedisFilePath, JSON.stringify(newRedisData), "utf8");
  } catch (error) {
    console.log("Error while cleaning up dummy redis ", error);
  }
}

// Changes required
function blacklistJwt(token) {
  // Backup redis to disk?

  cleanUpDummyRedis();

  const stringifiedRedisData = readFileSync(dummyRedisFilePath);
  const redisData = JSON.parse(stringifiedRedisData);

  // Change this to the expiration date of the token
  const expirationDate = new Date(new Date().getTime() + 15 * 60000);

  redisData.push([expirationDate, token]);

  try {
    writeFileSync(dummyRedisFilePath, JSON.stringify(redisData), "utf8");
    console.log("Jwt blacklisted.");
  } catch (error) {
    console.log("Error while blacklisting Jwt ", error);
  }
}

function checkIfJwtIsBlacklisted(token) {
  cleanUpDummyRedis();

  const stringifiedRedisData = readFileSync(dummyRedisFilePath);
  const redisData = JSON.parse(stringifiedRedisData);

  for (let i = 0; i < redisData.length; i++) {
    if (redisData[i][1] == token) {
      return true;
    }
  }

  return false;
}

function verifyJwt(token) {
  // Check blacklisting first
  if (checkIfJwtIsBlacklisted(token)) {
    return {
      success: false,
      error: "blacklisted",
    };
  }

  try {
    const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
    return {
      success: true,
      result: {
        tokenPayload: tokenPayload,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.name, // "JsonWebTokenError" -> Invalid token, "TokenExpiredError" -> Expired token
    };
  }
}

module.exports = {
  generateJwt,
  blacklistJwt,
  checkIfJwtIsBlacklisted,
  verifyJwt,
};
