import { QueryEngine } from "@comunica/query-sparql";
import { normalize_graph, query_jsonld, query_single } from "../query/query";
import { SearchState } from "../components/search";
import { pagesize } from "../config";

async function pad_list(engine: QueryEngine, search: SearchState) {
    const searchfilter = (s?: string) => {
        const q = `
            filter exists {
                optional { ?platform schema:name ?name . }
                optional { ?platform dcterms:identifier ?id . }
                optional { ?platform ppo:hasKeyword ?keyword . } 
                filter(contains(lcase(str(?name)), lcase("${s}"))
                    || contains(lcase(str(?id)), lcase("${s}"))
                    || contains(lcase(str(?keyword)), lcase("${s}"))
                ) 
            }
        `;
        return s ? q : "";
    };

    const pubpolicyfilter = (b?: boolean) => {
        const q = `
            filter exists {
                ?platform ppo:hasPolicy [ a ppo:PublicationPolicy ] .
            }
        `;
        return b ? q : "";
    };

    const paywallfilter = (b?: boolean) => {
        const q = `
            filter exists {
                ?platform ppo:hasPolicy [ a ppo:PublicationPolicy ; ppo:hasPaywall true ] .
            }
        `;
        return b ? q : "";
    };

    const embargofilter = (b?: boolean, n?: number) => {
        const q = `
            filter exists {
                ?platform ppo:hasPolicy [ a ppo:PublicationPolicy ; ppo:embargo ?embargo ] .
                filter(?embargo <= "P${n}M"^^xsd:duration)
            }
        `;
        return b ? q : "";
    };

    const limit = (p: number, ps: number) => {
        const limit = ps || pagesize
        const offset = limit * (p || 0)
        return `limit ${limit} offset ${offset}`;
    };
    const nquery = `
        select (count(distinct ?pad) as ?count) where {
            ?pad a pad:PAD ; pad:hasAssertion ?assertion .
            graph ?assertion { ?platform a ppo:Platform . }
            ${searchfilter(search.searchstring)}
            ${pubpolicyfilter(search.pubpolicy)}
            ${paywallfilter(search.paywall)}
            ${embargofilter(search.embargo, search.embargoduration)}
        }
    `
    const query = `
        construct {
            ?pad dcterms:identifier ?sid ;
                schema:name ?name ;
                ppo:hasPolicy ?policytype ;
                ppo:hasKeyword ?keyword ;
                ppo:hasPaywall ?paywall ;
        }
        where {
            {
                select ?pad ?platform where {
                    ?pad a pad:PAD ; pad:hasAssertion ?assertion .
                    graph ?assertion { ?platform a ppo:Platform . }
                }
                ${limit(search.page, search.pagesize)}
            }
            optional { ?platform schema:name ?name . }
            optional { ?platform dcterms:identifier ?id . bind(str(?id) as ?sid) . }
            optional { ?platform ppo:hasKeyword ?keyword . }
            optional { ?platform ppo:hasPolicy ?policy . ?policy a ?policytype . }
            optional { ?policy ppo:hasPaywall ?paywall . }
            ${searchfilter(search.searchstring)}
            ${pubpolicyfilter(search.pubpolicy)}
            ${paywallfilter(search.paywall)}
            ${embargofilter(search.embargo, search.embargoduration)}
        }
    `;
    const padlist = normalize_graph(await query_jsonld(query, engine));
    const num = Number(await query_single(nquery, engine))
    console.log(query);
    console.log(padlist);
    return { padlist, num };
}

export { pad_list };
