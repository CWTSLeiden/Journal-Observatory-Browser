import { fromRDF, compact, flatten } from "jsonld";
import { Quadstore } from "quadstore";
import { Engine } from "quadstore-comunica";
import { context } from "../config";
import type { ResultStream, Quad, Bindings } from '@rdfjs/types';
import { format_query } from "./remote";

async function response2array(response: ResultStream<Quad | Bindings>) {
    const end_query = async () =>
        new Promise(resolve => response.on('end', resolve))
    const array = []
    response.on('data', (item) => { array.push(item) })
    await end_query()
    return array
}

export async function mergeQuadstores(store: Quadstore, sources: Quadstore[]): Promise<Quadstore> {
    for (const source of sources) {
        const { items } = await source.get({})
        store.multiPut(items)
    }
    return store
}

export async function query_select(query: string, store: Quadstore) {
    const engine = new Engine(store)
    const response = await engine.queryBindings(
        format_query(query),
        { unionDefaultGraph: true }
    )
    const quads = response2array(response)
    return quads
}

export async function query_quads(query: string, store: Quadstore) {
    const engine = new Engine(store)
    const response = await engine.queryQuads(
        format_query(query),
        { unionDefaultGraph: true }
    )
    const quads = response2array(response)
    return quads
}

export async function query_jsonld(query: string, store: Quadstore) {
    const quads = await query_quads(query, store)
    const document = await fromRDF(quads);
    const document_flat = await flatten(document, context);
    const document_compact = await compact(document_flat, context, {compactArrays: false});
    return Array.isArray(document_compact["@graph"]) ? document_compact["@graph"] : [];
}

export async function query_single(query: string, store: Quadstore) {
    const bindings = await query_select(query, store)
    const binding =  bindings.find(Boolean)
    if (binding) {
        for (const node of binding.values()) {
            return node.value;
        }
    }
}
