const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');

//on utilise la methode post pour ajouter des utilisateurs
router.post("/register", authController.signUp);
router.post('/login',authController.signIn);
router.get('/logout',authController.logout); 

//base de données des utulisateurs
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo);
router.put('/:id',userController.updateUser);
router.delete('/:id',userController.deleteUser); 
router.patch('/follow/:id',userController.follow);
router.patch('/unfollow/:id',userController.unfollow);

module.exports = router;