import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { CreateHusbandryRecordBody, RequestWithSession } from "../dto/dto";
import { controller } from "../lib/controller";

const createHusbandryRecord = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithSession, res) => {
        const user = req.user;
        const { length, weight, temperature, humidity } = req.body as CreateHusbandryRecordBody;
        const reptileId = +req.params.reptileId;
        const reptile = await client.reptile.findFirst({
            where: {
                id: reptileId
            }
        });
        if (reptile?.userId == user.id) {
            const date: Date = new Date();
            const husbandryRecord = await client.husbandryRecord.create({
                data: {
                    reptileId,
                    length,
                    weight,
                    temperature,
                    humidity,
                    createdAt: date,
                    updatedAt: date
                }
            });
            res.json({ husbandryRecord });
        } else {
            res.status(404).json({ message: "ERROR: You do not have permission to care for this reptile" });
        }
    }

const getHusbandryRecords = (client: PrismaClient): RequestHandler =>
    async (req:RequestWithSession, res) => {
        const user = req.user;
        const reptileId = +req.params.reptileId;
        const reptile = await client.reptile.findFirst({
            where: {
                id: reptileId
            }
        });
        if (reptile?.userId == user.id) {
            const records = await client.husbandryRecord.findMany({
                where: {
                    reptileId
                }
            });
            res.json({ records });
        } else {
            res.status(404).json({ message: "ERROR: You do not have permission to care for this reptile" });
        }
    }

export const husbandryController = controller(
    "husbandry",
    [{ path: "/:reptileId", endpointBuilder: createHusbandryRecord, method: "post" },
    { path: "/:reptileId", endpointBuilder: getHusbandryRecords, method: "get" },
    ]);
