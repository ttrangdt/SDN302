const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

//10. Define the routes
router.get("/", customerController.getAllCustomer);
router.get("/:id", customerController.getCustomerById);
router.post("/", customerController.createCustomer);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
