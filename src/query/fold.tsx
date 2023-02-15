function fold_graph(graph: Array<object>, depth=10): Array<object> {
    return graph.map((g) => {
        const topgraph = structuredClone(graph)
        return fold_object(g, topgraph, depth);
    });
}

function fold_object(obj: object, topgraph: Array<object>, depth: number) {
    if (depth < 1) { return undefined }
    for (const [k, v] of Object.entries(obj)) {
        const new_value = fold_value(v, topgraph, depth-1);
        if (new_value && new_value != v) {
            obj[k] = new_value;
        }
    }
    return obj;
}

function fold_value(val: Array<object>, topgraph: Array<object>, depth: number): Array<object>;
function fold_value(val: string, topgraph: Array<object>, depth: number): string;
function fold_value(val: object, topgraph: Array<object>, depth: number): object;
function fold_value(val: unknown, topgraph: Array<object>, depth: number): unknown {
    if (depth < 1) { return undefined }
    if (Array.isArray(val) && val.length > 0) {
        return val.map((v: object) => {
            return fold_value(v, topgraph, depth) || v;
        });
    }
    const match = topgraph.filter((g) => g["@id"] == val["@id"]).find(Boolean)
    if (match) {
        return fold_object(match, topgraph, depth-1) || match;
    }
    return val;
}

export { fold_graph };
