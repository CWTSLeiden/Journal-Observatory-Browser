import React, { ReactElement, ReactNode } from "react";
import {
    SrcView,
    ValueView,
    IdView,
    DefListView,
    ListView,
} from "../components/pad";

function normalize_graph(graph: Array<object> | object): Array<object> {
    if (graph["@graph"]) {
        graph = graph["@graph"];
    }
    if (Array.isArray(graph)) {
        return graph;
    }
    return Array(graph);
}

function src_to_div(src?: Array<object> | object): ReactElement {
    if (!src) {
        return undefined;
    }
    if (Array.isArray(src)) {
        return <SrcView sources={src.map((s: object) => s["@id"])} />;
    }
    <SrcView sources={Array(src["@id"])} />;
}

function graph_to_react(obj: object | string, crumb?: string): ReactElement {
    const src = src_to_div(obj["ppo:_src"]);
    if (obj["@value"]) {
        return (
            <ValueView
                value={obj["@value"]}
                crumb={`${crumb}.${obj["@value"]}`}
                src={src}
            />
        );
    }
    if (obj["@id"] && Object.entries(obj).length == 1) {
        return (
            <IdView
                id={obj["@id"]}
                crumb={`${crumb}.${obj["@id"]}`}
                src={src}
            />
        );
    }
    if (obj["@id"]) {
        const sub = Object.entries(obj)
            .map(([k, v]) => {
                if (!["@id", "@context", "ppo:_src"].includes(k)) {
                    const c = `${crumb}.${obj["@id"]}.${k}`;
                    return (
                        <li key={c}>
                            <dt>{k}</dt>
                            <dd>{graph_to_react(v, c)}</dd>
                        </li>
                    );
                }
            })
            .filter((s) => s);
        return (
            <div>
                <div className="id">{obj["@id"]}</div>
                {src}
                <ul>{sub}</ul>
            </div>
        );
    }
    if (Array.isArray(obj) && obj.length > 0) {
        const sub = obj.map((o, i) => {
            const c = `${crumb}.${i}`;
            return <li key={c}>{graph_to_react(o, c)}</li>;
        });
        return (
            <ul>
                {src}
                {sub}
            </ul>
        );
    }
    return (
        <ValueView
            value={String(obj)}
            crumb={`${crumb}.${String(obj)}`}
            src={src}
        />
    );
}

function graph_to_ul(graph: Array<object> | object): ReactElement {
    if (!graph) {
        return <div>Loading...</div>;
    }
    const pgraph = normalize_graph(graph);
    return (
        <ol>
            {pgraph.map((g) => {
                return <li key={g["@id"]}>{graph_to_react(g, g["@id"])}</li>;
            })}
        </ol>
    );
}

function property_to_li(
    thing: object | string,
    dt?: string,
    src?: Array<object> | object,
    crumb?: string
) {
    const value = graph_to_react(thing, crumb);
    const str = thing["@id"] || thing["@value"] || String(thing)
    const key = [crumb, dt, str].filter(Boolean).join(".")
    const srcView = src_to_div(src);
    console.log(key)
    if (dt) {
        return <DefListView title={dt} value={value} crumb={key} src={srcView} />;
    }
    return <ListView value={value} key={key} src={srcView} />;
}

function pgraph_to_li(graph: object, param?: string) {
    if (param) {
        const prop = graph[param];
        if (Array.isArray(prop) && prop.length > 0) {
            return prop.map((p) =>
                property_to_li(p, undefined, graph["ppo:_src"], param)
            );
        }
        return property_to_li(prop, undefined, graph["ppo:_src"]);
    } else {
        return Object.entries(graph).map(([k, v]) => {
            if (!["@id", "@context", "ppo:_src"].includes(k)) {
                if (Array.isArray(v) && v.length > 0) {
                    return v.map((p) =>
                        property_to_li(p, k, graph["ppo:_src"], k)
                    );
                }
                return property_to_li(v, k, graph["ppo:_src"]);
            }
        });
    }
}

function pgraph_to_ul(
    graph: Array<object> | object,
    param?: string
): ReactElement {
    if (!graph) {
        return <div>Loading...</div>;
    }
    let pgraph = normalize_graph(graph);
    if (param) {
        pgraph = pgraph.filter((g) => {
            return g[param];
        });
    }
    const li = pgraph.map((g) => pgraph_to_li(g, param));
    return <ul>{li}</ul>;
}

export { graph_to_ul, pgraph_to_ul };
