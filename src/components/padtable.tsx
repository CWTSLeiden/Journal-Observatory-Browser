import React from "react";

type PadTableProps = {
    padlist: Array<object>;
    handleClick: (id: string) => void;
};
const PadTable = ({ padlist, handleClick }: PadTableProps) => (
    <table id="results">
        <thead>
            <tr className="table-head">
                <th>Names</th>
                <th>Identifiers</th>
                <th>Keywords</th>
            </tr>
        </thead>
        <tbody>
            {padlist.map((pad) => (
                <PadRow key={pad["@id"]} pad={pad} handleClick={handleClick} />
            ))}
        </tbody>
    </table>
);

type PadRowProps = { pad: object; handleClick: (id: string) => void };
const PadRow = ({ pad, handleClick }: PadRowProps) => (
    <tr onClick={() => handleClick(pad["@id"])}>
        <td>
            {pad["schema:name"] ? pad["schema:name"].find(Boolean) : "<null>"}
        </td>
        <td>
            {pad["dcterms:identifier"]
                ? pad["dcterms:identifier"].join(", ")
                : "<null>"}
        </td>
        <td>
            {pad["ppo:hasKeyword"]
                ? pad["ppo:hasKeyword"].join(", ")
                : "<null>"}
        </td>
    </tr>
);

export { PadTable };
