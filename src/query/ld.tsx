export function pad_id_norm(pad_id: string) {
    const regex = /([A-Za-z0-9-]+)$/i
    const result = regex.exec(pad_id)
    return (result && result[0]) || pad_id
}

export const ld_to_str = (obj: string | object | Array<object> | Array<string>): string => {
    const to_str = (o: string | object) => o ? o["@id"] || o["@value"] || String(o) : "";
    return Array.isArray(obj) ? obj.map(to_str).join(", ") : to_str(obj)
}

const zip_ordering = (a: [string, string, string[]], b: [string, string, string[]]) => {
    const [aprop, avalue, ] = a
    const [bprop, bvalue, ] = b
    if (aprop > bprop) { return 1 }
    if (aprop < bprop) { return -1 }
    if (avalue > bvalue) { return 1 }
    if (avalue < bvalue) { return -1 }
    return 0
}

export const ld_zip_src = (obj: object[], prop?: string) => {
    const zip = []
    const add = (prop: string, items, src: string[]) => {
        if (Array.isArray(items)) {
            items.map(item => zip.push([prop, ld_to_str(item), src]))
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
