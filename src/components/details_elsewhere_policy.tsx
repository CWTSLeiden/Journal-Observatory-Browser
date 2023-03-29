import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../store";
import { query_jsonld } from "../query/local";
import { Quadstore } from "quadstore";
import { ld_cons_src, zip_prop } from "../query/jsonld_helpers";
import { DetailsCard, SourceWrapper } from "./details";
import { fold_graph } from "../query/fold";
import { linkify_policy_item, PolicyDetailsItem, zip_policy_prop } from "./details_policy";
import * as summary from "./details_policy_summary"

export const PlatformElsewherePolicies = () => {
    const padStore = useContext(PadContext)
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const render = async () => {
            const result = await platform_elsewhere_policies(padStore)
            const fold = fold_graph(result, 1).filter(g => g["@type"].includes("ppo:PublicationElsewherePolicy"))
            setPolicies(ld_cons_src(fold))
            setLoading(false)
        }
        padStore ? render() : null
    }, [padStore]);

    return (
        <DetailsCard title="Publication Elsewhere Policies" loading={loading}>
            {policies.map(([p, s]) => (
                <PlatformElsewherePolicy key={p["@id"]} policy={p} src={s} />
            ))}
        </DetailsCard>
    )
}

const PlatformElsewherePolicy = ({policy, src}: {policy: object, src: string[]}) => {
    const zip = zip_policy_prop(policy)
    const type = zip("@type")
        .filter(item => item.value != "ppo:PublicationElsewherePolicy")
        .map(summary.elsewhere_type)
    const version = zip("ppo:appliesToVersion")
        .map(summary.version)
    const license = zip("dcterms:license")
        .map(linkify_policy_item)
        .map(summary.license)
    const embargo = zip("fabio:hasEmbargoDuration")
    const owner = zip("ppo:hasCopyrightOwner").map(summary.copyright_owner)
    const condition = zip("ppo:publicationCondition")
    const location = zip("ppo:publicationLocation")

    return (
        <SourceWrapper key={policy["@id"]} src={src}>
            <PolicyDetailsItem 
                id={policy["@id"]}
                items={[
                    ...type,
                    ...version,
                    ...license,
                    ...embargo,
                    ...owner,
                    ...condition,
                    ...location
                ]}
            />
        </SourceWrapper>
    )
}

async function platform_elsewhere_policies(store: Quadstore) {
    const query = `
        construct {
            ?policy a ppo:PublicationElsewherePolicy .
            ?policy a ?elsewherepolicy .
            ?policy ppo:publicationLocation ?location .
            ?policy ppo:appliesToVersion ?version .
            ?policy fabio:hasEmbargoDuration ?embargo .
            ?policy ppo:publicationCondition ?condition .
            ?policy dcterms:license ?license .
            ?policy ppo:hasCopyrightOwner ?copyrightowner .
            ?policy ppo:_src ?source .
        }
        where { 
            ?pad pad:hasAssertion ?assertion .
            graph ?assertion {
                ?platform a ppo:Platform ; ppo:hasPolicy ?policy .
                ?policy a ?elsewherepolicy .
                optional { ?policy ppo:publicationLocation ?location } .
                optional { ?policy ppo:appliesToVersion ?version } .
                optional { ?policy fabio:hasEmbargoDuration ?embargo } .
                optional { ?policy ppo:publicationCondition ?condition } .
                optional { ?policy ?haslicense ?license . ?haslicense rdfs:subPropertyOf* dcterms:license } .
                optional { ?policy ppo:hasCopyrightOwner [ a ?copyrightowner ] } .
            }
            ?elsewherepolicy rdfs:subClassOf* ppo:PublicationElsewherePolicy .
            optional { 
                ?assertion pad:hasSourceAssertion ?source
                graph ?source { [] a ppo:Platform ; ppo:hasPolicy ?policy } .
            } .
        }
    `;
    return await query_jsonld(query, store);
}

