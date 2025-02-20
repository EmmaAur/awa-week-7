"use strict";
/*
Emma Niemenmaa
4.1.2024
Sources:
1. How to get a list of values with specific key: https://stackoverflow.com/questions/67598998/get-a-list-of-values-from-a-specific-js-object-key
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let userList = [];
const router = (0, express_1.Router)();
router.post("/register", (0, express_validator_1.body)("password").isLength({ min: 1 }).escape(), // min length mentioned in lecture video
(0, express_validator_1.body)("email").isLength({ min: 1 }).escape(), async (req, res) => {
    // Check that there are both password and email:
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        res.status(400).json({ errors: errors.array() });
        return;
    }
    let email = req.body.email;
    const currentUsers = userList.flatMap(e => e.email);
    if (currentUsers.includes(email)) {
        res.status(403).json({ message: "There already exists a user with the email: " + email });
        return;
    }
    else {
        // Hashing the password
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(req.body.password, salt);
        let newUser = {
            email: email,
            password: hash
        };
        userList.push(newUser);
        res.status(200).json(newUser);
        return;
    }
});
router.get("/list", async (req, res) => {
    res.status(200).json(userList);
});
router.post("/login", (0, express_validator_1.body)("password").escape(), // Same validation as in register (length check not needed here)
(0, express_validator_1.body)("email").escape(), async (req, res) => {
    const foundUser = userList.find((user) => req.body.email == user.email) || null;
    // CHEKC IF USER EXISTS
    if (!foundUser) {
        res.status(403).json({ success: false, message: "Login faied." });
        return;
    }
    if (bcrypt_1.default.compareSync(req.body.password, foundUser.password)) {
        const jwtPayload = {
            email: req.body.email
        };
        const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, { expiresIn: "2m" });
        res.status(200).json({ success: true, token: token });
        return;
    }
    else {
        res.status(401).json({ message: "Login failed." });
        return;
    }
});
exports.default = router;
