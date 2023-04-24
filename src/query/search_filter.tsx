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
        ?platform ?searchprop ?search .
        ?search onto:fts '${s.replace(/'/g, '"')}'
        filter(?searchprop in (schema:name) 
            || ?searchprop in (dcterms:identifier))
    `;
    return s ? q : "";
};

export const creator_filter = (search: SearchState) => {
    const filtered = enabled(search.creators, "uri")
    const q = `
        ?assertion pad:hasSourceAssertion [ dcterms:creator ?screator ] .
        filter(?screator in (${filtered.join(', ')}))
    `
    return filtered.length ? q : ""
}

export const pub_policy_filter = (search: SearchState) => {
    const q = `
        filter exists {
            ?platform scpo:hasPolicy ?policy .
            ?policy a scpo:PublicationPolicy .
        }
    `;
    return search.pub_policy ? q : "";
};

export const pub_open_access_filter = (search: SearchState) => {
    const q = `
        filter exists {
            ?platform scpo:hasPolicy ?policy .
            ?policy a scpo:PublicationPolicy ;
            scpo:isOpenAccess true .
        }
    `;
    return search.open_access ? q : "";
};

export const pub_embargo_filter = (search: SearchState) => {
    const q = `
        filter exists {
            ?platform scpo:hasPolicy ?policy .
            ?policy a scpo:PublicationPolicy ;
                fabio:hasEmbargoDuration ?pub_embargo .
            filter(?pub_embargo <= "P${search.pub_embargoduration}M"^^xsd:duration)
        }
    `;
    return search.pub_embargo ? q : "";
};

export const pub_apc_filter = (search: SearchState) => {
    const q = `
        filter exists {
            ?platform scpo:hasPolicy ?policy .
            ?policy a scpo:PublicationPolicy .
            optional {
                ?policy scpo:hasArticleProcessingCharge [ schema:price ?price ] .
            }
            optional {
                ?policy scpo:hasOpenAccessFee ?oafee .
            }
            filter(?price > 0 || ?oafee)
        }
    `;
    return search.pub_apc ? q : "";
};

export const pub_copyrightowner_filter = (search: SearchState) => {
    const filtered = enabled(search.pub_copyrightowners)
    const q = `
        filter exists {
            ?platform scpo:hasPolicy ?policy .
            ?policy a scpo:PublicationPolicy ;
                scpo:hasCopyrightOwner [ a ?copyrightowner ] .
            filter(?copyrightowner in (${filtered.join(', ')}))
        }
    `;
    return filtered.length ? q : "";
};

export const pub_license_filter = (search: SearchState) => {
    const filtered = enabled(search.pub_licenses, "uri")
    const q = `
        filter exists {
            ?platform scpo:hasPolicy ?policy .
            ?policy a scpo:PublicationPolicy ;
                dcterms:license ?license .
            filter(?license in (${filtered.join(', ')}))
        }
    `;
    return filtered.length ? q : "";
};

export const elsewhere_policy_filter = (search: SearchState) => {
    const q = `
        filter exists {
            ?platform scpo:hasPolicy ?policy .
            ?policy a scpo:PublicationElsewherePolicy .
        }
    `;
    return search.elsewhere_policy ? q : "";
};


export const elsewhere_version_filter = (search: SearchState) => {
    const filtered = enabled(search.elsewhere_versions)
    const q = `
        filter exists {
            ?platform scpo:hasPolicy ?policy .
            ?policy a scpo:PublicationElsewherePolicy ;
                scpo:appliesToVersion ?version .
            filter(?version in (${filtered.join(', ')}))
        }
    `;
    return filtered.length ? q : "";
};

export const elsewhere_location_filter = (search: SearchState) => {
    const filtered = enabled(search.elsewhere_locations, "string")
    const q = `
        filter exists {
            ?platform scpo:hasPolicy ?policy .
            ?policy a scpo:PublicationElsewherePolicy ;
                scpo:publicationLocation ?location .
            filter(?location in (${filtered.join(', ')}))
        }
    `;
    return filtered.length ? q : "";
};

export const elsewhere_license_filter = (search: SearchState) => {
    const filtered = enabled(search.elsewhere_licenses, "uri")
    const q = `
        filter exists {
            ?platform scpo:hasPolicy ?policy .
            ?policy a scpo:PublicationElsewherePolicy ;
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
            ?platform scpo:hasPolicy ?policy .
            ?policy a scpo:PublicationElsewherePolicy ;
                scpo:hasCopyrightOwner [ a ?copyrightowner ] .
            filter(?copyrightowner in (${filtered.join(', ')}))
        }
    `;
    return filtered.length ? q : "";
};

export const elsewhere_embargo_filter = (search: SearchState) => {
    const q = `
        filter exists {
            ?platform scpo:hasPolicy ?policy .
            ?policy a scpo:PublicationElsewherePolicy ;
                fabio:hasEmbargoDuration ?pub_embargo .
            filter(?pub_embargo <= "P${search.elsewhere_embargoduration}M"^^xsd:duration)
        }
    `;
    return search.elsewhere_embargo ? q : "";
};

export const evaluation_policy_filter = (search: SearchState) => {
    const q = `
        filter exists {
            ?platform scpo:hasPolicy ?policy .
            ?policy a scpo:EvaluationPolicy .
        }
    `;
    return search.evaluation_policy ? q : "";
};

export const evaluation_anonymized_filter = (search: SearchState) => {
    const filtered = enabled(search.evaluation_anonymized)
    const all = `
        exists {
            ?editor a pro:editor .
            ?author scpo:identifiedTo ?reviewer .
            ?author scpo:identifiedTo ?editor .
            ?reviewer scpo:identifiedTo ?author .
            ?reviewer scpo:identifiedTo ?editor .
        }
    `
    const single = `
        exists {
            ?author scpo:identifiedTo ?reviewer .
            ?reviewer scpo:anonymousTo ?author .
        }
    `
    const double = `
        exists {
            ?author scpo:anonymousTo ?reviewer .
            ?reviewer scpo:anonymousTo ?author .
        }
    `
    const triple = `
        exists {
            ?editor a pro:editor .
            ?author scpo:anonymousTo ?reviewer .
            ?author scpo:anonymousTo ?editor .
            ?reviewer scpo:anonymousTo ?author .
            ?reviewer scpo:anonymousTo ?editor .
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
            ?platform scpo:hasPolicy ?policy .
            ?policy a scpo:EvaluationPolicy .
            ?policy scpo:involves ?author .
            ?author a pro:author .
            ?author ?author_reviewer ?reviewer .
            ?policy scpo:involves ?reviewer .
            ?reviewer a pro:peer-reviewer .
            ?reviewer ?reviewer_author ?author .
            ?policy scpo:involves ?editor .
            filter (${anonymized.join(' || ')})
        }
    `;
    return filtered.length ? q : "";
};

export const evaluation_interaction_filter = (search: SearchState) => {
    const filtered = enabled(search.evaluation_interactions)
    const q = `
        filter exists {
            ?platform scpo:hasPolicy ?policy .
            ?policy a scpo:EvaluationPolicy ;
                scpo:involves ?reviewer .
            ?reviewer a pro:peer-reviewer ;
                scpo:interactsWith ?agent .
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
            ?platform scpo:hasPolicy ?policy .
            ?policy a scpo:EvaluationPolicy ;
                scpo:covers ?work .
            ?work a ?worktype ;
                scpo:publiclyAccessible scpo:Accessible .
            filter(?worktype in (${filtered.join(', ')}))
        }
    `;
    return filtered.length ? q : "";
};

export const evaluation_comment_filter = (search: SearchState) => {
    const filtered = enabled(search.evaluation_comments)
    const q = `
        filter exists {
            ?platform scpo:hasPolicy ?policy .
            ?policy a scpo:EvaluationPolicy ;
                scpo:hasPostPublicationCommenting ?ppc .
            filter(?ppc in (${filtered.join(', ')}))
        }
    `;
    return filtered.length ? q : "";
};
