import { QueryEngine } from "@comunica/query-sparql-rdfjs";
import { IDataSource } from "@comunica/types";
import { fromRDF, compact, flatten } from "jsonld";
import { context, endpoint } from "../config";

export type Sources = [IDataSource, ...IDataSource[]]
export const defaultSource: Sources = [endpoint]

export function format_query(query: string) {
    let prefix = "";
    for (const ns in context) {
        prefix += `prefix ${ns}: <${context[ns]}> \n`;
    }
    return `${prefix}\n${query}`;
}

export async function query_select(query: string, engine: QueryEngine, sources = defaultSource) {
    const response = await engine.queryBindings(
        format_query(query),
        { sources: sources, unionDefaultGraph: true }
    );
    const bindings = await response.toArray();
    return bindings;
}

export async function query_quads(query: string, engine: QueryEngine, sources = defaultSource) {
    const response = await engine.queryQuads(
        format_query(query),
        { sources: sources, unionDefaultGraph: true }
    );
    const quads = await response.toArray();
    return quads;
}

export async function query_jsonld(query: string, engine: QueryEngine, sources = defaultSource): Promise<Array<object>> {
    const quads = query_quads(query, engine, sources)
    const document = await fromRDF(quads);
    const document_flat = await flatten(document, context);
    const document_compact = await compact(document_flat, context, {compactArrays: false});
    return Array.isArray(document_compact["@graph"]) ? document_compact["@graph"] : [];
}

export async function query_single(query: string, engine: QueryEngine, sources = defaultSource) {
    const bindings = await query_select(query, engine, sources)
    const binding =  bindings.find(Boolean)
    if (binding) {
        for (const node of binding.values()) {
            return node.value;
        }
    }
}
