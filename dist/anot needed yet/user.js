"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// import { validateToken } from '../middleware/validateToken'
const router = (0, express_1.Router)();
router.post("/api/user/register", 
// body("email").trim().isLength({min: 3}).escape(), // min length mentioned in lecture video
// body("password").isLength({min: 5}).escape(),
async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    // Check if errors is empty:
    if (!errors.isEmpty()) {
        console.log(errors);
        res.status(400).json({ errors: errors.array() });
        return;
    }
    res.status(201).json({ message: "Email and password are correct." });
});
router.get("/api/user/list", async (req, res) => {
    console.log("get call was made.");
    res.status(201).json({ message: "Get call was made" });
});
exports.default = router;
