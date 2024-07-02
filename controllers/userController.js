const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { uploadImageToS3 } = require("../middleware/s3")


// create user

exports.createUser = async (req, res) => {
    try {
        let data = req.body
        let { user_name, email, password, image, total_orders } = data
        if (req.file) {
            image = req.file;
        }
        if (!user_name) {
            return res.status(400).send({ status: false, msg: 'please provide User_Name' });
        }

        if (!email) {
            return res.send({ error: "email is required" })
        }

        const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({ error: "Invalid email format" });
        }
        if (!password) {
            return res.send({ error: "password is required" })
        }
        // encrypt password
        const salt = bcrypt.genSaltSync(10)
        password = bcrypt.hashSync(password, salt)
        data.password = password

        // Upload image to S3 if it's present in the request
        let imageUrl = '';
        if (image) {
            imageUrl = await uploadImageToS3(image);
        }
        const userData = {
            user_name,
            email,
            password,
            image: imageUrl,
            total_orders
        };

        const user = await User.create(userData)
        return res.status(201).send({ status: true, message: "User created Successfully", data: user})
    } catch (error) {
        return res.status(500).send({ status: false, message: "Internal server error ", error: error })
    }

}

// login user

exports.loginUser = async (req, res) => {
    try {
        let data = req.body
        let { email, password } = data
        if (!email || !password) {
            return res.status(404).send({ success: false, msg: "invalid email or password" })
        }
        const user = await User.findOne({ email:email })
        if (!user) {
            return res.status(404).send({
                status: false,
                msg: "email is  not register"
            })
        } else {
            if (!bcrypt.compareSync(password, user.dataValues.password)) {
                return res.status(401).send({ status: false, Message: "Invalid Credantials" })
            }
        }
       user.last_logged_in = Date.now()
       await user.save();
        // token 
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success: true,
            message: "login successfully",
            token:token,
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: "Internal server error ", error: error })
    }

}
// find user by user_id

exports.findUserById = async (req, res) => {
    try {
        const user_id = req.params.id
        if (!user_id) {
            return res.status(404).send({ status: false, msg: 'please enter Id' })
        }
        const user = await User.findOne({ where: { user_id: user_id } });
        if (!user) {
            return res.status(400).send({ status: false, msg: 'User does not exist' });
        }
        return res.status(200).send({ user: user })
    } catch (error) {
        return res.status(500).send({ status: false, message: "Internal server error ", error: error })
    }
}


exports.getUserImage = async (req, res) => {
    try {
        const user_id = req.params.id
        if (!user_id) {
            return res.status(404).send({ status: false, msg: 'please enter Id' })
        }
        const user = await User.findOne({ where: { user_id: user_id } });
        if (!user) {
            return res.status(400).send({ status: false, msg: 'User does not exist' });
        }
        return res.status(200).send({ status: true, Image: user.image })
    } catch (error) {
        return res.status(500).send({ status: false, message: "Internal server error ", error: error })
    }
}

// update user details

exports.updateUser = async (req, res) => {
    try {
        let data = req.body
        let { user_id, user_name, email, image, password, total_orders } = data
        if (req.file) {
            image = req.file;
        }
        // Validate user_id
        if (!user_id) {
            return res.status(400).send({ status: false, message: 'User ID is required' });
        }

        // Fetch the existing user details from the database
        const existingUser = await User.findByPk(user_id);
        if (!existingUser) {
            return res.status(404).send({ status: false, message: 'User not found' });
        }
        if (user_name) existingUser.user_name = user_name;
        if (email) existingUser.email = email;
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            existingUser.password = bcrypt.hashSync(password, salt);
        }
        if (total_orders !== undefined) existingUser.total_orders = total_orders;

        // Handle image update
        if (image) {
            // Upload the new image
            const imageUrl = await uploadImageToS3(image);
            existingUser.image = imageUrl;
        }
        await existingUser.save();

        return res.status(200).send({ status: true, message: 'User updated successfully', data: existingUser });
    } catch (error) {
        res.status(500).send({ success: false, msg: "something went wrong", error });
    }
}
// delete user by user id
exports.deleteUser = async (req, res) => {
    try {
        const user_id = req.params.id
        if (!user_id) {
            return res.status(404).send({ status: false, msg: 'please enter Id' })
        }
        const findUser = await User.findOne({ where: { user_id: user_id } })
        if (!findUser) {
            return res.status(400).send({ status: false, msg: "User does not exist" })
        }
        const userDelete = await User.destroy({ where: { user_id: user_id } })
        return res.status(200).send({ status: true, msg: "User deleted successfully " })
    } catch (error) {
        res.status(500).send({ success: false, msg: "something went wrong", error });
    }
}