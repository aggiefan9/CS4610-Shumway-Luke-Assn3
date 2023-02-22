import express from "express";
import { PrismaClient} from "@prisma/client";
import cookieParser from "cookie-parser";
import { usersController } from "./controllers/users";
import { reptilesController } from "./controllers/reptiles";
import { feedingsController } from "./controllers/feedings";
import { husbandryController } from "./controllers/husbandry_records";
import { schedulesController } from "./controllers/schedules";

const client = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cookieParser());


usersController(app, client);
reptilesController(app, client);
feedingsController(app, client);
husbandryController(app, client);
schedulesController(app, client);

app.listen(3000, () => {
  console.log("I got started!");
});