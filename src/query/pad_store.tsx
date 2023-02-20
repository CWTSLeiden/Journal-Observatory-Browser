import * as RDF from "@rdfjs/types"
import { Bindings } from "@comunica/types";
import { DataFactory, Quad, Quad_Graph, Quad_Object, Quad_Predicate, Quad_Subject, Store, Util } from "n3";
import { QueryEngine } from "@comunica/query-sparql";
import { query_quads, query_select } from "./query";

function Qsubject(t : RDF.Term): Quad_Subject | undefined {
    if (Util.isNamedNode(t)) { return DataFactory.namedNode(t.value) }
    if (Util.isBlankNode(t)) { return DataFactory.blankNode(t.value) }
    if (Util.isVariable(t)) { return DataFactory.variable(t.value) }
}
function Qpredicate(t : RDF.Term): Quad_Predicate | undefined {
    if (Util.isNamedNode(t)) { return DataFactory.namedNode(t.value) }
    if (Util.isVariable(t)) { return DataFactory.variable(t.value) }
}
function Qobject(t : RDF.Term): Quad_Object | undefined {
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

function Qquad(s : RDF.Term, p : RDF.Term, o : RDF.Term, g : RDF.Term) : Quad | undefined {
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
    const quads = await query_select(query, engine)
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
    const quads = await query_quads(query, engine)
    const store = new Store()
    store.addQuads(quads)
    return store
}

