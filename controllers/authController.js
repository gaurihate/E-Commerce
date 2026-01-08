import { compare } from "bcrypt";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";   //passward ahsing componenet
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
export const registerController = async (req, res) => {
    try {
        const { name, email, password, question, phone, address } = req.body

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
        if (!question) {
            return res.send({ message: ' required answer' })
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
        const user = await new userModel({ name, email, password: hashedpassword, phone, question, address }).save()

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
                role: user.role,
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





// forgotPasswordController
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, question, newPassword } = req.body;

        // validation
        if (!email) {
            return res.status(400).send({
                success: false,
                message: "Email is required",
            });
        }

        if (!question) {
            return res.status(400).send({
                success: false,
                message: "Answer is required",
            });
        }

        if (!newPassword) {
            return res.status(400).send({
                success: false,
                message: "New password is required",
            });
        }

        // check user
        const user = await userModel.findOne({ email, question });

        if (!user) {
            return res.status(400).send({
                success: false,
                message: "Wrong email or answer",
            });
        }

        // hash new password
        const hashedPassword = await hashPassword(newPassword);

        // update password
        await userModel.findByIdAndUpdate(user._id, {
            password: hashedPassword,
        });

        res.status(200).send({
            success: true,
            message: "Password reset successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
};



//update prfole
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);
        //password
        if (password && password.length < 6) {
            return res.json({ error: "Passsword is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated SUccessfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Update profile",
            error,
        });
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
