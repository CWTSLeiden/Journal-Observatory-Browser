import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../store";
import { query_jsonld } from "../query/local";
import { Quadstore } from "quadstore";
import { first, includes, ld_cons_src, ld_to_str } from "../query/jsonld_helpers";
import { DetailsCard, SourceWrapper } from "./details";
import { fold_graph } from "../query/fold";
import { linkify_policy_item, PolicyDetailsItem, zip_policy_prop } from "./details_policy";
import * as summary from "./details_policy_summary"
import { InfoDialog } from "./info";

const policy_ordering = ([policy1,]: [object], [policy2,]: [object]) => {
    const compare = (p1: object, p2: object, fun: (policy: object) => boolean) => fun(p1) && !fun(p2)
    const openaccess = includes("ppo:isOpenAccess", "true")
    if (compare(policy1, policy2, openaccess)) { return -1 }
    if (compare(policy2, policy1, openaccess)) { return 1 }
    return Math.sign(Object.keys(policy1).length - Object.keys(policy2).length)
}

export const PlatformPubPolicies = () => {
    const padStore = useContext(PadContext)
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const render_policy = ([p, s]) => <PlatformPubPolicy key={p["@id"]} policy={p} src={s} />

    useEffect(() => {
        const render = async () => {
            const result = await platform_publication_policies(padStore)
            const fold = fold_graph(result, 1).filter(g => g["@type"] == "ppo:PublicationPolicy")
            setPolicies(ld_cons_src(fold))
            setLoading(false)
        }
        padStore ? render() : null
    }, [padStore]);

    console.log(policies)
    return (
        <DetailsCard
            title="Publication policies"
            loading={loading}
            infodialog={<InfoDialog property="ppo:PublicationPolicy" />}
        >
            {policies.sort(policy_ordering).map(render_policy)}
        </DetailsCard>
    )
}

const PlatformPubPolicy = ({policy, src}: {policy: object, src: string[]}) => {
    const zip = zip_policy_prop(policy)
    const version = zip("ppo:appliesToVersion")
    const isopenaccess = zip("ppo:isOpenAccess")
        .map(summary.openaccess)
    const license = zip("dcterms:license")
        .map(linkify_policy_item)
        .map(summary.license)
    const embargo = zip("fabio:hasEmbargoDuration")
    const owner = zip("ppo:hasCopyrightOwner")
        .map(summary.copyright_owner)
    const apc = (policy["ppo:hasArticlePublishingCharges"] || [])
        .map((apc: object) => ({
            id: ld_to_str(apc["@id"]),
            type: "ppo:hasArticlePublishingCharges",
            value: [
                first(apc, "schema:price") || "0",
                first(apc, "schema:priceCurrency")
            ].join(' '),
            url: first(apc, "schema:url")
        }))
        .map(summary.apc)

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
                    ...apc
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
                optional { ?policy ppo:hasArticlePublishingCharges ?apc .
                    optional { ?apc schema:price ?apcprice } .
                    optional { ?apc schema:priceCurrency ?apccurrency } .
                    optional { ?apc schema:url ?apcurl } .
                }
            }
            optional { 
                ?assertion pad:hasSourceAssertion ?source
                graph ?source { [] a ppo:Platform ; ppo:hasPolicy ?policy } .
            } .
        }
    `;
    return await query_jsonld(query, store);
}

