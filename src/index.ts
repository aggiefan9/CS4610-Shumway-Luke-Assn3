import express from "express";
import { PrismaClient} from "@prisma/client";
import cookieParser from "cookie-parser";
import { usersController } from "./controllers/users";
import { reptilesController } from "./controllers/reptiles";
import { feedingsController } from "./controllers/feedings";
import { husbandryController } from "./controllers/husbandry_records";
import { schedulesController } from "./controllers/schedules";
import cors from 'cors';

const client = new PrismaClient();
const app = express();

// import path from "path";
// import { engine } from "express-handlebars";
// app.engine("hbs", engine({ extname: ".hbs" }));
// app.set("view engine", "hbs");
// app.set("views", path.join(__dirname, "/views"));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
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