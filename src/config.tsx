export const pagesize = 20

export const creators = {
    "https://doaj.org": "DOAJ",
    "https://v2.sherpa.ac.uk/romeo": "Sherpa-Romeo",
    "https://www.wikidata.org": "Wikidata",
    "https://openalex.org": "OpenAlex",
    "https://www.ieee.org": "IEEE",
    "https://springernature.com": "Springer",
    "https://www.wiley.com/": "Wiley",
    "https://elifesciences.org/": "eLife"
}

export const endpoint = {
    type: "sparql",
    // value: "http://localhost:7200/repositories/job"
    value: "https://sparql.boomen.net/repositories/job"
    // value: "http://188.166.16.172:7200/repositories/job"
};

export const mapping = {
    "@id": "Identifier",
    "@type": "Type",
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
    "ppo": "https://purl.org/cwts/ppo/",
    "loc": "http://id.loc.gov/ontologies/bibframe/",
    "openalex": "https://docs.openalex.org/about-the-data/venue#",
    "prism": "http://prismstandard.org/namespaces/basic/2.0/",
    "pro": "http://purl.org/spar/pro/",
    "romeo": "https://v2.sherpa.ac.uk/id/",
    "rdfg": "http://www.w3.org/2004/03/trix/rdfg-1/",
    "schema1": "http://schema.org/",
    "stm": "https://osf.io/7j6ck/",
    "wd": "http://www.wikidata.org/entity/",
    "wdt": "http://www.wikidata.org/prop/direct/",
    "wikibase": "http://wikiba.se/ontology#"
};

export const compact_id = (id: string) => {
    for (const [k, v] of Object.entries(context)) {
        if (id.indexOf(v) == 0) {
            return id.replace(v, `${k}:`)
        }
    }
    return id
}

export const expand_id = (id: string) =>  {
    for (const [k, v] of Object.entries(context)) {
        if (id.indexOf(`${k}:`) == 0) {
            return id.replace(`${k}:`, v)
        }
    }
    return id
}
