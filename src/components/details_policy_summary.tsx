import { AttachMoney, Attribution, CheckCircle, Copyright, Error, Lock, LockOpen, MoneyOff, RemoveCircle, Visibility, VisibilityOff } from "@mui/icons-material"
import { IconTypeMap } from "@mui/material/Icon"
import { OverridableComponent } from "@mui/material/OverridableComponent"

export type Summary = [string, string, OverridableComponent<IconTypeMap>?]

const summarize = (data: [string, string, ...unknown[]][], summary: (s: string) => Summary) =>
    data.map(([,v]) => summary(v)).filter(Boolean)


export const openaccess = (value: string): Summary => {
    switch(value) {
        case "true":
            return ["Open Access", "success", LockOpen]
        case "false":
            return ["Closed Access", "error", Lock]
        default:
            return null
    }
}

export const license = (value: string): Summary => {
    const icon = Attribution
    switch(value) {
        case "https://creativecommons.org/publicdomain/zero/1.0/":
            return [value, "success", icon]
        case "https://creativecommons.org/licenses/by/4.0/":
            return [value, "warning", icon]
        case "https://creativecommons.org/licenses/by-nc/4.0/":
            return [value, "warning", icon]
        case "https://creativecommons.org/licenses/by-nc-nd/4.0/":
            return [value, "warning", icon]
        case "https://creativecommons.org/licenses/by-nc-sa/4.0/":
            return [value, "warning", icon]
        case "https://creativecommons.org/licenses/by-nd/4.0/":
            return [value, "warning", icon]
        case "https://creativecommons.org/licenses/by-sa/4.0/":
            return [value, "warning", icon]
        default:
            return [value, "default", icon]
    }
}

export const apc = (value: string): Summary => {
    const amount = Number(value.split(' ')[0])
    if (amount == 0) {return [`No APC`, "success", MoneyOff]}
    else { return [`APC: ${amount}`, "warning", AttachMoney] }
}

export const copyright_owner = (value: string): Summary => {
    const icon = Copyright
    switch(value) {
        case "pro:author":
            return [value, "success", icon]
        case "pro:publisher":
            return [value, "warning", icon]
        default:
            return [value, "default", icon]
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
            return [`Type: ${typelabel[value]}`, "success", CheckCircle]
        case "Prohibited":
            return [`Type: ${typelabel[value]}`, "error", RemoveCircle]
        case "Mandatory":
            return [`Type: ${typelabel[value]}`, "warning", Error]
        default:
            return [value, "default"]
    }
}

export const anonymized = (value: string): Summary => {
    switch(value) {
        case "Single":
            return [`${value} Anonymized`, "primary", VisibilityOff]
        case "Double":
            return [`${value} Anonymized`, "primary", VisibilityOff]
        case "Triple":
            return [`${value} Anonymized`, "primary", VisibilityOff]
        case "All Identities Visible":
            return ["All Identities Visible", "success", Visibility]
        default:
            return null
    }
}

export const accessible = (obj: [string, string, string?]): Summary => {
    const [label, value] = obj
    switch(value) {
        case "ppo:Accessible":
            return [label, "default", Visibility]
        default:
            return null
    }
}
export const no_accessible = (label: string): Summary => 
    [label, "error", VisibilityOff]


export default summarize
