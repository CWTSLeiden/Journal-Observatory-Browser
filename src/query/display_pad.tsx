import React, { ReactElement } from "react";

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

function src_to_li(
    src?: Array<object> | object
): ReactElement {
    if (!src) {
        return <div></div>
    }
    let number_of_sources = 0
    let sources = ""
    if (Array.isArray(src) && src.length > 0) {
        number_of_sources = src.length
        sources = src.map(s => s["@id"]).join(", ")
    }
    else if (src["@id"]) {
        number_of_sources = 1
        sources = src["@id"]
    }
    return (
        <div className="src">
            <div className="src-short">{ number_of_sources }</div>
            <div className="src-long">{ sources }</div>
        </div>
    )
}

function obj_to_str(
    obj: object | string
): string {
    if (obj["@value"]) {return obj["@value"];}
    return String(obj)
}

function obj_to_li(
    obj: Array<object> | string | object,
    dt?: string,
    key?: string,
    src?: object
): ReactElement {
    if (Array.isArray(obj) && obj.length > 0) {
        return <div key={key}>{obj.map((v: object) => obj_to_li(v, undefined, key, src))}</div>;
    }
    let li = undefined
    if (obj["@id"]) {
        const sub = Object.entries(obj).map(([k, v]) => {
            if (!(["@id", "@context", "ppo:_src"].includes(k))) {
                return obj_to_li(v, k, k+key, src);
            }
        }).filter(s => s);
        key = key + obj["@id"]
        if (sub.length > 0) {
            return <div key={key}>{sub}</div>
        } else {
            li = obj["@id"]
        }
    } else {
        li = obj_to_str(obj)
        key = key + obj_to_str(obj)
    }
    if (dt) {
        return <li key={key}><dt>{dt}</dt><dd>{li}</dd>{src_to_li(src)}</li>;
    } else {
        return <li key={key}>{li}{src_to_li(src)}</li>;
    }
}

function graph_to_li(graph: Array<object> | object, param?: string): ReactElement {
    if (!graph) {
        return <div>Loading...</div>
    }
    if (graph["@graph"]) {
       graph = graph["@graph"]
    }
    if (Array.isArray(graph) && graph.length > 0) {
        let li = undefined
        if (param) {
            const filtered = graph.filter((g) => {
                return g[param];
            });
            li = filtered.map((g) =>
                obj_to_li(g[param], undefined, param, g["ppo:_src"])
            );
        } else {
            li = graph.map((g) =>
                obj_to_li(g, undefined, undefined, g["ppo:_src"])
            );
        }
        return <ul>{li}</ul>;
    }
    return <ul>{ obj_to_li(graph, undefined, graph["@id"], graph["ppo:_src"])}</ul>
}

export { graph_to_li, fold_graph };
