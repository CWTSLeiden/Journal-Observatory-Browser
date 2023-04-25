import { AttachMoney, Attribution, CheckCircle, Copyright, Error, GppGood, GppMaybe, Lock, LockOpen, Message, MoneyOff, RemoveCircle, Reviews, SpeakerNotesOff, Visibility, VisibilityOff } from "@mui/icons-material"
import { IconTypeMap } from "@mui/material/Icon"
import { OverridableComponent } from "@mui/material/OverridableComponent"
import { PolicyItem } from "./details_policy";


export const summarize = (
    item: PolicyItem,
    summary?: string,
    color?: string,
    Icon?: OverridableComponent<IconTypeMap>
): PolicyItem => ({...item, summary, color, Icon})

export const openaccess = (item: PolicyItem): PolicyItem => {
    switch(item.value) {
        case "true":
            return summarize(item, "Open access", "success", LockOpen)
        case "false":
            return summarize(item, "Closed access", "error", Lock)
        default:
            return item
    }
}

export const license = (item: PolicyItem): PolicyItem => {
    const icon = Attribution
    switch(item.value) {
        case "https://creativecommons.org/publicdomain/zero/1.0/":
            return summarize(item, item.value, "success", icon)
        case "https://creativecommons.org/licenses/by/4.0/":
            return summarize(item, item.value, "warning", icon)
        case "https://creativecommons.org/licenses/by-nc/4.0/":
            return summarize(item, item.value, "warning", icon)
        case "https://creativecommons.org/licenses/by-nc-nd/4.0/":
            return summarize(item, item.value, "warning", icon)
        case "https://creativecommons.org/licenses/by-nc-sa/4.0/":
            return summarize(item, item.value, "warning", icon)
        case "https://creativecommons.org/licenses/by-nd/4.0/":
            return summarize(item, item.value, "warning", icon)
        case "https://creativecommons.org/licenses/by-sa/4.0/":
            return summarize(item, item.value, "warning", icon)
        default:
            return summarize(item, item.value, "default", icon)
    }
}

export const apc = (item: PolicyItem): PolicyItem => {
    const amount = Number(item.value.split(' ')[0])
    if (amount == 0) {
        return summarize(item, "No APC", "success", MoneyOff)
    }
    else if (Number.isNaN(amount)) {
        return summarize(item, `APC`, "warning", AttachMoney)
    }
    else {
        return summarize(item, `APC: ${amount}`, "warning", AttachMoney)
    }
}

export const embargo = (item: PolicyItem): PolicyItem => {
    if (item.value == "No embargo") {
        return summarize(item, "No embargo", "success", GppGood)
    }
    else {
        return summarize(item, `Embargo: ${item.value}`, "error", GppMaybe)
    }
}

export const copyright_owner = (item: PolicyItem): PolicyItem => {
    const icon = Copyright
    switch(item.value) {
        case "pro:author":
            return summarize(item, item.value, "success", icon)
        case "pro:publisher":
            return summarize(item, item.value, "warning", icon)
        default:
            return summarize(item, item.value, "default", icon)
    }
}

export const version = (item: PolicyItem): PolicyItem => {
    return summarize(item, item.value, "default")
}

export const elsewhere_type = (item: PolicyItem): PolicyItem => {
    const typelabel = {
        "scpo:PublicationElsewhereAllowedPolicy": "Allowed",
        "scpo:PublicationElsewhereProhibitedPolicy": "Prohibited",
        "scpo:PublicationElsewhereMandatoryPolicy": "Mandatory"
    }
    const label = typelabel[item.value]
    switch(label) {
        case "Allowed":
            return summarize(item, `Type: ${label}`, "success", CheckCircle)
        case "Prohibited":
            return summarize(item, `Type: ${label}`, "error", RemoveCircle)
        case "Mandatory":
            return summarize(item, `Type: ${label}`, "warning", Error)
        default:
            return summarize(item, item.value, "default")
    }
}

export const anonymized = (item: PolicyItem): PolicyItem => {
    switch(item.value) {
        case "Single":
            return summarize(item, "Single anonymized", "primary", VisibilityOff)
        case "Double":
            return summarize(item, "Double anonymized", "primary", VisibilityOff)
        case "Triple":
            return summarize(item, "Triple anonymized", "primary", VisibilityOff)
        case "All Identities Visible":
            return summarize(item, "All identities visible", "success", Visibility)
        default:
            return item
    }
}

export const ppc = (item: PolicyItem): PolicyItem => {
    switch(item.value) {
        case "scpo:PostPublicationCommentingClosed":
            return summarize(item, item.value, "error", SpeakerNotesOff)
        case "scpo:PostPublicationCommentingOpen":
            return summarize(item, item.value, "success", Message)
        case "scpo:PostPublicationCommentingOnInvitation":
            return summarize(item, item.value, "primary", Reviews)
        default:
            return item
    }
}

export const accessible = (item: PolicyItem): PolicyItem => {
    switch(item.value) {
        case "scpo:Accessible":
            return summarize(item, item.type, "success", Visibility)
        default:
            return item
    }
}
export const no_accessible = (id: string, value: string): PolicyItem => {
    const item = {id: id, type: "scpo:Accessible"}
    return summarize(item, value, "error", VisibilityOff)
}


export default summarize
