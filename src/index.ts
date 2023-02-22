import express from "express";
import { PrismaClient} from "@prisma/client";
import cookieParser from "cookie-parser";
import { usersController } from "./controllers/users";
import { reptilesController } from "./controllers/reptiles";
import { feedingsController } from "./controllers/feedings";
import { husbandryController } from "./controllers/husbandry_records";

const client = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cookieParser());


usersController(app, client);
reptilesController(app, client);
feedingsController(app, client);
husbandryController(app, client);

app.get("/users", async (req, res) => {
  const users = await client.user.findMany();
  res.json({ users });
});

app.get("/", (req, res) => {
  res.send(`<h1>Hello, world!</h1>`);
});

app.listen(3000, () => {
  console.log("I got started!");
});