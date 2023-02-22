import express, { RequestHandler, Request } from "express";
import { PrismaClient, Session, Reptile, Feeding, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { CreateFeedingBody, RequestWithSession } from "../dto/dto";
import { controller } from "../lib/controller";

const createFeeding = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithSession, res) => {
        const user = req.user;
        const reptileId: number = +req.params.reptileId;
        const { foodItem } = req.body as CreateFeedingBody;
        const reptile = await client.reptile.findFirst({
            where: {
                id: reptileId
            }
        });
        if (reptile?.userId == user.id) {
            const date: Date = new Date();
            const feeding = await client.feeding.create({
                data: {
                    reptileId,
                    foodItem,
                    createdAt: date,
                    updatedAt: date
                }
            });
            res.json({ feeding });
        } else {
            res.status(404).json({ message: "ERROR: You do not have permission to feed this reptile" });
        }
    }

const getFeedings = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithSession, res) => {
        const user = req.user;
        const reptileId: number = +req.params.reptileId;
        const reptile = await client.reptile.findFirst({
            where: {
                id: reptileId
            }
        });
        if (reptile?.userId == user.id) {
            const feedings = await client.feeding.findMany({
                where: {
                    reptileId
                }
            });
            res.json({ feedings });
        } else {
            res.status(404).json({ message: "ERROR: You do not have permission to feed this reptile" });
        }
    }

export const feedingsController = controller(
    "feedings",
    [{ path: "/:reptileId", endpointBuilder: createFeeding, method: "post" },
    { path: "/:reptileId", endpointBuilder: getFeedings, method: "get" },
    ]);