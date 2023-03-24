import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../store";
import { query_jsonld } from "../query/local";
import { Quadstore } from "quadstore";
import { first, ld_cons_src, zip_prop } from "../query/jsonld_helpers";
import { DetailsCard, SourceWrapper } from "./details";
import { fold_graph } from "../query/fold";
import { PolicyDetailsItem } from "./details_policy";
import * as summary from "./details_policy_summary"
import summarize from "./details_policy_summary"

export const PlatformPubPolicies = () => {
    const padStore = useContext(PadContext)
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const render = async () => {
            const result = await platform_publication_policies(padStore)
            const fold = fold_graph(result, 1).filter(g => g["@type"] == "ppo:PublicationPolicy")
            setPolicies(ld_cons_src(fold))
            setLoading(false)
        }
        padStore ? render() : null
    }, [padStore]);

    return (
        <DetailsCard title="Publication Policies" loading={loading}>
            {policies.map(([p, s]) => (
                <PlatformPubPolicy key={p["@id"]} policy={p} src={s} />
            ))}
        </DetailsCard>
    )
}

const PlatformPubPolicy = ({policy, src}: {policy: object, src: string[]}) => {
    const zip = zip_prop(policy)
    const version = zip("ppo:appliesToVersion")
    const isopenaccess = zip("ppo:isOpenAccess")
    const license = zip("dcterms:license", true)
    const embargo = zip("fabio:hasEmbargoDuration")
    const owner = zip("ppo:hasCopyrightOwner")
    const apc = policy["ppo:hasArticlePublishingCharges"] || []
    const apcmap = apc.map(a => {
        const prop = "ppo:hasArticlePublishingCharges"
        const price = first(a, "schema:price")
        const currency = first(a, "schema:priceCurrency")
        const url = first(a, "schema:url")
        const pricecurrency = [price, currency].join(' ')
        return [prop, pricecurrency, url]
    })

    const isopenaccess_summary = summarize(isopenaccess, summary.openaccess)
    const license_summary = summarize(license, summary.license)
    const apc_summary = summarize(apcmap, summary.apc)
    const owner_summary = summarize(owner, summary.copyright_owner)

    return (
        <SourceWrapper key={policy["@id"]} src={src}>
            <PolicyDetailsItem 
                id={policy["@id"]}
                items={[
                    ...version,
                    ...isopenaccess,
                    ...license,
                    ...embargo,
                    ...owner,
                    ...apcmap
                ]}
                summary={[
                    ...isopenaccess_summary,
                    ...license_summary,
                    ...owner_summary,
                    ...apc_summary
                ]}
            />
        </SourceWrapper>
    )
}

async function platform_publication_policies(store: Quadstore) {
    const query = `
        construct {
            ?policy a ppo:PublicationPolicy .
            ?policy ppo:appliesToVersion ?version .
            ?policy ppo:isOpenAccess ?isopenaccess .
            ?policy dcterms:license ?license .
            ?policy fabio:hasEmbargoDuration ?embargo .
            ?policy ppo:hasCopyrightOwner ?copyrightowner .
            ?policy ppo:hasArticlePublishingCharges ?apc .
            ?apc a ppo:ArticlePublishingCharges .
            ?apc schema:price ?apcprice .
            ?apc schema:priceCurrency ?apccurrency .
            ?apc schema:url ?apcurl .
            ?policy ppo:_src ?source .
        }
        where { 
            ?pad pad:hasAssertion ?assertion .
            graph ?assertion {
                ?platform a ppo:Platform ; ppo:hasPolicy ?policy .
                ?policy a ppo:PublicationPolicy .
                optional { ?policy ppo:appliesToVersion ?version } .
                optional { ?policy ppo:isOpenAccess ?isopenaccess } .
                optional { ?policy ?haslicense ?license . ?haslicense rdfs:subPropertyOf* dcterms:license } .
                optional { ?policy fabio:hasEmbargoDuration ?embargo } .
                optional { ?policy ppo:hasCopyrightOwner [ a ?copyrightowner ] } .
                optional { ?policy ppo:hasArticlePublishingCharges ?apc } .
                optional { ?apc schema:price ?apcprice } .
                optional { ?apc schema:priceCurrency ?apccurrency } .
                optional { ?apc schema:url ?apcurl } .
            }
            optional { 
                ?assertion pad:hasSourceAssertion ?source
                graph ?source { [] a ppo:Platform ; ppo:hasPolicy ?policy } .
            } .
        }
    `;
    return await query_jsonld(query, store);
}

