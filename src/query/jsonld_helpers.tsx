import context from "../strings/context.json";

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

export function pad_id_norm(pad_id: string) {
    const regex = /([A-Za-z0-9-]+)$/i
    const result = regex.exec(pad_id)
    return (result && result[0]) || pad_id
}

export const ld_to_str = (obj: string | object | Array<object> | Array<string>): string => {
    const to_str = (o: string | object) => o ? o["@id"] || o["@value"] || String(o) : "";
    return Array.isArray(obj) ? obj.map(to_str).join(", ") : to_str(obj)
}

export const zip_ordering = (a: [string, string, ...unknown[]], b: [string, string, ...unknown[]]) => {
    const [aprop, avalue, ] = a
    const [bprop, bvalue, ] = b
    if (bprop == null) { return 1 }
    if (aprop == null) { return -1 }
    if (aprop.toLowerCase() > bprop.toLowerCase()) { return 1 }
    if (aprop.toLowerCase() < bprop.toLowerCase()) { return -1 }
    if (bvalue == null) { return 1 }
    if (avalue == null) { return -1 }
    if (avalue.toLowerCase() > bvalue.toLowerCase()) { return 1 }
    if (avalue.toLowerCase() < bvalue.toLowerCase()) { return -1 }
    return 0
}

export const ld_zip_src = (obj: object[], prop?: string) => {
    const zip = []
    const add = (prop: string, items: object[] | object | string, src: string[]) => {
        if (Array.isArray(items)) {
            items.map((item: object) => zip.push([prop, ld_to_str(item), src]))
        }
    }
    obj.map((o: object) => {
        const src = Array.isArray(o["ppo:_src"]) ? o["ppo:_src"] : []
        const sources = src.map(s => ld_to_str(s))
        if (prop) {
            add(prop, o[prop], sources)
        } else {
            Object.entries(o).map(([k, v]) => {
                const items = k == "ppo:_src" ? null : v
                add(k, items, sources)
            })
        }
    })
    return zip.sort(zip_ordering)
}

export const zip_prop = (obj: object) => (prop: string, link?: string | boolean) => {
    const linkify = (value: object, link?: string | boolean) => {
        if (typeof(link) === "boolean" && !link) { return null }
        else if (typeof(link) === "boolean" && link) { return expand_id(ld_to_str(value)) }
        else if (typeof(link) === "string") { return link }
    }
    const val = Array.isArray(obj[prop]) ? obj[prop] : [obj[prop]]
    return val
        .filter(Boolean)
        .map((v: object) => [
            prop,
            ld_to_str(v),
            linkify(v, link)
        ])
}

export const first = (o: object, p: string) =>
    Array.isArray(o[p]) ? o[p].find(Boolean) : o[p]

export const ld_contains = (prop: string, find: string) => (obj: object) : boolean =>
    (obj[prop] || []).map(ld_to_str).includes(find)

const cons_ordering = (a: [object, string[]], b: [object, string[]]) => {
    const [aobj,] = a
    const [bobj,] = b
    if (aobj["@id"] > bobj["@id"]) { return 1 }
    if (aobj["@id"] < bobj["@id"]) { return -1 }
    return 0
}
export const ld_cons_src = (obj: object[]) => {
    const zip = []
    obj.map((o: object) => {
        const src = Array.isArray(o["ppo:_src"]) ? o["ppo:_src"] : []
        const sources = src.map(s => ld_to_str(s))
        zip.push([o, sources])
    })
    return zip.sort(cons_ordering)
}

export const todate = (date: string) => {
    const parse = Date.parse(date)
    return isNaN(parse) ? date : (new Date(parse)).toISOString().substring(0, 10)
}
