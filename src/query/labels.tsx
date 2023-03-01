import { Quadstore } from "quadstore";
import { compact_id, expand_id } from "../config";
import { query_select } from "./local";

async function get_labels(store: Quadstore) {
    const query = `
        select ?property ?label where { 
        ?property rdfs:label ?label
        filter(str(?label) != "")
        }
    `;
    return await query_select(query, store);
}

export async function get_labels_dict (ontologyStore: Quadstore) {
    const labels = await get_labels(ontologyStore)
    const labels_dict = {}
    labels.map((l) => {
        labels_dict[compact_id(l.get("property").value)] = l.get("label").value 
        labels_dict[expand_id(l.get("property").value)] = l.get("label").value
    })
    return labels_dict
}
