import express, { RequestHandler, Request } from "express";
import { PrismaClient, Session, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import cookieParser from "cookie-parser";
import { usersController } from "./controllers/users";
import { reptilesController } from "./controllers/reptiles";

const client = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cookieParser());


usersController(app, client);
reptilesController(app, client);

app.get("/users", async (req, res) => {
  const users = await client.user.findMany();
  res.json({ users });
})

app.get("/", (req, res) => {
  res.send(`<h1>Hello, world!</h1>`);
});

app.listen(3000, () => {
  console.log("I got started!");
});