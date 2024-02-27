const express = require("express")


const User = require("../models/user-model")
const auth = require("../middleware/authentication")
const router = express();


router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/user/signup", async (req, res) => {
    const { name, email, password, age, weight, height, activity } = req.body;

    const user = new User({ name, email, password, age, weight, height, activity });

    try {
        await user.save()
        res.send(user);
    } catch (e) {
        res.status(500).send(e.message);
    }

})
router.post("/user/login", async (req, res) => {
    try {
        const user = await User.findByCredential(req.body.email, req.body.password);

        const token = await user.generateAuthToken()

        res.send({user,token});
    } catch (error) {
        res.status(404).send(error.message);
    }
})
router.post('/user/logout', auth, async (req, res) => {
    try {
        // Removing the token from the user's tokens array
        req.user.tokens = [];

        // Saving the user to the database
        await req.user.save();

        // Sending a success message back in the response
        res.send()
    } catch (e) {
        // Sending a 500 Internal Server Error status code in the response if an error occurs
        res.status(500).send()
    }
})
router.get("/user/me", auth, async (req, res) => {
    // Create a copy of the user object
    const userCopy = { ...req.user._doc };

    // Delete the password property from the copy
    delete userCopy.password;

    res.send({ user: userCopy });
});
router.patch("/user/update", auth, async (req, res) => {
    const updates = Object.keys(req.body);

    try {
        // Iterate through each update field
        updates.forEach((update) => {
            // Update the field if it exists in the request body
            if (req.body[update] !== undefined) {
                req.user[update] = req.body[update];
            }
        });

        // Saving the updated user to the database
        await req.user.save();

        // Sending the updated user back in the response
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e.message);
    }
});




module.exports = router;