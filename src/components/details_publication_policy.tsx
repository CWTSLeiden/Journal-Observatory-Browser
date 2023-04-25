import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../store";
import { query_jsonld } from "../query/local";
import { Quadstore } from "quadstore";
import { duration_to_str, first, includes, ld_cons_src, ld_to_str } from "../query/jsonld_helpers";
import { DetailsCard, SourceWrapper } from "./details";
import { fold_graph } from "../query/fold";
import { linkify_policy_item, PolicyDetailsItem, PolicyItem, zip_policy_prop } from "./details_policy";
import * as summary from "./details_policy_summary"
import { AnnotationDialog } from "./info";
import { labelize } from "../query/labels";
import info from "../strings/info.json";

const policy_ordering = ([policy1,]: [object], [policy2,]: [object]) => {
    const compare = (p1: object, p2: object, fun: (policy: object) => boolean) => fun(p1) && !fun(p2)
    const openaccess = includes("scpo:isOpenAccess", "true")
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
            const fold = fold_graph(result, 1).filter(g => g["@type"] == "scpo:PublicationPolicy")
            setPolicies(ld_cons_src(fold))
            setLoading(false)
        }
        padStore ? render() : null
    }, [padStore]);

    return (
        <DetailsCard
            title="Publication policies"
            loading={loading}
            infodialog={<AnnotationDialog property="publication-policies-title" text={info["publication-policies-text"]} />}
        >
            {policies.sort(policy_ordering).map(render_policy)}
        </DetailsCard>
    )
}

const PlatformPubPolicy = ({policy, src}: {policy: object, src: string[]}) => {
    const zip = zip_policy_prop(policy)
    const version = zip("scpo:appliesToVersion")
    const isopenaccess = zip("scpo:isOpenAccess")
        .map(summary.openaccess)
    const license = zip("dcterms:license")
        .map(linkify_policy_item)
        .map(summary.license)
    const embargo = embargo_translate(zip("fabio:hasEmbargoDuration"))
    const owner = zip("scpo:hasCopyrightOwner")
        .map(summary.copyright_owner)
    const apc = (policy["scpo:hasArticleProcessingCharge"] || [])
        .map((apc: object) => ({
            id: ld_to_str(apc["@id"]),
            type: "scpo:hasArticleProcessingCharge",
            value: [
                labelize(first(apc, "schema:price"), {"unknown": "Unknown amount"}) || "0",
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
            ?policy a scpo:PublicationPolicy .
            ?policy scpo:appliesToVersion ?version .
            ?policy scpo:isOpenAccess ?isopenaccess .
            ?policy dcterms:license ?license .
            ?policy fabio:hasEmbargoDuration ?embargo .
            ?policy scpo:hasCopyrightOwner ?copyrightowner .
            ?policy scpo:hasArticleProcessingCharge ?apc .
            ?apc a scpo:ArticlePublishingCharges .
            ?apc schema:price ?apcprice .
            ?apc schema:priceCurrency ?apccurrency .
            ?apc schema:url ?apcurl .
            ?policy scpo:_src ?source .
        }
        where { 
            ?pad pad:hasAssertion ?assertion .
            graph ?assertion {
                ?platform a scpo:Platform ; scpo:hasPolicy ?policy .
                ?policy a scpo:PublicationPolicy .
                optional { ?policy scpo:appliesToVersion ?version } .
                optional { ?policy scpo:isOpenAccess ?isopenaccess } .
                optional { ?policy ?haslicense ?license . ?haslicense rdfs:subPropertyOf* dcterms:license } .
                optional { ?policy fabio:hasEmbargoDuration ?embargo } .
                optional { ?policy scpo:hasCopyrightOwner [ a ?copyrightowner ] } .
                optional { ?policy scpo:hasArticleProcessingCharge ?apc .
                    ?apc schema:price ?apcprice .
                    optional { ?apc schema:priceCurrency ?apccurrency } .
                    optional { ?apc schema:url ?apcurl } .
                }
                optional { ?policy scpo:hasOpenAccessFee "true" .
                    bind(bnode() as ?apc) .
                    bind("unknown" as ?apcprice)
                } .
            }
            optional { 
                ?assertion pad:hasSourceAssertion ?source
                graph ?source { [] a scpo:Platform ; scpo:hasPolicy ?policy } .
            } .
        }
    `;
    return await query_jsonld(query, store);
}


const embargo_translate = (embargoes: PolicyItem[]): PolicyItem[] => {
    const embargo_to_str = (e: string) => {
        const duration = duration_to_str(e)
        return duration == "0" ? "No embargo" : duration
    }
    return embargoes.map(e => ({...e, value: embargo_to_str(e.value)}))
}
