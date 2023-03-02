import { query_jsonld, query_single } from "../query/remote";
import { pagesize } from "../config";
import { SearchState } from "../reducers/search";

async function pad_list(search: SearchState, offset=0) {
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

    const open_access_filter = (b?: boolean) => {
        const q = `
            filter exists {
                ?platform ppo:hasPolicy [ a ppo:PublicationPolicy ; ppo:isOpenAccess true ] .
            }
        `;
        return b ? q : "";
    };

    const pub_embargofilter = (b?: boolean, n?: number) => {
        const q = `
            filter exists {
                ?platform ppo:hasPolicy [ a ppo:PublicationPolicy ; fabio:hasEmbargoDuration ?pub_embargo ] .
                filter(?pub_embargo <= "P${n}M"^^xsd:duration)
            }
        `;
        return b ? q : "";
    };

    const limit = (ps: number = pagesize) =>
        `limit ${ps} offset ${offset}`;

    const nquery = `
        select (count(distinct ?pad) as ?count) where {
            ?pad a pad:PAD ; pad:hasAssertion ?assertion .
            graph ?assertion { ?platform a ppo:Platform . }
            ${searchfilter(search.searchstring)}
            ${pubpolicyfilter(search.pub_policy)}
            ${open_access_filter(search.open_access)}
            ${pub_embargofilter(search.pub_embargo, search.pub_embargoduration)}
        }
    `

    const orderprop = (prop = "schema:name") => `
        optional { ?platform ${prop} ?orderprop } .
        bind(coalesce(str(?orderprop), "zzz") as ?order)
    `

    const order = (asc = true) => 
        asc ? "order by asc(?order)" : "order by desc(?order)"

    const query = `
        construct {
            ?pad dcterms:identifier ?sid ;
                prism:issn ?issnu ;
                schema:name ?name ;
                ?policytype ?policy ;
                ppo:hasKeyword ?keyword ;
                ppo:isOpenAccess ?openaccess ;
                dcterms:creator ?creator ;
                ppo:_ord ?order .
        }
        where {
            {
                select ?pad ?platform ?creator (min(?order) as ?order) where {
                    ?pad a pad:PAD ; pad:hasAssertion ?assertion .
                    optional { ?assertion pad:hasSourceAssertion ?source .
                        service <repository:pad> { ?source dcterms:creator ?creator } }
                    graph ?assertion { ?platform a ppo:Platform . }
                    ${orderprop(search.orderprop)}
                    ${searchfilter(search.searchstring)}
                    ${pubpolicyfilter(search.pub_policy)}
                    ${open_access_filter(search.open_access)}
                    ${pub_embargofilter(search.pub_embargo, search.pub_embargoduration)}
                }
                group by ?pad ?platform ?creator
                ${order(search.orderasc)}
                ${limit(search.pagesize)}
            }
            optional { ?platform schema:name ?name . }
            optional { ?platform dcterms:identifier ?id . bind(str(?id) as ?sid) . }
            optional { ?platform fabio:ISSNL ?issnl . }
            optional { ?platform prism:issn ?issn . }
            optional { ?platform prism:eIssn ?eissn . }
            bind(coalesce(?issnl, ?issn, ?eissn) as ?issnu) .
            optional { ?platform ppo:hasKeyword ?keyword . }
            optional {
                ?platform ppo:hasPolicy ?policy .
                ?policy a ?policytype .
                optional { ?policy ppo:isOpenAccess ?openaccess . }
            }
        }
    `;
    console.log("Perform query", Date.now())
    console.log(query)
    const result = await query_jsonld(query)
    const num = Number(await query_single(nquery))
    const padlist = Array.isArray(result) ? result : []
    return { padlist, num };
}

export { pad_list };
