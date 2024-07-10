const jwt = require("jsonwebtoken");
const { OAuth2Client, auth } = require("google-auth-library");
const userDataServiceProvider = require('../services/userDataServiceProvider')

async function verifyToken(token, clientId) {
  const client = new OAuth2Client(clientId);
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.log(error)
    throw new Error("Invalid Token");
  }
}

function decodeToken(token) {
  return jwt.decode(token);
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  const decodedToken = decodeToken(token);
  if (!decodedToken || !decodedToken.aud) {
    return res.status(401).json({ error: "Invalid Token Format" });
  }

  const clientId = decodedToken.aud;

  verifyToken(token, clientId)
    .then(async (payload) => {
      const user = await userDataServiceProvider.emailFind(payload.email, payload.sub)
      req.user = user;
      next();
    })
    .catch((error) => {
      res.status(401).json({ error: error.message });
    });
}

module.exports = authMiddleware;
