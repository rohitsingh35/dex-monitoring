const express = require("express");
const router = express.Router();
const demoService = require("../services/demoServices")


router.get("/", async (req,res) => {
    try {
        let demos =  await demoService.getDemos();
        res.status(200).json({
            data:demos,
            message: "Hello from demo api",
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: true
        })
    }
})


module.exports = router;