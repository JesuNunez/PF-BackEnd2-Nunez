import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import CartManager from "../dao/db/cart-manager-db.js";
import UsuarioModel from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../util/util.js";

const cartManager = new CartManager();
const JWT_SECRET = "coderhouse"; 

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    }
    return token;
};

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age, role } = req.body;

        try {
            let user = await UsuarioModel.findOne({ email: email });
            if (user) return done(null, false);

            const carrito = await cartManager.crearCarrito();

            let newUser = {
                first_name,
                last_name,
                email,
                cart_id: carrito._id,
                age,
                password: createHash(password),
                role: role || "usuario"
            }

            let result = await UsuarioModel.create(newUser);
            return done(null, result);

        } catch (error) {
            return done(error);
        }
    }));

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await UsuarioModel.findOne({ email: email });
            if (!user) {
                console.log("El usuario no existe!!");
                return done(null, false);
            }
            if (!isValidPassword(password, user)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
}
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            const user = await UsuarioModel.findOne({ email: jwt_payload.email });
            if (!user) {
                return done(null, false);  
            }
            return done(null, user); 
        } catch (error) {
            return done(error);
        }
    }));
export default initializePassport;