import { QueryEngine } from "@comunica/query-sparql";
import { Store } from "n3";
import { createContext } from "react";

export type AppContext = {
    ontologyStore?: Store
    sparqlEngine: QueryEngine
}

const defaultAppContext: AppContext = {
    sparqlEngine: new QueryEngine()
}

export const AppContext = createContext(defaultAppContext)


const defaultPadContext: Store = undefined

export const PadContext = createContext(defaultPadContext)
