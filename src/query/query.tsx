import { QueryEngine } from "@comunica/query-sparql";
import { fromRDF, compact } from "jsonld";
import { context, endpoint } from "../config";

function format_query(query: string) {
    let prefix = "";
    for (const ns in context) {
        prefix += `prefix ${ns}: <${context[ns]}> \n`;
    }
    return `${prefix}\n${query}`;
}

async function query_jsonld(query: string, engine: QueryEngine) {
    const response = await engine.queryQuads(format_query(query), {
        sources: [endpoint],
    });
    const quads = await response.toArray();
    const document = await fromRDF(quads);
    const document_compact = await compact(document, context, {compactArrays: false});
    return document_compact;
}

function normalize_graph(graph: Array<object> | object): Array<object> {
    if (graph["@graph"]) {
        graph = graph["@graph"];
    }
    if (Array.isArray(graph)) {
        return graph;
    }
    if (graph["@id"]) {
        return Array(graph);
    }
    return []
}

async function query_select(query: string, engine: QueryEngine) {
    const response = await engine.queryBindings(format_query(query), {
        sources: [endpoint],
    });
    const bindings = await response.toArray();
    return bindings;
}

async function query_single(query: string, engine: QueryEngine) {
    const response = await engine.queryBindings(format_query(query), {
        sources: [endpoint],
    });
    const bindings = await response.toArray();
    for (const node of bindings[0].values()) {
        return node.value;
    }
}

export { query_single, query_jsonld, query_select, normalize_graph };
