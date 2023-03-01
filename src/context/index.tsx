import { Quadstore } from "quadstore";
import { createContext } from "react";

export type AppContext = {
    ontologyStore?: Quadstore;
    labels?: object
}

const defaultAppContext: AppContext = undefined
export const AppContext = createContext(defaultAppContext)


const defaultPadContext: Quadstore = undefined
export const PadContext = createContext(defaultPadContext)
