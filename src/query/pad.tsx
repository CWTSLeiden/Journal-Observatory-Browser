import { QueryEngine } from "@comunica/query-sparql";
import { query_single, query_jsonld } from "./query";

const ld_to_str = (obj: string | object | Array<object> | Array<string>): string => {
    const to_str = o => o["@id"] || o["@value"] || String(o);
    return Array.isArray(obj) ? obj.map(to_str).join(", ") : to_str(obj)
}

function pad_id_norm(pad_id: string) {
    const regex = /([A-Za-z0-9-]+)$/i
    const result = regex.exec(pad_id)
    return (result && result[0]) || pad_id
}

async function pad_single(num: number, engine: QueryEngine) {
    const query = `select ?pad where { ?pad a pad:PAD } limit 1 offset ${num}`;
    return await query_single(query, engine);
}

async function platform_name_single(pad_id: string, engine: QueryEngine) {
    const query = `
        select ?name where {
            ?pad a pad:PAD ;
                pad:hasAssertion ?assertion .
            graph ?assertion { ?s a ppo:Platform ; schema:name ?name }
        }
        values (?pad) {(pad:${pad_id})}
    `;
    const name = await query_single(query, engine)
    return name || pad_id
}

async function pad_doc(pad_id: string, engine: QueryEngine) {
    const query = `
        construct {
            ?s ?p ?o .
        }
        where {
            ?pad a pad:PAD ;
                pad:hasAssertion ?assertion .
            graph ?assertion { ?s ?p ?o } .
        }
        values (?pad) {(pad:${pad_id})}
    `;
    const graph = await query_jsonld(query, engine);
    delete graph["@context"]
    return JSON.stringify(graph, null, 2)
}

export { pad_id_norm, pad_single, platform_name_single, pad_doc, ld_to_str };
