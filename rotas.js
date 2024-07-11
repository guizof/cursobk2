const express = require('express')
const router = express.Router();
const controlador = require('./controlador')
const db = require('./db')
const { setup } = require('./db')

router.get("/", controlador.listUsers)

router.post("/", controlador.createUser)
router.post("/:id", controlador.updateUser)
router.delete("/:id", controlador.deleteUser)
router.get("/:id", controlador.getUser)
router.put("/", controlador.login)

router.get("/setup", setup)


module.exports = router;