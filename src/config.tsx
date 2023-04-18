import { customColor } from "./components/theme";

export const pagesize = 20

export const endpoint = {
    type: "sparql",
    value: "https://sparql.journalobservatory.org/repositories/job"
};
export const endpoint_timeout = 20_000

export const labels = {
    "@id": "Identifier",
    "@type": "Type",
    "https://doaj.org": "DOAJ",
    "https://v2.sherpa.ac.uk/romeo": "Sherpa-Romeo",
    "https://www.wikidata.org": "Wikidata",
    "https://openalex.org": "OpenAlex",
    "https://www.ieee.org": "IEEE",
    "https://springernature.com": "Springer",
    "https://wiley.com": "Wiley",
    "https://www.wiley.com": "Wiley",
    "https://www.wiley.com/": "Wiley",
    "https://elifesciences.org": "eLife",
    "https://creativecommons.org/publicdomain/zero/1.0/": "CC0",
    "https://creativecommons.org/licenses/by/4.0/": "CC BY",
    "https://creativecommons.org/licenses/by-nc/4.0/": "CC BY-NC",
    "https://creativecommons.org/licenses/by-nc-nd/4.0/": "CC BY-NC-ND",
    "https://creativecommons.org/licenses/by-nc-sa/4.0/": "CC BY-NC-SA",
    "https://creativecommons.org/licenses/by-nd/4.0/": "CC BY-ND",
    "https://creativecommons.org/licenses/by-sa/4.0/": "CC BY-SA",
    "non_commercial_institutional_repository": "Non Commercial Institutional Repository",
    "non_commercial_subject_repository": "Non Commercial Subject Repository",
    "non_commercial_social_network": "Non Commercial Social Network",
    "this_journal": "This Journal",
    "named_repository": "Named Repository",
    "any_website": "Any Website",
    "preprint_repository": "Preprint Repository",
    "institutional_website": "Institutional Website",
    "named_academic_social_network": "Named Academic Social Network",
    "any_repository": "Any Repository",
    "non_commercial_repository": "Non Commercial Repository",
    "non_commercial_website": "Non Commercial Website",
    "institutional_repository": "Institutional Repository",
    "authors_homepage": "Authors Homepage",
    "funder_designated_location": "Funder Designated Location",
    "subject_repository": "Subject Repository",
    "academic_social_network": "Academic Social Network",
    "ppo:hasPublicationPolicy": "has Publication Policy",
    "ppo:hasPublicationElsewherePolicy": "has Publication Elsewhere Policy",
    "ppo:hasEvaluationPolicy": "has Evaluation Policy",
    "ppo:postPublicationCommentingOpen": "Open",
    "ppo:postPublicationCommentingOnInvitation": "On Invitation",
    "ppo:postPublicationCommentingClosed": "Closed"
}

export const colors_override: {[key: string]: customColor} = {
    "https://doaj.org": "custom1",
    "https://v2.sherpa.ac.uk/romeo": "custom2",
    "https://www.wikidata.org": "custom3",
    "https://openalex.org": "custom4",
    "https://www.ieee.org": "custom5",
    "https://springernature.com": "custom6",
    "https://www.wiley.com": "custom7",
    "https://elifesciences.org": "custom8",
}

export const context = {
    "brick": "https://brickschema.org/schema/Brick#",
    "csvw": "http://www.w3.org/ns/csvw#",
    "dc": "http://purl.org/dc/elements/1.1/",
    "dcat": "http://www.w3.org/ns/dcat#",
    "dcmitype": "http://purl.org/dc/dcmitype/",
    "dcterms": "http://purl.org/dc/terms/",
    "dcam": "http://purl.org/dc/dcam/",
    "doap": "http://usefulinc.com/ns/doap#",
    "foaf": "http://xmlns.com/foaf/0.1/",
    "odrl": "http://www.w3.org/ns/odrl/2/",
    "org": "http://www.w3.org/ns/org#",
    "owl": "http://www.w3.org/2002/07/owl#",
    "prof": "http://www.w3.org/ns/dx/prof/",
    "prov": "http://www.w3.org/ns/prov#",
    "qb": "http://purl.org/linked-data/cube#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "schema": "https://schema.org/",
    "sh": "http://www.w3.org/ns/shacl#",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "sosa": "http://www.w3.org/ns/sosa/",
    "ssn": "http://www.w3.org/ns/ssn/",
    "time": "http://www.w3.org/2006/time#",
    "vann": "http://purl.org/vocab/vann/",
    "void": "http://rdfs.org/ns/void#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "xml": "http://www.w3.org/XML/1998/namespace",
    "cc": "http://creativecommons.org/ns#",
    "doaj": "https://doaj.org/",
    "fabio": "http://purl.org/spar/fabio/",
    "fc": "https://fatcat.wiki/",
    "issn": "https://issn.org/",
    "pad": "https://journalobservatory.org/pad/",
    "ppo": "http://purl.org/cwts/ppo/",
    "loc": "http://id.loc.gov/ontologies/bibframe/",
    "onto": "http://www.ontotext.com/",
    "openalex": "https://docs.openalex.org/about-the-data/venue#",
    "prism": "http://prismstandard.org/namespaces/basic/2.0/",
    "pro": "http://purl.org/spar/pro/",
    "pso": "http://purl.org/spar/pso/",
    "romeo": "https://v2.sherpa.ac.uk/id/",
    "rdfg": "http://www.w3.org/2004/03/trix/rdfg-1/",
    "schema1": "http://schema.org/",
    "stm": "https://osf.io/7j6ck/",
    "wd": "http://www.wikidata.org/entity/",
    "wdt": "http://www.wikidata.org/prop/direct/",
    "wikibase": "http://wikiba.se/ontology#"
};

export const info = {
    "publication-policy-filterbar": `
### Filters for policies of platforms regarding the publication of a scholarly work.
- **Has Publication Policy**  
  The platform has a policy regarding publishing on its own platfom.
- **Is Open Access**  
  Articles published on the platform can be published with an open access license.
- **Has Article Publishing Charges**  
  .
- **License**  
  .
- **Has Copyright Owner**  
  .
- **Has Embargo Duration**  
  .
`,
    "ppo:PublicationPolicy":
        "Policies of the platform regarding the publication of a scholarly work."

};
