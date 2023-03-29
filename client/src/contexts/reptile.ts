import { createContext } from "react";

export const ReptileContext = createContext<(id: number) => void>((id) => {});