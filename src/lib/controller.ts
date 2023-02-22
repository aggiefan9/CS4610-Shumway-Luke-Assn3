import { PrismaClient, Session, User } from "@prisma/client";
import express, { RequestHandler, Express, Request } from "express";
import { RequestWithSession, Route } from "../dto/dto";

  

export const controller = (name: string, routes: Route[]) => (app: Express, client: PrismaClient) => {
  const authenticationMiddleware: RequestHandler = async (req: RequestWithSession, res, next) => {
    const sessionToken = req.cookies["session-token"];
    if (sessionToken) {
      const session = await client.session.findFirst({
        where: {
        token: sessionToken
        },
        include: {
        user: true
        }
      });
      if (session) {
        req.session = session;
        req.user = session.user;
        next();
      } else {
        res.status(404).json({message: "unauthorized"});
      }
    } else {
      res.status(404).json({message: "unauthorized"});
    }
  }
  const router = express.Router();
  routes.forEach(route => {
    if (!route.skipAuth) {
      router.use(route.path, (req, res, next) => {
        if (req.method.toLowerCase() === route.method) {
          authenticationMiddleware(req, res, next);
        } else {
          next();
        }
      });
    }
    router[route.method](route.path, route.endpointBuilder(client));
  })
  app.use(`/${name}`, router);
}