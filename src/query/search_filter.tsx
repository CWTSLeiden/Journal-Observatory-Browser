import { enabledToggles, SearchState, Toggles } from "../store/search";

export const enabled = (toggles: Toggles, post_processing?: string) => {
    const filtered = enabledToggles(toggles)
    if (post_processing == "string") {
        return filtered.map(f => `"${f}"`)
    }
    if (post_processing == "uri") {
        return filtered.map(f => `<${f}>`)
    }
    return filtered
}

export const search_filter = (s?: string) => {
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

export const creator_filter = (search: SearchState) => {
    const filtered = enabled(search.creators, "uri")
    const q = `
        filter(?creator in (${filtered.join(', ')}))
    `
    return filtered.length ? q : ""
}

export const pub_policy_filter = (search: SearchState) => {
    const q = `
        filter exists {
            ?platform ppo:hasPolicy ?policy .
            ?policy a ppo:PublicationPolicy .
        }
    `;
    return search.pub_policy ? q : "";
};

export const pub_open_access_filter = (search: SearchState) => {
    const q = `
        filter exists {
            ?platform ppo:hasPolicy ?policy .
            ?policy a ppo:PublicationPolicy ;
            ppo:isOpenAccess true .
        }
    `;
    return search.open_access ? q : "";
};

export const pub_embargo_filter = (search: SearchState) => {
    const q = `
        filter exists {
            ?platform ppo:hasPolicy ?policy .
            ?policy a ppo:PublicationPolicy ;
                fabio:hasEmbargoDuration ?pub_embargo .
            filter(?pub_embargo <= "P${search.pub_embargoduration}M"^^xsd:duration)
        }
    `;
    return search.pub_embargo ? q : "";
};

export const pub_apc_filter = (search: SearchState) => {
    const q = `
        filter exists {
            ?platform ppo:hasPolicy ?policy .
            ?policy a ppo:PublicationPolicy ;
                ppo:hasArticlePublishingCharges [
                    schema:price ?price ;
                    # schema:priceCurrency "USD" .
                ] .
            filter(?price <= ${search.pub_apcamount})
        }
    `;
    return search.pub_apc ? q : "";
};

export const pub_copyrightowner_filter = (search: SearchState) => {
    const filtered = enabled(search.pub_copyrightowners)
    const q = `
        filter exists {
            ?platform ppo:hasPolicy ?policy .
            ?policy a ppo:PublicationPolicy ;
                ppo:hasCopyrightOwner [ a ?copyrightowner ] .
            filter(?copyrightowner in (${filtered.join(', ')}))
        }
    `;
    return filtered.length ? q : "";
};

export const pub_license_filter = (search: SearchState) => {
    const filtered = enabled(search.pub_licenses, "uri")
    const q = `
        filter exists {
            ?platform ppo:hasPolicy ?policy .
            ?policy a ppo:PublicationPolicy ;
                dcterms:license ?license .
            filter(?license in (${filtered.join(', ')}))
        }
    `;
    return filtered.length ? q : "";
};

export const elsewhere_policy_filter = (search: SearchState) => {
    const q = `
        filter exists {
            ?platform ppo:hasPolicy ?policy .
            ?policy a ppo:PublicationElsewherePolicy .
        }
    `;
    return search.elsewhere_policy ? q : "";
};


export const elsewhere_version_filter = (search: SearchState) => {
    const filtered = enabled(search.elsewhere_versions)
    const q = `
        filter exists {
            ?platform ppo:hasPolicy ?policy .
            ?policy a ppo:PublicationElsewherePolicy ;
                ppo:appliesToVersion ?version .
            filter(?version in (${filtered.join(', ')}))
        }
    `;
    return filtered.length ? q : "";
};

export const elsewhere_location_filter = (search: SearchState) => {
    const filtered = enabled(search.elsewhere_locations, "string")
    const q = `
        filter exists {
            ?platform ppo:hasPolicy ?policy .
            ?policy a ppo:PublicationElsewherePolicy ;
                ppo:publicationLocation ?location .
            filter(?location in (${filtered.join(', ')}))
        }
    `;
    return filtered.length ? q : "";
};

export const elsewhere_license_filter = (search: SearchState) => {
    const filtered = enabled(search.elsewhere_licenses, "uri")
    const q = `
        filter exists {
            ?platform ppo:hasPolicy ?policy .
            ?policy a ppo:PublicationElsewherePolicy ;
                dcterms:license ?license .
            filter(?license in (${filtered.join(', ')}))
        }
    `;
    return filtered.length ? q : "";
};

export const elsewhere_copyrightowner_filter = (search: SearchState) => {
    const filtered = enabled(search.elsewhere_copyrightowners)
    const q = `
        filter exists {
            ?platform ppo:hasPolicy ?policy .
            ?policy a ppo:PublicationElsewherePolicy ;
                ppo:hasCopyrightOwner [ a ?copyrightowner ] .
            filter(?copyrightowner in (${filtered.join(', ')}))
        }
    `;
    return filtered.length ? q : "";
};

export const elsewhere_embargo_filter = (search: SearchState) => {
    const q = `
        filter exists {
            ?platform ppo:hasPolicy ?policy .
            ?policy a ppo:PublicationElsewherePolicy ;
                fabio:hasEmbargoDuration ?pub_embargo .
            filter(?pub_embargo <= "P${search.elsewhere_embargoduration}M"^^xsd:duration)
        }
    `;
    return search.elsewhere_embargo ? q : "";
};

export const evaluation_policy_filter = (search: SearchState) => {
    const q = `
        filter exists {
            ?platform ppo:hasPolicy ?policy .
            ?policy a ppo:EvaluationPolicy .
        }
    `;
    return search.evaluation_policy ? q : "";
};

export const evaluation_anonymized_filter = (search: SearchState) => {
    const filtered = enabled(search.evaluation_anonymized)
    const all = `
        exists {
            ?editor a pro:editor .
            ?author ppo:identifiedTo ?reviewer .
            ?author ppo:identifiedTo ?editor .
            ?reviewer ppo:identifiedTo ?author .
            ?reviewer ppo:identifiedTo ?editor .
        }
    `
    const single = `
        exists {
            ?author ppo:identifiedTo ?reviewer .
            ?reviewer ppo:anonymousTo ?author .
        }
    `
    const double = `
        exists {
            ?author ppo:anonymousTo ?reviewer .
            ?reviewer ppo:anonymousTo ?author .
        }
    `
    const triple = `
        exists {
            ?editor a pro:editor .
            ?author ppo:anonymousTo ?reviewer .
            ?author ppo:anonymousTo ?editor .
            ?reviewer ppo:anonymousTo ?author .
            ?reviewer ppo:anonymousTo ?editor .
        }
    `
    const anonymized = [
        filtered.includes("all") ? all : null,
        filtered.includes("single") ? single : null,
        filtered.includes("double") ? double : null,
        filtered.includes("triple") ? triple : null
    ].filter(Boolean)
    const q = `
        filter exists {
            ?platform ppo:hasPolicy ?policy .
            ?policy a ppo:EvaluationPolicy .
            ?policy ppo:involves ?author .
            ?author a pro:author .
            ?author ?author_reviewer ?reviewer .
            ?policy ppo:involves ?reviewer .
            ?reviewer a pro:peer-reviewer .
            ?reviewer ?reviewer_author ?author .
            ?policy ppo:involves ?editor .
            filter (${anonymized.join(' || ')})
        }
    `;
    return filtered.length ? q : "";
};

export const evaluation_interaction_filter = (search: SearchState) => {
    const filtered = enabled(search.evaluation_interactions)
    const q = `
        filter exists {
            ?platform ppo:hasPolicy ?policy .
            ?policy a ppo:EvaluationPolicy ;
                ppo:involves ?reviewer .
            ?reviewer a pro:peer-reviewer ;
                ppo:interactsWith ?agent .
            ?agent a ?publishingrole .
            filter(?publishingrole in (${filtered.join(', ')}))
            filter(?reviewer != ?agent)
        }
    `;
    return filtered.length ? q : "";
};

export const evaluation_information_filter = (search: SearchState) => {
    const filtered = enabled(search.evaluation_information)
    const q = `
        filter exists {
            ?platform ppo:hasPolicy ?policy .
            ?policy a ppo:EvaluationPolicy ;
                ppo:covers ?work .
            ?work a ?worktype ;
                ppo:publiclyAccessible ppo:Accessible .
            filter(?worktype in (${filtered.join(', ')}))
        }
    `;
    return filtered.length ? q : "";
};

export const evaluation_comment_filter = (search: SearchState) => {
    const filtered = enabled(search.evaluation_comments)
    const q = `
        filter exists {
            ?platform ppo:hasPolicy ?policy .
            ?policy a ppo:EvaluationPolicy ;
                ppo:covers ?ppc .
            ?ppc a ppo:postPublicationCommenting .
            filter(?ppc in (${filtered.join(', ')}))
        }
    `;
    return filtered.length ? q : "";
};
