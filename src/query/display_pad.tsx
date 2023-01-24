import React, { ReactElement, ReactNode } from "react";
import { LinkItUrl } from "react-linkify-it";

function urlize(thing: ReactNode): ReactElement {
    return <LinkItUrl>{thing}</LinkItUrl>;
}

function src_to_div(src?: Array<object> | object): ReactElement {
    if (!src) {
        return undefined;
    }
    let number_of_sources = 0;
    let sources = "";
    if (Array.isArray(src) && src.length > 0) {
        number_of_sources = src.length;
        sources = src.map((s) => s["@id"]).join(", ");
    } else if (src["@id"]) {
        number_of_sources = 1;
        sources = src["@id"];
    }
    return (
        <div className="src">
            <div className="src-short">{number_of_sources}</div>
            <div className="src-long">{urlize(sources)}</div>
        </div>
    );
}

function graph_to_react(obj: object | string, crumb?: string): ReactElement {
    const src = src_to_div(obj["ppo:_src"]);
    if (obj["@value"]) {
        const c = `${crumb}.${obj["@value"]}`;
        return (
            <div key={c} className="value">
                {urlize(obj["@value"])}
                {src}
            </div>
        );
    }
    if (obj["@id"] && Object.entries(obj).length == 1) {
        const c = `${crumb}.${obj["@id"]}`;
        return (
            <div key={c} className="id">
                {urlize(obj["@id"])}
                {src}
            </div>
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
        <div className="value">
            {urlize(String(obj))}
            {src}
        </div>
    );
}

function normalize_graph(graph: Array<object> | object): Array<object> {
    if (graph["@graph"]) {
        graph = graph["@graph"];
    }
    if (Array.isArray(graph)) {
        return graph;
    }
    return Array(graph);
}

function property_to_li(
    thing: object | string,
    dt?: string,
    src?: Array<object> | object,
    crumb?: string
) {
    const str = graph_to_react(thing, crumb);
    if (dt) {
        const k = `${crumb}.${dt}`;
        return (
            <li key={k}>
                <dt>{dt}</dt>
                <dd>{str}</dd>
                {src_to_div(src)}
            </li>
        );
    }
    const k = `${crumb}.${thing["@id"] || thing["@value"] || String(thing)}`;
    return (
        <li key={k}>
            {str}
            {src_to_div(src)}
        </li>
    );
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

export { graph_to_ul, pgraph_to_ul };
