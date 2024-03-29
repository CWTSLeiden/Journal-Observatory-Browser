import { query_jsonld, query_single } from "../query/remote";
import { SearchState } from "../store/search";
import * as filter from "./search_filter"

const limit = (search: SearchState, offset: number) =>
    `limit ${search.pagesize} offset ${offset}`;

const orderprop = (search: SearchState) => `
    optional { ?platform ${search.orderprop || "schema:name"} ?orderprop } .
    bind(coalesce(str(?orderprop), "zzz") as ?order)
`

const order = (search: SearchState) => 
    search.orderasc ? "order by asc(?order)" : "order by desc(?order)"


async function pad_list(search: SearchState, offset=0) {

    const nquery = `
        select distinct ?pad from onto:count where {
            ?pad a pad:PAD ; pad:hasAssertion ?assertion .
            graph ?assertion { ?platform a scpo:Platform } .
            ${filter.creator_filter(search)}
            ${filter.search_filter(search.searchstring)}
            ${filter.pub_policy_filter(search)}
            ${filter.pub_open_access_filter(search)}
            ${filter.pub_embargo_filter(search)}
            ${filter.pub_apc_filter(search)}
            ${filter.pub_copyrightowner_filter(search)}
            ${filter.pub_license_filter(search)}
            ${filter.elsewhere_policy_filter(search)}
            ${filter.elsewhere_version_filter(search)}
            ${filter.elsewhere_location_filter(search)}
            ${filter.elsewhere_license_filter(search)}
            ${filter.elsewhere_copyrightowner_filter(search)}
            ${filter.elsewhere_embargo_filter(search)}
            ${filter.evaluation_policy_filter(search)}
            ${filter.evaluation_anonymized_filter(search)}
            ${filter.evaluation_interaction_filter(search)}
            ${filter.evaluation_information_filter(search)}
            ${filter.evaluation_comment_filter(search)}
        }
    `

    const query = `
        construct {
            ?pad prism:issn ?issnu ;
                schema:name ?name ;
                ?policytype ?policy ;
                scpo:isOpenAccess ?openaccess ;
                dcterms:creator ?creator ;
                scpo:_ord ?order .
        }
        where {
            {
                select ?pad ?assertion ?platform (${search.orderasc ? "min" : "max"}(?order) as ?order) where {
                    ?pad a pad:PAD ; pad:hasAssertion ?assertion .
                    graph ?assertion { ?platform a scpo:Platform } .
                    ${filter.search_filter(search.searchstring)}
                    ${filter.creator_filter(search)}
                    ${filter.pub_policy_filter(search)}
                    ${filter.pub_open_access_filter(search)}
                    ${filter.pub_embargo_filter(search)}
                    ${filter.pub_apc_filter(search)}
                    ${filter.pub_copyrightowner_filter(search)}
                    ${filter.pub_license_filter(search)}
                    ${filter.elsewhere_policy_filter(search)}
                    ${filter.elsewhere_version_filter(search)}
                    ${filter.elsewhere_location_filter(search)}
                    ${filter.elsewhere_license_filter(search)}
                    ${filter.elsewhere_copyrightowner_filter(search)}
                    ${filter.elsewhere_embargo_filter(search)}
                    ${filter.evaluation_policy_filter(search)}
                    ${filter.evaluation_anonymized_filter(search)}
                    ${filter.evaluation_interaction_filter(search)}
                    ${filter.evaluation_information_filter(search)}
                    ${filter.evaluation_comment_filter(search)}
                    ${orderprop(search)}
                }
                group by ?pad ?assertion ?platform
                ${order(search)}
                ${limit(search, offset)}
            }
            optional { ?assertion pad:hasSourceAssertion [ dcterms:creator ?creator ] }
            optional { ?platform schema:name ?name . }
            optional { ?platform fabio:ISSNL ?issnl . }
            optional { ?platform prism:issn ?issn . }
            optional { ?platform prism:eIssn ?eissn . }
            bind(coalesce(?issnl, ?issn, ?eissn) as ?issnu) .
            optional {
                ?platform scpo:hasPolicy ?policy .
                ?policy a ?policytype .
                optional { ?policy scpo:isOpenAccess ?openaccess . }
            }
        }
    `;
    // console.log(query.replace(/( *\n)+/g, '\n'))
    const result = await query_jsonld(query)
    const num = Number(await query_single(nquery))
    const padlist = Array.isArray(result) ? result : []
    return { padlist, num };
}

export { pad_list };
