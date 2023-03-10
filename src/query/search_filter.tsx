import { enabledToggles, SearchState, Toggles } from "../reducers/search";

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
    if (filtered.length == 0) return ''
    const author_reviewer = []
    const reviewer_author = []
    const author_editor = []
    const reviewer_editor = []
    const identified = "ppo:identifiedTo"
    const anonymous = "ppo:anonymousTo"
    let editor = false
    if (filtered.includes("all")) {
        editor = true
        author_reviewer.push(identified)
        author_editor.push(identified)
        reviewer_author.push(identified)
        reviewer_editor.push(identified)
    }
    if (filtered.includes("single")) {
        author_reviewer.push(identified)
        reviewer_author.push(anonymous)
    }
    if (filtered.includes("double")) {
        author_reviewer.push(anonymous)
        reviewer_author.push(anonymous)
    }
    if (filtered.includes("triple")) {
        editor = true
        author_reviewer.push(anonymous)
        author_editor.push(anonymous)
        reviewer_author.push(anonymous)
        reviewer_editor.push(anonymous)
    }
    const editor_str = editor ? `
        ?policy ppo:involves ?editor .
        ?editor a pro:editor .
        ?author ?author_editor ?editor .
        ?reviewer ?reviewer_editor ?editor .
    ` : ''
    const author_reviewer_str = author_reviewer.length > 0 ? `
        filter(?author_reviewer in (${author_reviewer.join(', ')}))
    ` : ''
    const reviewer_author_str = reviewer_author.length > 0 ? `
        filter(?reviewer_author in (${reviewer_author.join(', ')}))
    ` : ''
    const author_editor_str = author_editor.length > 0 ? `
        filter(?author_editor in (${author_editor.join(', ')}))
    ` : ''
    const reviewer_editor_str = reviewer_editor.length > 0 ? `
        filter(?reviewer_editor in (${reviewer_editor.join(', ')}))
    ` : ''
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
            ${editor_str}
            ${author_reviewer_str}
            ${reviewer_author_str}
            ${author_editor_str}
            ${reviewer_editor_str}
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
                ppo:covers ?ppc .
            ?ppc a ppo:postPublicationCommenting .
            filter(?ppc in (${filtered.join(', ')}))
        }
    `;
    return filtered.length ? q : "";
};
