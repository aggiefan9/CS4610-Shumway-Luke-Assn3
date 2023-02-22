import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

import { controller } from "../lib/controller";
import { CreateScheduleBody, RequestWithSession } from "../dto/dto";

const createSchedule = (client: PrismaClient): RequestHandler =>
    async(req: RequestWithSession, res) => {
        const user = req.user;
        const reptileId = +req.params.reptileId;
        const { type, description, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body as CreateScheduleBody;
        const reptile = await client.reptile.findFirst({
            where: {
                id: reptileId
            }
        });
        if (user && reptile?.userId == user?.id) {
            const date: Date = new Date();
            const schedule = await client.schedule.create({
                data: {
                    reptileId,
                    userId: user.id,
                    type,
                    description,
                    monday,
                    tuesday,
                    wednesday,
                    thursday,
                    friday,
                    saturday,
                    sunday,
                    createdAt: date,
                    updatedAt: date
                }
            });
            res.json({ schedule });
        } else {
            res.status(404).json({message: "ERROR: You do not have permission to care for this reptile"});
        }
    }

const getRepSchedules = (client: PrismaClient): RequestHandler =>
    async(req: RequestWithSession, res) => {
        const user = req.user;
        const reptileId = +req.params.reptileId;
        const reptile = await client.reptile.findFirst({
            where: {
                id: reptileId
            }
        });
        if (user && reptile?.userId == user?.id) {
            const schedules = await client.schedule.findMany({
                where: {
                    reptileId
                }
            });
            res.json({ schedules });
        } else {
            res.status(404).json({message: "ERROR: You do not have permission to care for this reptile"});
        }
    }

    const getUserSchedules = (client: PrismaClient): RequestHandler =>
    async(req: RequestWithSession, res) => {
        const user = req.user;
        if (user) {
            const schedules = await client.schedule.findMany({
                where: {
                    userId: user.id
                }
            });
            res.json({ schedules });
        } else {
            res.status(404).json({message: "An error has occured"});
        }
    }

export const schedulesController = controller(
    "schedules",
    [{ path: "/:reptileId", endpointBuilder: createSchedule, method: "post" },
    { path: "/:reptileId", endpointBuilder: getRepSchedules, method: "get" },
    { path: "/", endpointBuilder: getUserSchedules, method: "get" }
    ]);