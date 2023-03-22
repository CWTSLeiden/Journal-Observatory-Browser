import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../context";
import { query_jsonld } from "../query/local";
import { Quadstore } from "quadstore";
import { first, ld_cons_src, zip_prop } from "../query/ld";
import { DetailsCard, SourceWrapper } from "./details";
import { fold_graph } from "../query/fold";
import { PolicyDetailsItem } from "./policy_details";

export const PlatformElsewherePolicies = () => {
    const padStore = useContext(PadContext)
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const render = async () => {
            const result = await platform_elsewhere_policies(padStore)
            const fold = fold_graph(result, 1).filter(g => g["@type"].includes("ppo:PublicationElsewherePolicy"))
            console.log(fold)
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
    const zip = zip_prop(policy)
    const type = zip("@type").filter(([,v,]) => v != "ppo:PublicationElsewherePolicy")
    const version = zip("ppo:appliesToVersion")
    const license = zip("dcterms:license", true)
    const embargo = zip("fabio:hasEmbargoDuration")
    const owner = zip("ppo:hasCopyrightOwner")
    const condition = zip("ppo:publicationCondition")
    const location = zip("ppo:publicationLocation")

    const version_summary = version.map(([,v,]) =>
        versionSummary(v)).filter(Boolean)
    const license_summary = license.map(([,v,]) =>
        licenseSummary(v)).filter(Boolean)
    const type_summary = type.map(([,v,]) =>
        typeSummary(v)).filter(Boolean)

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
                summary={[
                    ...type_summary,
                    ...version_summary,
                    ...license_summary,
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

const versionSummary = (value: string) => {
    return [value, "default"]
}
const licenseSummary = (value: string) => {
    switch(value) {
        case "https://creativecommons.org/publicdomain/zero/1.0/":
            return [value, "success"]
        case "https://creativecommons.org/licenses/by/4.0/":
            return [value, "warning"]
        case "https://creativecommons.org/licenses/by-nc/4.0/":
            return [value, "warning"]
        case "https://creativecommons.org/licenses/by-nc-nd/4.0/":
            return [value, "warning"]
        case "https://creativecommons.org/licenses/by-nc-sa/4.0/":
            return [value, "warning"]
        case "https://creativecommons.org/licenses/by-nd/4.0/":
            return [value, "warning"]
        case "https://creativecommons.org/licenses/by-sa/4.0/":
            return [value, "warning"]
        default:
            return [value, "default"]
    }
}
const typelabel = {
    "ppo:PublicationElsewhereAllowedPolicy": "Allowed",
    "ppo:PublicationElsewhereProhibitedPolicy": "Prohibited",
    "ppo:PublicationElsewhereMandatoryPolicy": "Mandatory"
}
const typeSummary = (value: string) => {
    switch(typelabel[value]) {
        case "Allowed":
            return [`Type: ${typelabel[value]}`, "success"]
        case "Prohibited":
            return [`Type: ${typelabel[value]}`, "error"]
        case "Mandatory":
            return [`Type: ${typelabel[value]}`, "warning"]
        default:
            return [value, "default"]
    }
}
