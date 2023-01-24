import { QueryEngine } from "@comunica/query-sparql";
import { query_single, query_jsonld } from "./query";

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
        values (?pad) {(<${pad_id}>)}
    `;
    return await query_single(query, engine);
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
        values (?pad) {(<${pad_id}>)}
    `;
    const graph = await query_jsonld(query, engine);
    delete graph["@context"]
    return JSON.stringify(graph, null, 2)
}

export { pad_single, platform_name_single, pad_doc };
