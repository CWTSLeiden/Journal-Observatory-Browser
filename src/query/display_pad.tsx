import React, { ReactElement } from "react";
import {
    SrcView,
    ValueView,
    IdView,
    DefListView,
    ListView,
    UnorderedListView,
    OrderedListView,
    LoadingView,
} from "../components/pad";
import { ld_to_str } from "./pad";

const src_to_div = (src?: Array<object>): ReactElement =>
    src ? <SrcView sources={src.map(ld_to_str)} /> : null;

function graph_to_react(obj: object | string, crumb?: string): ReactElement {
    const srcView = src_to_div(obj["ppo:_src"]);
    if (obj["@value"]) {
        return (
            <ValueView
                key={`${crumb}.${obj["@value"]}`}
                value={obj["@value"]}
                src={srcView}
            />
        );
    }
    if (obj["@id"] && Object.entries(obj).length == 1) {
        return (
            <IdView
                key={`${crumb}.${obj["@id"]}`}
                id={obj["@id"]}
                src={srcView}
            />
        );
    }
    if (obj["@id"]) {
        const key = `${crumb}.${obj["@id"]}`;
        const sub = Object.entries(obj)
            .filter(([k]) => !["@id", "@context", "ppo:_src"].includes(k))
            .map(([k, v]) => {
                return (
                    <DefListView
                        key={`${key}.${k}`}
                        title={k}
                        value={graph_to_react(v, `${key}.${k}`)}
                    />
                );
            });
        const ul =
            sub.length > 0 ? (
                <UnorderedListView>{sub}</UnorderedListView>
            ) : null;
        return (
            <IdView key={key} id={obj["@id"]} src={srcView}>
                {ul}
            </IdView>
        );
    }
    if (Array.isArray(obj) && obj.length > 0) {
        const sub = obj.map((o, i) => {
            const c = `${crumb}.${i}`;
            return <ListView key={c} value={graph_to_react(o, c)} />;
        });
        return <UnorderedListView src={srcView}>{sub}</UnorderedListView>;
    }
    if (Array.isArray(obj) && obj.length == 0) {
        return null;
    }
    return (
        <ValueView
            key={`${crumb}.${String(obj)}`}
            value={String(obj)}
            src={srcView}
        />
    );
}

function graph_to_ul(graph: Array<object>): ReactElement {
    if (!graph) {
        return <LoadingView />;
    }
    const sub = graph.map((g) => {
        return <ListView key={g["@id"]} value={graph_to_react(g, g["@id"])} />;
    });
    return sub.length > 0 ? <OrderedListView>{sub}</OrderedListView> : null;
}

function property_to_li(
    thing: object | string,
    title?: string,
    src?: Array<object>,
    crumb?: string
) {
    const value = graph_to_react(thing, crumb);
    const key = [crumb, title, ld_to_str(thing)].filter(Boolean).join(".");
    const srcView = src_to_div(src);
    if (title) {
        return (
            <DefListView key={key} title={title} value={value} src={srcView} />
        );
    }
    return <ListView key={key} value={value} src={srcView} />;
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

function pgraph_to_ul(graph?: Array<object>, param?: string): ReactElement {
    if (!graph) {
        return <LoadingView />;
    }
    const pgraph = param ? graph.filter((g) => g[param]) : graph;
    const li = pgraph.map((g) => pgraph_to_li(g, param));
    return li.length > 0 ? <UnorderedListView>{li}</UnorderedListView> : null;
}

export { graph_to_ul, pgraph_to_ul };
