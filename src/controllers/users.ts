import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { controller } from "../lib/controller";
import { CreateUserBody, LoginBody } from "../dto/dto";



const createUser = (client: PrismaClient): RequestHandler =>
    async (req, res) => {
        const {firstName, lastName, email, password} = req.body as CreateUserBody;
        const passwordHash = await bcrypt.hash(password, 10);
        let date: Date = new Date();
        const user = await client.user.create({
            data: {
              firstName,
              lastName,
              email,
              passwordHash,
              createdAt: date,
              updatedAt: date,
              sessions: {
                create: [{
                  token: uuidv4()
                }]
              }
            },
            include: {
              sessions: true
            }
          });
          res.cookie("session-token", user.sessions[0].token, {
            httpOnly: true,
          });
          res.json({ user });
        }

const login = (client: PrismaClient): RequestHandler =>
    async(req, res) => {
        const { email, password } = req.body as LoginBody;
        const user = await client.user.findFirst({
            where: {
                email,
            }
        });
        if (!user) {
            res.status(404).json({message: "Invalid credentials"});
            return;
        }
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            res.status(404).json({message: "Invalid credentials"});
            return;
        }
        const token = uuidv4();
        const session = await client.session.create({
            data: {
            userId: user.id,
            token,
            }
        });
        res.cookie("session-token", session.token, {
            httpOnly: true,
            });
            res.send(session);
    }

export const usersController = controller(
    "users",
    [{ path: "/create", endpointBuilder: createUser, method: "post", skipAuth: true },
        { path: "/login", endpointBuilder: login, method: "post", skipAuth: true }
    ]);