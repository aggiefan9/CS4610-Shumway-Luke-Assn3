import { createContext } from "react";

export const NavContext = createContext<(page: string) => void>((page) => {});
