import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../store";
import { query_jsonld } from "../query/local";
import { Quadstore } from "quadstore";
import { includes, ld_cons_src } from "../query/jsonld_helpers";
import { DetailsCard, SourceWrapper } from "./details";
import { fold_graph } from "../query/fold";
import { linkify_policy_item, PolicyDetailsItem, zip_policy_prop } from "./details_policy";
import * as summary from "./details_policy_summary"
import { InfoDialog } from "./info";

const policy_ordering = ([policy1,]: [object], [policy2,]: [object]) => {
    const compare = (p1: object, p2: object, fun: (policy: object) => boolean) => fun(p1) && !fun(p2)
    const prohibited = includes("@type", "ppo:PublicationElsewhereProhibitedPolicy")
    const published = includes("ppo:appliesToVersion", "pso:published")
    const accepted = includes("ppo:appliesToVersion", "pso:accepted-for-publication")
    const submitted = includes("ppo:appliesToVersion", "pso:submitted")
    if (compare(policy1, policy2, prohibited)) { return -1 }
    if (compare(policy2, policy1, prohibited)) { return 1 }
    if (compare(policy1, policy2, published)) { return -1 }
    if (compare(policy2, policy1, published)) { return 1 }
    if (compare(policy1, policy2, accepted)) { return -1 }
    if (compare(policy2, policy1, accepted)) { return 1 }
    if (compare(policy1, policy2, submitted)) { return -1 }
    if (compare(policy2, policy1, submitted)) { return 1 }
    return Math.sign(Object.keys(policy1).length - Object.keys(policy2).length)
}

export const PlatformElsewherePolicies = () => {
    const padStore = useContext(PadContext)
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const render_policy = ([p, s]) => <PlatformElsewherePolicy key={p["@id"]} policy={p} src={s} />

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
        <DetailsCard
            title="Preprinting/self-archiving policies"
            loading={loading}
            infodialog={<InfoDialog property="ppo:PublicationElsewherePolicy" />}
        >
            {policies.sort(policy_ordering).map(render_policy)}
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

