import {
    Card,
    Chip,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router-dom";
import * as actions from "../actions/search";
import { pad_id_norm, ld_to_str } from "../query/display_pad";
import { useAppDispatch, useAppSelector } from "../store";

const OrderLabel = ({ prop, label }: { prop: string, label: string }) => {
    const orderprop = useAppSelector((store) => store.search.orderprop);
    const orderasc = useAppSelector((store) => store.search.orderasc);
    const dispatch = useAppDispatch()
    const clickHandler = () => {
        if (orderprop === prop) {
            dispatch(actions.toggle_orderasc())
        }
        else {
            dispatch(actions.set_orderasc(true))
            dispatch(actions.set_orderprop(prop))
        }
    }
    return (
        <div>
            <TableSortLabel
                active={orderprop === prop}
                direction={orderasc ? 'asc' : 'desc'}
                onClick={clickHandler}
            >
                <b>{label}</b>
            </TableSortLabel>
        </div>
    )
}

const PadTable = () => {
    const pads = useAppSelector((store) => store.pads.pads);
    return (
                <>
                    {pads.map((pad) => (
                        <PadRow key={pad["@id"]} pad={pad} />
                    ))}
                    {pads.length < 1 ? <NoResultsRow /> : ""}
                </>
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
        <Grid container sx={{paddingLeft: 2, paddingRight: 2}}spacing={2} alignItems="center">
            <Grid item xs={4}>
                <OrderLabel label="Name" prop="schema:name" />
            </Grid>
            <Grid item xs={8}>
                <TablePagination
                    component="div"
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
            </Grid>
        </Grid>
    );
};

const propToString = (
    prop: Array<string> | Array<object> = [],
    short = false
): string => {
    prop = prop.map((p: string | object) => ld_to_str(p)).sort();
    return short ? prop.find(Boolean) : prop.join(", ");
};

type PadRowProps = { pad: object };
const PadRow = ({ pad }: PadRowProps) => {
    const pad_id = pad_id_norm(pad["@id"]);
    const navigate = useNavigate();
    const handleClick = () => navigate(`/pad/${pad_id}`);
    const name = propToString(pad["schema:name"], true) || "<none>"
    const issn = propToString(pad["prism:issn"], true)
    const pubp = pad["ppo:PublicationPolicy"] ? pad["ppo:PublicationPolicy"].length : 0
    const evap = pad["ppo:EvaluationPolicy"] ? pad["ppo:EvaluationPolicy"].length : 0
    const els  = pad["ppo:PublicationElsewherePolicy"] ? pad["ppo:PublicationElsewherePolicy"].length : 0
    const elsa = pad["ppo:PublicationElsewhereAllowed"] ? pad["ppo:PublicationElsewhereAllowed"].length : 0
    const elsp = pad["ppo:PublicationElsewhereProhibited"] ? pad["ppo:PublicationElsewhereProhibited"].length : 0
    const elsn = els + elsa + elsp
    const payw = pad["ppo:hasPaywall"] ? pad["ppo:hasPaywall"].some(p => p) : false
    return (
        <Card key={pad_id} onClick={handleClick} sx={{padding: 2, cursor: "pointer"}}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={8}><b>{name}</b></Grid>
                <Grid item xs={3}>{ issn ? <i>ISSN: {issn}</i> : null }</Grid>
                <Grid item xs={1}><ArrowForward fontSize="small"/></Grid>
                <Grid item xs={11} container spacing={2} alignItems="center">
                    <Grid item>Policies: </Grid>
                    { (pubp > 0) ? <Grid item><Chip color="primary" label={`Publication: ${pubp}`} /></Grid> : null }
                    { (evap > 0) ? <Grid item><Chip color="primary" label={`Evaluation: ${evap}`} /></Grid> : null }
                    { (elsn > 0) ? <Grid item><Chip color="primary" label={`Elsewhere: ${elsn}`} /></Grid> : null }
                    { (pubp + evap + elsn == 0) ? <Grid item><Chip label="none" variant="outlined" /></Grid> : null }
                    { payw ? <Grid item><Chip label="Paywall" color="error" /></Grid> : null }
                </Grid>
            </Grid>
        </Card>
    );
};

export { PadTable, PadTablePagination };
