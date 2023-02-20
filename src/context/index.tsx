import { QueryEngine } from "@comunica/query-sparql";
import { Quadstore } from "quadstore";
import { createContext } from "react";

export type AppContext = {
    ontologyStore?: Quadstore;
    sparqlEngine: QueryEngine;
}

const defaultAppContext: AppContext = {
    sparqlEngine: new QueryEngine()
}

export const AppContext = createContext(defaultAppContext)


const defaultPadContext: Quadstore = undefined

export const PadContext = createContext(defaultPadContext)
