export const ld_to_str = (obj: string | object | Array<object> | Array<string>): string => {
    const to_str = (o: string | object) => o ? o["@id"] || o["@value"] || String(o) : "";
    return Array.isArray(obj) ? obj.map(to_str).join(", ") : to_str(obj)
}

export function pad_id_norm(pad_id: string) {
    const regex = /([A-Za-z0-9-]+)$/i
    const result = regex.exec(pad_id)
    return (result && result[0]) || pad_id
}
