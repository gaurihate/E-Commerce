import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";


//protected route token based

export const requireSignIn = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false });
        }

        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token, process.env.jwt_secreat);

        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};








//admin access

export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);

        if (!user || user.role !== 1) {
            return res.status(403).json({
                success: false,
                message: "Admin access denied"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};







/*

What decode contains

        When JWT was created at login:

            jwt.sign({ _id: user._id }, secret)


        So after verification:

            decode = {
            _id: "65fd9a123abc...",                         here the decoded is again coded usin seceate and the check for same if same verified token and call next other wise deny acess
            iat: 1710000000,
            exp: 1710600000
            }
req.user = decode;
    Meaning in simple words:
    “Attach logged-in user info to the request so other middleware/controllers can use it.”
    ######this is what req looks like######
    req = {
  headers: {...},
  body: {...},
  user: {
    _id: "65fd9a123abc...",
    iat: ...,
    exp: ...
  }
}
  req.user did not exist before
👉 You created it yourself
Now request knows who the user is

Request
 ↓
requireSignIn (verify token)
 ↓
req.user = decode
 ↓
isAdmin (fetch user from DB)
 ↓
Check role
 ↓
adminController



User Login (email+password)
        ↓
Server creates JWT
        ↓
Token stored in browser
        ↓
User requests protected route
        ↓
Token sent in headers
        ↓
requireSignIn middleware
        ↓
jwt.verify()
   ✔ valid → next()
   ❌ invalid → blocked



k 2: Signature verification (MOST IMPORTANT)

JWT does this internally:

Take Header + Payload from token

Recreate signature using same secret

Compare:

recreated signature

signature from token

👉 If both match → token is REAL
👉 If not → token is FAKE / tampered

 */