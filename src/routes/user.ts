/*
Emma Niemenmaa
4.1.2024
Sources:
1. How to get a list of values with specific key: https://stackoverflow.com/questions/67598998/get-a-list-of-values-from-a-specific-js-object-key
*/

import {Request, Response, Router} from "express"
import { body, Result, ValidationError, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'

// The users should be saved to a list. 

interface IUser {
    email: string,
    password: string
}

let userList: IUser[] = []

const router: Router = Router()

router.post("/register",
    body("password").isLength({min: 1}).escape(), // min length mentioned in lecture video
    body("email").isLength({min: 1}).escape(),
    async (req: Request, res: Response) => {
        // Check that there are both password and email:
        const errors: Result<ValidationError> = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors)
            res.status(400).json({errors: errors.array()})
            return
        }

        let email = req.body.email
        const currentUsers = userList.flatMap(e => e.email)
        if (currentUsers.includes(email)) {
            res.status(403).json({message: "There already exists a user with the email: " + email})
            return
        } else {
            // Hashing the password
            const salt: string = bcrypt.genSaltSync(10)
            const hash: string = bcrypt.hashSync(req.body.password, salt)

            let newUser: IUser = {
                email: email,
                password: hash
            }
            userList.push(newUser)
            res.status(200).json(newUser)
            return
        }
    }
)

router.get("/list", async (req: Request, res: Response) => {
    res.status(200).json(userList)
})


router.post("/login",
    body("password").escape(), // Same validation as in register (length check not needed here)
    body("email").escape(),
    async (req: Request, res: Response) => {

        const foundUser = userList.find((user) => req.body.email == user.email) || null
        // CHEKC IF USER EXISTS
        if (!foundUser) {
            res.status(403).json({success: false, message: "Login faied."})
            return
        } 
        if (bcrypt.compareSync(req.body.password, foundUser.password)) {
            const jwtPayload: JwtPayload = {
                email: req.body.email
            }
            const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, {expiresIn: "2m"})

            res.status(200).json({success: true, token: token})
            return
        } else {
            res.status(401).json({message: "Login failed."})
            return
        }
    }
)

export default router
