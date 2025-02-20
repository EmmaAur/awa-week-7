"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateToken_1 = require("../middleware/validateToken");
const router = (0, express_1.Router)();
router.get("/private", validateToken_1.validateToken, async (req, res) => {
    res.status(200).json({ message: "This is protected secure route!" });
});
exports.default = router;
