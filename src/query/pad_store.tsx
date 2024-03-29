import { MemoryLevel } from 'memory-level';
import { BlankNode, DataFactory, DefaultGraph, Literal, NamedNode, Variable } from 'rdf-data-factory';
import * as RDF from "@rdfjs/types"
import { Bindings } from "@comunica/types";
import { query_quads, query_select } from "./remote";
import { Quad, Quadstore } from "quadstore";

function Qsubject(df: DataFactory, t : RDF.Term): NamedNode | BlankNode | Variable | undefined {
    if (t.termType == 'NamedNode') { return df.namedNode(t.value) }
    if (t.termType == 'BlankNode') { return df.blankNode(t.value) }
    if (t.termType == 'Variable') { return df.variable(t.value) }
}
function Qpredicate(df: DataFactory, t : RDF.Term): NamedNode | Variable | undefined {
    if (t.termType == 'NamedNode') { return df.namedNode(t.value) }
    if (t.termType == 'Variable') { return df.variable(t.value) }
}
function Qobject(df: DataFactory, t : RDF.Term): NamedNode | BlankNode | Variable | Literal | undefined {
    if (t.termType == 'NamedNode') { return df.namedNode(t.value) }
    if (t.termType == 'BlankNode') { return df.blankNode(t.value) }
    if (t.termType == 'Variable') { return df.variable(t.value) }
    if (t.termType == 'Literal') { return df.literal(t.value) }
}
function Qgraph(df: DataFactory, t : RDF.Term): NamedNode | BlankNode | Variable | DefaultGraph | undefined {
    if (t.termType == 'NamedNode') { return df.namedNode(t.value) }
    if (t.termType == 'BlankNode') { return df.blankNode(t.value) }
    if (t.termType == 'Variable') { return df.variable(t.value) }
    return df.defaultGraph()
}

function Qquad(s : RDF.Term, p : RDF.Term, o : RDF.Term, g : RDF.Term) : Quad | undefined {
    const df = new DataFactory()
    const S = Qsubject(df, s)
    const P = Qpredicate(df, p)
    const O = Qobject(df, o)
    const G = Qgraph(df, g)
    if (S && P && O && G) {
        return df.quad(S, P, O, G)
    }
}

async function binds2store(binds: Bindings[], store: Quadstore): Promise<Quadstore> {
    binds.map(bind => {
        const q = Qquad(
            bind.get("s"),
            bind.get("p"),
            bind.get("o"),
            bind.get("g"))
        q ? store.put(q) : null
    })
    return store
}

async function createStore(): Promise<Quadstore> {
    const backend = new MemoryLevel()
    const df = new DataFactory()
    const store = new Quadstore({backend, dataFactory: df})
    await store.open();
    return store
}

export async function pad_store(pad_id: string): Promise<Quadstore> {
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
                service <repository:pad> { graph ?g { ?s ?p ?o } }
            }
            union
            {
                ?pad pad:hasAssertion ?a .
                ?a pad:hasSourceAssertion ?s .
                graph ?g { ?s ?p ?o }
            }
        }
        values (?pad) {(<${pad_id}>)}
    `;
    const quads = await query_select(query)
    const store = await createStore()
    return await binds2store(quads, store)
}

export async function ontology_store(): Promise<Quadstore> {
    const query = `
        construct { ?s ?p ?o }
        where {
            { graph pad:ontology { ?s ?p ?o } }
            union
            { graph scpo:ontology { ?s ?p ?o } }
        }
    `
    const quads = await query_quads(query)
    const store = await createStore()
    store.multiPut(quads)
    return store
}

