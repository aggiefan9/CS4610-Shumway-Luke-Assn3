import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { CreateReptileBody, UpdateReptileBody, RequestWithSession } from "../dto/dto";
import { controller } from "../lib/controller";

const createReptile = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithSession, res) => {
        const {name, species, sex} = req.body as CreateReptileBody;
        const user = req.user;
        if (user) {
            let date: Date = new Date();
            const reptile = await client.reptile.create({
                data: {
                name,
                species,
                sex,
                userId: user.id,
                createdAt: date,
                updatedAt: date
                },
            });
            res.json({ reptile });
        } else {
            res.status(404).json({message: "An error has occured"});
        }
    }

const updateReptile = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithSession, res) => {
        const id: number = +req.params.id;
        const { species, name, sex } = req.body as UpdateReptileBody;
        const user = req.user;
        const oldReptile = await client.reptile.findFirst({
            where: {
                id,
            }
        });
        if (user && oldReptile?.userId == user?.id) {
            const date: Date = new Date();
            if (name) {
                let reptile = await client.reptile.update({
                    where: {
                        id
                    },
                    data: {
                        name,
                        updatedAt: date
                    }
                });
            }
            if (species) {
                let reptile = await client.reptile.update({
                    where: {
                        id
                    },
                    data: {
                        species,
                        updatedAt: date
                    }
                });
            }
            if (sex) {
                let reptile = await client.reptile.update({
                    where: {
                        id
                    },
                    data: {
                        sex,
                        updatedAt: date
                    }
                });
            }
            const reptile = await client.reptile.findFirst({
                where: {
                    id
                }
            });
            res.json({ reptile });
        } else {
            res.status(404).json({message: "ERROR: You do not have permission to edit this reptile"});
        }
    }

const getReptiles = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithSession, res) => {
        const user = req.user;
        const reptiles = await client.reptile.findMany({
            where: {
                user
            }
        });
        res.json({ reptiles });
    }

const deleteReptile = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithSession, res) => {
        const user = req.user;
        const id: number = +req.params.id;
        const repToDelete = await client.reptile.findFirst({
            where: {
                id
            }
        });
        if (user && repToDelete?.userId == user?.id) {
            const deleted = await client.reptile.delete({
                where: {
                    id
                }
            });
        }
        // I am currently returning a list of all remaining reptiles, I don't know if I should instead return the deleted reptile,
        // But I figure in production, with a website and all, after deleting a reptile we will probably be taken back to the list of all reptiles
        const reptiles = await client.reptile.findMany({
            where: {
                user
            }
        });
        res.json({ reptiles });
    }

export const reptilesController = controller(
    "reptiles",
    [{ path: "/create", endpointBuilder: createReptile, method: "post" },
    { path: "/update/:id", endpointBuilder: updateReptile, method: "post" },
    { path: "/", endpointBuilder: getReptiles, method: "get"},
    { path: "/delete/:id", endpointBuilder: deleteReptile, method: "post" },
    ]);