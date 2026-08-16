const bcrypt = require("bcrypt");

const {
    createUser,
    findUserByEmail
} = require("../models/user.model");


const { generateToken } = require("../utils/jwt");

const registerUser = async (name, email, password) => {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await createUser(
        name,
        email,
        hashedPassword
    );

    return {
        id: result.insertId,
        name,
        email
    };
};


// Login user
const loginUser = async (email, password) => {
    // Find the user by email
    const user = await findUserByEmail(email);

    // User does not exist
    if (!user) {
        throw new Error("Invalid email or password");
    }

    // Compare entered password with stored hashed password
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    // Password is incorrect
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken(user.id);

    // Return user information
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
        token
    };
};


module.exports = {
    registerUser,
    loginUser
};