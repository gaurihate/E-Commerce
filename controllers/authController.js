import { compare } from "bcrypt";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, role } = req.body

        //validatiin 

        if (!name) {
            return res.send({ message: 'name is required' })
        }
        if (!email) {
            return res.send({ message: 'Email is required' })
        }
        if (!password) {
            return res.send({ message: 'Password is required' })
        }
        if (!phone) {
            return res.send({ message: 'PhoneNo. is required' })
        }
        if (!address) {
            return res.send({ message: 'address is required' })
        }


        //check  user
        const exitinguser = await userModel.findOne({ email })

        //exiting user
        if (exitinguser) {
            return res.status(409).send({
                success: false,
                message: "already register please login"
            })
        }

        //register user
        const hashedpassword = await hashPassword(password)

        //save
        const user = await new userModel({ name, email, password: hashedpassword, phone, address, role }).save()

        res.status(201).send({
            success: true,
            message: "user register successfully",
            user

        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'erroe in REGISTRATION',
            error
        })
    }
};


//post login 
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password'
            })
        }
        //check user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(200).send({
                success: false,
                message: 'Email is not Register'
            })
        }
        const match = await comparePassword(password, user.password)  //already define function in bcrypt it need two parameter
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid password'
            })
        }

        //token
        const token = await jwt.sign({ _id: user._id }, process.env.jwt_secreat, { expiresIn: '7d' });
        res.status(200).send({
            success: true,
            message: 'login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
            token,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in login',
            error
        })
    }
};
//test controller 

export const testController = (req, res) => {
    res.send(
        "response protected"
    );
}
/*


User sends register data
↓
Validation check
↓
Check email exists?
↓
Hash password
↓
Save user
↓
Send success response






| Concept      | Meaning             |
| ------------ | ------------------- |
| req.body     | Data from frontend  |
| validation   | Check empty fields  |
| findOne      | Check existing user |
| hashPassword | Secure password     |
| try/catch    | Prevent crash       |
| return res   | Stop execution      |


User logs in
   ↓
JWT created using secret
   ↓
Token stored in browser
   ↓
User opens protected page
   ↓
Token sent in request header
   ↓
requireSignIn middleware
   ↓
jwt.verify()
   ↓
✔ valid → next()
❌ invalid → blocked



 */
