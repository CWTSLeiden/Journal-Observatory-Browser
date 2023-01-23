import React, { ReactElement } from "react";

function obj_to_li(
    val: Array<object> | string | object,
    topgraph: Array<object>
): ReactElement {
    if (Array.isArray(val) && val.length > 0) {
        const li = val.map((v: object) => {
            return obj_to_li(v, topgraph);
        });
        return <ul>{li}</ul>;
    }
    const valmatches = topgraph.filter((g) => {
        return g["@id"] == val["@id"];
    });
    if (valmatches.length > 0) {
        const li = valmatches.map((v: object) => {
            return obj_to_li(v, topgraph);
        });
        return <ul>{li}</ul>;
    }
    if (val["@value"]) {
        return <li key="">{val["@value"]}</li>;
    }
    if (val["@id"]) {
        return <li key="">{val["@id"]}</li>;
    }
    return <li key="">{String(val)}</li>;
}

function graph_to_li(
    graph: Array<object>,
    topgraph: Array<object>
): ReactElement {
    const li = graph.map((g) => {
        const lis = Object.entries(g).map(([k, v]) => {
            return obj_to_li(v, topgraph);
        });
        console.log(lis)
        return lis
    })
    return <ul>{li}</ul>;
}

export { graph_to_li };
