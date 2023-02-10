import React from "react";
import { useNavigate } from "react-router-dom";
import { pad_id_norm } from "../query/pad";
import { useAppSelector } from "../store";

const PadTable = () => {
    const pads = useAppSelector((store) => store.pads.pads)
    return (
        <table id="results">
            <thead>
                <tr className="table-head">
                    <th>Names</th>
                    <th>Identifiers</th>
                    <th>Keywords</th>
                </tr>
            </thead>
            <tbody>
                {pads.map((pad) => (
                    <PadRow key={pad["@id"]} pad={pad} />
                ))}
            </tbody>
        </table>
    );
};

function prop_str(prop: string | object) {
    return prop["@id"] || prop["@value"] || String(prop);
}

type RowProps = { prop: Array<string> | Array<object> };
const FirstRow = ({ prop }: RowProps) => {
    const pr = prop ? prop.map((p) => prop_str(p)) : ["<null>"];
    return <td>{pr.find(Boolean)}</td>;
};
const JoinRow = ({ prop }: RowProps) => {
    const pr = prop ? prop.map((p) => prop_str(p)) : ["<null>"];
    return <td>{pr.join(", ")}</td>;
};

type PadRowProps = { pad: object };
const PadRow = ({ pad }: PadRowProps) => {
    const pad_id = pad_id_norm(pad["@id"]);
    const navigate = useNavigate();
    return (
        <tr
            className="padrow"
            key={pad_id}
            onClick={() => navigate(`/pad/${pad_id}`)}
        >
            <FirstRow prop={pad["schema:name"]} />
            <JoinRow prop={pad["dcterms:identifier"]} />
            <JoinRow prop={pad["ppo:hasKeyword"]} />
        </tr>
    );
};

export { PadTable };
