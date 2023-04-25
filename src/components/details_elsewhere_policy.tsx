import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../store";
import { query_jsonld } from "../query/local";
import { Quadstore } from "quadstore";
import { duration_to_str, includes, ld_cons_src, ld_to_str } from "../query/jsonld_helpers";
import { DetailsCard, SourceWrapper } from "./details";
import { fold_graph } from "../query/fold";
import { linkify_policy_item, PolicyDetailsItem, PolicyItem, zip_policy_prop } from "./details_policy";
import * as summary from "./details_policy_summary"
import { AnnotationDialog } from "./info";
import info from "../strings/info.json";
import { HolidayVillage, Report } from "@mui/icons-material";

const policy_ordering = ([policy1,]: [object], [policy2,]: [object]) => {
    const compare = (p1: object, p2: object, fun: (policy: object) => boolean) => fun(p1) && !fun(p2)
    const prohibited = includes("@type", "scpo:PublicationElsewhereProhibitedPolicy")
    const published = includes("scpo:appliesToVersion", "pso:published")
    const accepted = includes("scpo:appliesToVersion", "pso:accepted-for-publication")
    const submitted = includes("scpo:appliesToVersion", "pso:submitted")
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
            const fold = fold_graph(result, 1).filter(g => g["@type"].includes("scpo:PublicationElsewherePolicy"))
            setPolicies(ld_cons_src(fold))
            setLoading(false)
        }
        padStore ? render() : null
    }, [padStore]);

    return (
        <DetailsCard
            title="Preprinting/self-archiving policies"
            loading={loading}
            infodialog={<AnnotationDialog property="publication-elsewhere-policies-title" text={info["publication-elsewhere-policies-text"]} />}
        >
            {policies.sort(policy_ordering).map(render_policy)}
        </DetailsCard>
    )
}

const PlatformElsewherePolicy = ({policy, src}: {policy: object, src: string[]}) => {
    const zip = zip_policy_prop(policy)
    const type = zip("@type")
        .filter(item => item.value != "scpo:PublicationElsewherePolicy")
        .map(summary.elsewhere_type)
    const version = zip("scpo:appliesToVersion")
        .map(summary.version)
    const license = zip("dcterms:license")
        .map(linkify_policy_item)
        .map(summary.license)
    const embargo = embargo_translate(zip("fabio:hasEmbargoDuration"))
        .map(summary.embargo)
    const owner = zip("scpo:hasCopyrightOwner")
        .map(summary.copyright_owner)
    const condition = zip("scpo:publicationCondition")
    const location = zip("scpo:publicationLocation")
    const conditions_summary: PolicyItem = condition.length > 0 ? {
        id: ld_to_str(policy["@id"]),
        type: "scpo:publicationCondition",
        summary: `${condition.length} Conditions`,
        color: "warning",
        Icon: Report
    } : null
    const locations_summary: PolicyItem = location.length > 0 ? {
        id: ld_to_str(policy["@id"]),
        type: "scpo:publicationLocation",
        summary: `${location.length} Locations`,
        color: "default",
        Icon: HolidayVillage
    } : null
    

    return (
        <SourceWrapper key={policy["@id"]} src={src}>
            <PolicyDetailsItem 
                id={policy["@id"]}
                items={[
                    ...type,
                    ...version,
                    locations_summary,
                    conditions_summary,
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
            ?policy a scpo:PublicationElsewherePolicy .
            ?policy a ?elsewherepolicy .
            ?policy scpo:publicationLocation ?location .
            ?policy scpo:appliesToVersion ?version .
            ?policy fabio:hasEmbargoDuration ?embargo .
            ?policy scpo:publicationCondition ?condition .
            ?policy dcterms:license ?license .
            ?policy scpo:hasCopyrightOwner ?copyrightowner .
            ?policy scpo:_src ?source .
        }
        where { 
            ?pad pad:hasAssertion ?assertion .
            graph ?assertion {
                ?platform a scpo:Platform ; scpo:hasPolicy ?policy .
                ?policy a ?elsewherepolicy .
                optional { ?policy scpo:publicationLocation ?location } .
                optional { ?policy scpo:appliesToVersion ?version } .
                optional { ?policy fabio:hasEmbargoDuration ?embargo } .
                optional { ?policy scpo:publicationCondition ?condition } .
                optional { ?policy scpo:condition ?condition } .
                optional { ?policy ?haslicense ?license . ?haslicense rdfs:subPropertyOf* dcterms:license } .
                optional { ?policy scpo:hasCopyrightOwner [ a ?copyrightowner ] } .
            }
            ?elsewherepolicy rdfs:subClassOf* scpo:PublicationElsewherePolicy .
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
