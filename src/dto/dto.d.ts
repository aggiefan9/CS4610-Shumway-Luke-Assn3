import { Request } from "express";

export type Route = {
    path: string,
    method: "post" | "put" | "get" | "delete",
    endpointBuilder: (client: PrismaClient) => RequestHandler,
    skipAuth?: boolean
}
  
export type RequestWithSession = Request & {
    session?: Session
    user?: User
}

export type CreateUserBody = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
}
    
export type LoginBody = {
    email: string,
    password: string
}

export type CreateReptileBody = {
    species: "ball_python" | "king_snake" | "corn_snake" | "redtail_boa",
    name: string,
    sex: "m" | "f"
}

export type UpdateReptileBody = {
    species?: "ball_python" | "king_snake" | "corn_snake" | "redtail_boa",
    name?: string,
    sex?: "m" | "f"
}

export type CreateFeedingBody = {
    foodItem: string
}

export type CreateHusbandryRecordBody = {
    length: number,
    weight: number,
    temperature: number,
    humidity: number,
}