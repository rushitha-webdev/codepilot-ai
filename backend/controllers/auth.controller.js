const {
    registerUser,
    loginUser
} = require("../services/auth.service");


// Register controller
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required"
            });
        }

        const user = await registerUser(
            name,
            email,
            password
        );

        return res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {
        console.error("Registration error:", error);

        if (error.message === "Email already registered") {
            return res.status(409).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// Login controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Call login service
        const result = await loginUser(email, password);

        return res.status(200).json({
    message: "Login successful",
    user: result.user,
    token: result.token
});

    } catch (error) {
        console.error("Login error:", error);

        if (error.message === "Invalid email or password") {
            return res.status(401).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


module.exports = {
    register,
    login
};