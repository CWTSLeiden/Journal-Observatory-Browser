import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router-dom";
import * as actions from "../actions/search";
import { pad_id_norm } from "../query/pad";
import { useAppDispatch, useAppSelector } from "../store";

const PadTable = () => {
    const pads = useAppSelector((store) => store.pads.pads);
    return (
        <TableContainer component={Paper}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 800 }}>Names</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}> Identifiers</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Keywords</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pads.map((pad) => (
                        <PadRow key={pad["@id"]} pad={pad} />
                    ))}
                    {pads.length < 1 ? <NoResultsRow /> : ""}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const NoResultsRow = () => (
    <TableRow><TableCell>No Results</TableCell></TableRow>
)

const PadTablePagination = () => {
    const total = useAppSelector((store) => store.pads.total);
    const pagesize = useAppSelector((store) => store.search.pagesize);
    const page = useAppSelector((store) => store.search.page);
    const dispatch = useAppDispatch();
    return (
        <TablePagination
            component={Paper}
            page={page}
            rowsPerPage={pagesize}
            rowsPerPageOptions={[20, 50, 100]}
            onRowsPerPageChange={(e) => {
                dispatch(actions.setPagesize(Number(e.target.value)));
            }}
            onPageChange={(_, n) => {
                dispatch(actions.setPage(n));
            }}
            count={total}
            colSpan={4}
        />
    );
};

const propToString = (
    prop: Array<string> | Array<object> = ["<null>"],
    short = false
): string => {
    const prop_str = (p: string | object): string =>
        p["@id"] || p["@value"] || String(p);
    prop = prop.map((p: string | object) => prop_str(p));
    return short ? prop.find(Boolean) : prop.join(", ");
};

type PadRowProps = { pad: object };
const PadRow = ({ pad }: PadRowProps) => {
    const pad_id = pad_id_norm(pad["@id"]);
    const navigate = useNavigate();
    const handleClick = () => navigate(`/pad/${pad_id}`);
    return (
        <TableRow hover key={pad_id} onClick={handleClick} sx={{cursor: "pointer"}}>
            <TableCell>{propToString(pad["schema:name"], true)}</TableCell>
            <TableCell>{propToString(pad["dcterms:identifier"])}</TableCell>
            <TableCell>{propToString(pad["ppo:hasKeyword"])}</TableCell>
            <TableCell>
                <ArrowForward fontSize="small"/>
            </TableCell>
        </TableRow>
    );
};

export { PadTable, PadTablePagination };
