import { Router } from "express";
import passport from "passport";
import userController from "../controllers/user.controller.js";

const router = Router();

// Ruta de registro
router.post('/register', userController.register);

// Ruta de login
router.post('/login', userController.login);

// Ruta protegida
router.get('/current', passport.authenticate('jwt', { session: false }), userController.current);

// Ruta de autenticación actual con JWT
router.get('/api/sessions/current', passport.authenticate('jwt', { session: false }), userController.current);


// Logout
router.post("/logout", userController.logout);

export default router;