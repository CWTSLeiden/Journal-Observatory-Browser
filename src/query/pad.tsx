import { QueryEngine } from "@comunica/query-sparql";
import { query_single } from "./query"

async function pad_single(num:Number, engine:QueryEngine) {
    let query = `select ?pad where { ?pad a pad:PAD } limit 1 offset ${num}`
    return await query_single(query, engine)
};

export { pad_single };
