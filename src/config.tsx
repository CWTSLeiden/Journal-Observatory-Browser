import { customColor } from "./components/theme";

export const pagesize = 20

export const endpoint = {
    type: "sparql",
    value: "https://sparql.journalobservatory.org/repositories/job"
};
export const endpoint_timeout = 20_000

export const info: {[key: string]: string} = {}

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


