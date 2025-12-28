import express from "express"
import { registerController, loginController, testController } from '../controllers/authController.js';
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

//router object
const router = express.Router();

//routing 

//REGISTER ROUTE||post REQUEST||send data to server
router.post('/register', registerController)  // here we have to wrote callback but here we follow mvc structure hence we it inside controller

//LOGIN||POST
router.post('/login', loginController)

//test route
router.get('/', requireSignIn, isAdmin, testController) //two middleware 1)token check 2) admin check

export default router;