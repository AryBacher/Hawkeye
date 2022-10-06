import 'dotenv/config';
import bcryptjs from 'bcryptjs';
import { serialize } from 'cookie';
import { pool } from '../database.js';
import jwt from 'jsonwebtoken';


export const signUp = async (req, res) =>{
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.passwordConfirm){
        return res.status(406).json({message: "Datos incompletos"});
    }

    const {name, email, password, passwordConfirm} = req.body;

    if (password !== passwordConfirm){
        return res.status(406).json({message: "Las contraseñas no coinciden"})
    }

    const [user] = await pool.query("SELECT email from usuarios WHERE email = ?", email)
    if (user.length !== 0){
        console.log("El usuario ya existe")
        return res.status(406).json({message: "El usuario ya existe"});
    }

    const passwordHash = await bcryptjs.hash(password, 8);
    await pool.query("INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)", [name, email, passwordHash]);
    console.log("Usuario creado")
    return res.status(200).json({message: "Usuario creado"});
}


export const logIn = async (req, res) =>{
    if (!req.body.email || !req.body.password){
        return res.status(406).json({message: "Datos incompletos"})
    }

    const {email, password} = req.body;
    console.log(email)
    const [user] = await pool.query("SELECT id, nombre, contraseña from usuarios WHERE email = ?", email)
    console.log(user[0])
    if (user[0] === undefined){
        return res.status(406).json({message: "Usuario inválido"});
    }
    const userId = user[0].id
    
    const contraseñaCorrecta = await bcryptjs.compare(password, user[0].contraseña)
    console.log(contraseñaCorrecta)

    if (contraseñaCorrecta){
        const accessToken = generateAccessToken({id: userId});
        
        const refreshToken = jwt.sign({id: userId}, process.env.REFRESH_TOKEN_SECRET)

        const serializedAccess = serialize('accessToken', accessToken, {
            httpOnly: true,
            expiresIn: 0,
            path: '/',
        })

        const serializedRefresh = serialize('refreshToken', refreshToken, {
            httpOnly: true,
            expiresIn: 0,
            path: '/',
        })

        res.setHeader('Set-Cookie', [serializedAccess, serializedRefresh]);
        return res.json({ message: "Usuario logueado" })
    }
    return res.status(406).json({message: "Contraseña incorrecta"});
}

export const authenticateUser = (req, res, next) =>{
    const authHeader = req.headers['authorization'];
    console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403)
        req.user = user
        next();
    });
}

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn : '30m'});
}

export const refreshToken = (req, res) => {
    const refreshToken = req.body.token

    if (refreshToken == null) return req.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return req.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
    
    if(err) return req.sendStatus(403)
    const accessToken = generateAccessToken({ id : user.id });
        
    const serializedAccess = serialize('accessToken', accessToken, {
        httpOnly: true,
        expiresIn: 0,
        path: '/',
    })

    res.setHeader('Set-Cookie', serializedAccess);
    return res.json({ message: "Access token refresheado" })

    })
}


export const updateUsername = async (req, res) =>{
    const {name, email, password} = req.body;
    const [user] = await pool.query("SELECT * from usuarios WHERE email = ?", email)
    if (user[0].email.length === 0){
        return res.status(406)("No existe usuario con ese email");
    }

    const contraseñaCorrecta = await bcryptjs.compare(password, user[0].contraseña)

    if (contraseñaCorrecta){
    await pool.query("UPDATE usuarios SET nombre = '" + name + "' WHERE email = '" + email +"'");
    return res.status(200).json({ message: "User updated" });
    }
    return res.status(406).json({ message: 'Contraseña incorrecta'})
}

export const deleteUser = async (req, res) =>{
    const {email} = req.body;
    const [emailUser] = await pool.query("SELECT email from usuarios WHERE email = ?", email)
    
    if (emailUser[0].length === 0){
        return res.status(406).json({ message: "No existe tal usuario" });
    }
    await pool.query("DELETE FROM usuarios WHERE email = (?)", email);
    return res.status(200).json({ message: "User deleted" });
}

export const logOut = (req, res) => {
    
    const serializedAccess = serialize('accessToken', null, {
        httpOnly: true,
        maxAge: 0,
        path: '/',
    })

    const serializedRefresh = serialize('refreshToken', null, {
        httpOnly: true,
        maxAge: 0,
        path: '/',
    })

    res.setHeader('Set-Cookie', [serializedAccess, serializedRefresh]);
    return res.status(200).json({message: "Usuario deslogueado"});
}