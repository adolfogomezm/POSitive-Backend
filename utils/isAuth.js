require("dotenv").config();

function isAuthorized(req) {
    const expectedToken = process.env.SYNC_AUTH_TOKEN || "";
    if (!expectedToken) return true;
    const authHeader = req.get("Authorization") || "";
    const tokenHeader = req.get("x-sync-token") || "";
    return authHeader === `Bearer ${expectedToken}` || tokenHeader === expectedToken;
}

module.exports = isAuthorized;