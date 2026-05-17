const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');

router.post('/register', userControllers.createUser);
router.get('/users', userControllers.getAllUsers);
router.get('/users/:id', userControllers.getUserById);
router.put('/edit/users/:id', userControllers.updateUser);
router.delete('/delete/users/:id', userControllers.deleteUser);

module.exports = router;