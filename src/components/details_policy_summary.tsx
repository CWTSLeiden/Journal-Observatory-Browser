type Summary = [string, string, React.ReactElement?]

const summarize = (data: [string, string, ...any][], summary: (s: string) => Summary) =>
    data.map(([,v,]) => summary(v)).filter(Boolean)


export const openaccess = (value: string): Summary => {
    switch(value) {
        case "true":
            return ["Open Access", "success"]
        case "false":
            return ["Closed Access", "error"]
        default:
            return null
    }
}

export const license = (value: string): Summary => {
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

export const apc = (value: string): Summary => {
    const amount = Number(value.split(' ')[0])
    if (amount == 0) {return [`No APC`, "success"]}
    else { return [`APC: ${amount}`, "warning"] }
}

export const copyright_owner = (value: string): Summary => {
    switch(value) {
        case "pro:author":
            return [value, "success"]
        case "pro:publisher":
            return [value, "warning"]
        default:
            return [value, "default"]
    }
}

export const version = (value: string): Summary => {
    return [value, "default"]
}

export const elsewhere_type = (value: string): Summary => {
    const typelabel = {
        "ppo:PublicationElsewhereAllowedPolicy": "Allowed",
        "ppo:PublicationElsewhereProhibitedPolicy": "Prohibited",
        "ppo:PublicationElsewhereMandatoryPolicy": "Mandatory"
    }
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

export default summarize
