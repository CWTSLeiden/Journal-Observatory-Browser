import * as RDF from "@rdfjs/types"
import { QueryEngine } from "@comunica/query-sparql-rdfjs";
import { Bindings, IDataSource } from "@comunica/types";
import { fromRDF, compact, flatten } from "jsonld";
import { DataFactory, Quad, Quad_Graph, Quad_Object, Quad_Predicate, Quad_Subject, Store, Util } from "n3";
import { context, endpoint } from "../config";

export type Sources = [IDataSource, ...IDataSource[]]
export const defaultSource: Sources = [endpoint]

function format_query(query: string) {
    let prefix = "";
    for (const ns in context) {
        prefix += `prefix ${ns}: <${context[ns]}> \n`;
    }
    return `${prefix}\n${query}`;
}

async function query_jsonld(query: string, engine: QueryEngine, sources = defaultSource): Promise<Array<object>> {
    const response = await engine.queryQuads(
        format_query(query),
        {
            sources: sources,
            unionDefaultGraph: true,
            localizeBlankNodes: true
        }
    );
    const quads = await response.toArray();
    const document = await fromRDF(quads);
    const document_flat = await flatten(document, context);
    const document_compact = await compact(document_flat, context, {compactArrays: false});
    return Array.isArray(document_compact["@graph"]) ? document_compact["@graph"] : [];
}

async function query_select(query: string, engine: QueryEngine, sources = defaultSource) {
    const response = await engine.queryBindings(
        format_query(query),
        { sources: sources, unionDefaultGraph: true }
    );
    const bindings = await response.toArray();
    return bindings;
}

async function query_single(query: string, engine: QueryEngine, sources = defaultSource) {
    const bindings = await query_select(query, engine, sources)
    const binding =  bindings.find(Boolean)
    if (binding) {
        for (const node of binding.values()) {
            return node.value;
        }
    }
}

function Qsubject(t : RDF.Term): Quad_Subject {
    if (Util.isNamedNode(t)) { return DataFactory.namedNode(t.value) }
    if (Util.isBlankNode(t)) { return DataFactory.blankNode(t.value) }
    if (Util.isVariable(t)) { return DataFactory.variable(t.value) }
}
function Qpredicate(t : RDF.Term): Quad_Predicate {
    if (Util.isNamedNode(t)) { return DataFactory.namedNode(t.value) }
    if (Util.isVariable(t)) { return DataFactory.variable(t.value) }
}
function Qobject(t : RDF.Term): Quad_Object {
    if (Util.isNamedNode(t)) { return DataFactory.namedNode(t.value) }
    if (Util.isBlankNode(t)) { return DataFactory.blankNode(t.value) }
    if (Util.isVariable(t)) { return DataFactory.variable(t.value) }
    if (Util.isLiteral(t)) { return DataFactory.literal(t.value) }
}
function Qgraph(t : RDF.Term): Quad_Graph {
    if (Util.isNamedNode(t)) { return DataFactory.namedNode(t.value) }
    if (Util.isBlankNode(t)) { return DataFactory.blankNode(t.value) }
    if (Util.isVariable(t)) { return DataFactory.variable(t.value) }
    return DataFactory.defaultGraph()
}

function Qquad(s : RDF.Term, p : RDF.Term, o : RDF.Term, g : RDF.Term) : Quad {
    const S = Qsubject(s)
    const P = Qpredicate(p)
    const O = Qobject(o)
    const G = Qgraph(g)
    if (S && P && O && G) {
        return new Quad(S, P, O, G)
    }
}

function binds2store(binds: Bindings[]): Store {
    const store = new Store()
    binds.map(bind => {
        const q = Qquad(bind.get("s"),
            bind.get("p"),
            bind.get("o"),
            bind.get("g"))
        q ? store.add(q) : null
    })
    return store
}

export async function pad_store(pad_id: string, engine: QueryEngine): Promise<Store> {
    const query = `
        select ?s ?p ?o ?g 
        where {
            {
                graph ?g { ?pad a pad:PAD . ?s ?p ?o }
            }
            union
            {
                ?pad pad:hasAssertion ?g .
                graph ?g { ?s ?p ?o }
            }
            union
            {
                ?pad pad:hasProvenance ?g .
                graph ?g { ?s ?p ?o }
            }
            union
            {
                ?pad pad:hasAssertion ?a .
                ?a pad:hasSourceAssertion ?g .
                service <repository:pad> {graph ?g { ?s ?p ?o }}
            }
            union
            {
                ?pad pad:hasAssertion ?a .
                ?a pad:hasSourceAssertion ?sa .
                service <repository:pad> {
                    ?spad pad:hasAssertion ?sa ;
                        pad:hasProvenance ?g .
                    graph ?g { ?s ?p ?o }
                }
            }
        }
        values (?pad) {(pad:${pad_id})}
    `;
    const response = await engine.queryBindings(format_query(query), {
        sources: [endpoint]
    });
    const quads = await response.toArray()
    return binds2store(quads)
}

export async function ontology_store(engine: QueryEngine): Promise<Store> {
    const query = `
        construct { ?s ?p ?o }
        where {
            { graph pad:ontology { ?s ?p ?o } }
            union
            { graph ppo:ontology { ?s ?p ?o } }
        }
    `
    const response = await engine.queryQuads(format_query(query), {
        sources: [endpoint]
    });
    const quads = await response.toArray()
    const store = new Store()
    store.addQuads(quads)
    return store
}


export { query_single, query_jsonld, query_select };
