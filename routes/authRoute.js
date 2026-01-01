import express from "express"
import { registerController, loginController, testController, forgotPasswordController } from '../controllers/authController.js';
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

//router object
const router = express.Router();

//routing 

//REGISTER ROUTE||post REQUEST||send data to server
router.post('/register', registerController)  // here we have to wrote callback but here we follow mvc structure hence we it inside controller

//LOGIN||POST
router.post('/login', loginController)

//forgot passward||post
router.post('/forgot-password', forgotPasswordController)

//

//test route
router.get('/', requireSignIn, isAdmin, testController) //two middleware 1)token check 2) admin check

//protected root  for USER if ok is true tabhi hum dashBoard ko access kar sakte hai

router.get("/user-auth", requireSignIn, (req, res) => {
    res.set({
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "Surrogate-Control": "no-store",
    });
    res.status(200).json({ ok: true });
});

router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Admin access verified",
    });
});


export default router;