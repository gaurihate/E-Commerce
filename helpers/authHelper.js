//hash and compare and decrypt passwardd of user

import bcrypt from 'bcrypt'

export const hashPassword = async (password) => {
    try {
        const saltRound = 10;
        const hashhhpassword = await bcrypt.hash(password, saltRound);
        return hashhhpassword;
    } catch (error) {
        console.log(error)
    }
};

export const comparePassword = async (password, hashhhPassword) => {
    return bcrypt.compare(password, hashhhPassword);
}