import { Quadstore } from "quadstore";
import { createContext } from "react";

const defaultOntologyContext: Quadstore = undefined
export const OntologyContext = createContext(defaultOntologyContext)

export const LabelContext = createContext({})

const defaultPadContext: Quadstore = undefined
export const PadContext = createContext(defaultPadContext)

const defaultSourcesContext: Array<object> = []
export const SourcesContext = createContext(defaultSourcesContext)
