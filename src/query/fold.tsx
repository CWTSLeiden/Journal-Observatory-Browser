function fold_graph(graph: Array<object>): Array<object> {
    return graph.map((g) => {
        return fold_object(g, graph);
    });
}

function fold_object(obj: object, topgraph: Array<object>) {
    for (const [k, v] of Object.entries(obj)) {
        const new_value = fold_value(v, topgraph);
        if (new_value && new_value != v) {
            obj[k] = new_value;
        }
    }
    return obj;
}

function fold_value(val: Array<object>, topgraph: Array<object>): Array<object>;
function fold_value(val: string, topgraph: Array<object>): string;
function fold_value(val: object, topgraph: Array<object>): object;
function fold_value(val: unknown, topgraph: Array<object>): unknown {
    if (Array.isArray(val) && val.length > 0) {
        return val.map((v: object) => {
            return fold_value(v, topgraph);
        });
    }
    const valmatches = topgraph.filter((g) => {
        return g["@id"] == val["@id"];
    });
    if (valmatches.length > 0) {
        return fold_object(valmatches[0], topgraph);
    }
    return val;
}

export { fold_graph };
