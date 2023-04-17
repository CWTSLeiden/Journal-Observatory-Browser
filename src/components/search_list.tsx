import {Card, CardActionArea, CardContent, Chip, Grid, LinearProgress, Skeleton, TablePagination, TableSortLabel, Typography,} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import React, { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import * as actions from "../store/search";
import { pad_id_norm, ld_to_str } from "../query/jsonld_helpers";
import { useAppDispatch, useAppSelector } from "../store";
import { labelize } from "../query/labels";

const OrderLabel = ({ prop, label }: { prop: string, label: string }) => {
    const orderprop = useAppSelector((store) => store.search.orderprop);
    const orderasc = useAppSelector((store) => store.search.orderasc);
    const dispatch = useAppDispatch()
    const clickHandler = () => {
        if (orderprop === prop) {
            dispatch(actions.order_toggleasc())
        }
        else {
            dispatch(actions.order_setasc(true))
            dispatch(actions.order_setprop(prop))
        }
    }
    return (
        <TableSortLabel
            component="div"
            active={orderprop === prop}
            direction={orderasc ? 'asc' : 'desc'}
            onClick={clickHandler}
            sx={{marginBottom: 0, paddingBottom: 0, paddingLeft: 1 }}
        >
            {label}
        </TableSortLabel>
    )
}

export const PadList = ({loading, status}: {loading: boolean, status: number}) => {
    const pads = useAppSelector((store) => store.pads.pads);
    const pagesize = useAppSelector((store) => store.search.pagesize);
    if (loading) {
        return <PadCardSkeleton n={pagesize} />
    }
    if (status != 200) {
        return <Typography variant="body1">An unexpected error occurred.</Typography>
    }
    if (pads.length < 1) {
        return <Typography variant="body1">No platforms matching the search criteria have been found.</Typography>
    }
    return <>{pads.map((pad) => <PadCard key={pad["@id"]} pad={pad} />)}</>
};

export const PadCardSkeleton = ({n}: {n?: number}) => (
    <>
        {Array.from(Array(n == undefined ? 1 : n).keys()).map(n => (
            <Grid key={n} item>
                <Skeleton variant="rounded" height={125} sx={{padding: 2}} />
            </Grid>
        )
        )}
    </>
)

export const PadListPagination = ({loading}: {loading: boolean}) => {
    const pads = useAppSelector((store) => store.pads.pads);
    const total = useAppSelector((store) => store.pads.total);
    const pagesize = useAppSelector((store) => store.search.pagesize);
    const page = useAppSelector((store) => store.search.page);
    const dispatch = useAppDispatch();
    if (pads.length < 1 && !loading) {
        return null
    } else {
        return (
            <Typography variant="body2" component="div" height={40}>
                <Grid container sx={{paddingLeft: 0, paddingRight: 0}} alignItems="center" justifyContent="space-between">
                    <Grid item>
                        {loading &&
                            <Skeleton variant="rounded" width={100} sx={{padding: 2}} />
                        }
                        {!loading && pads.length > 1 &&
                            <OrderLabel label="Platform title" prop="schema:name" />
                        }
                    </Grid>
                    <Grid item>
                        {loading &&
                            <Skeleton component="div" variant="rounded" width={400} sx={{padding: 2}} />
                        }
                        {!loading && pads.length > 1 &&
                            <TablePagination
                                component="div"
                                page={page}
                                rowsPerPage={pagesize}
                                rowsPerPageOptions={[20, 50, 100]}
                                onRowsPerPageChange={(e) => {
                                    dispatch(actions.page_setsize(Number(e.target.value)));
                                }}
                                onPageChange={(_, n) => {
                                    dispatch(actions.page_set(n));
                                }}
                                count={total}
                                labelRowsPerPage='Platforms per page:'
                                labelDisplayedRows={function defaultLabelDisplayedRows({ from, to, count }) { return `Platform ${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`; }}
                            />
                        }
                    </Grid>
                </Grid>
            </Typography>
        );
    }
};

const propToString = (
    prop: Array<string> | Array<object> = [],
    short = false
): string => {
    prop = prop.map((p: string | object) => ld_to_str(p)).sort();
    return short ? prop.find(Boolean) : prop.join(", ");
};

type PadCardProps = { pad: object };
const PadCard = ({ pad }: PadCardProps) => {
    const pad_id = pad_id_norm(pad["@id"]);
    const navigate = useNavigate();
    const handleClick = () => navigate(`/pad/${pad_id}`);
    const name = propToString(pad["schema:name"], true) || "<none>"
    const issn = propToString(pad["prism:issn"], true)
    return (
        <Card key={pad_id} onClick={handleClick} sx={{padding: 0, cursor: "pointer", minHeight: '125px'}}>
            <CardActionArea>
                <CardContent>
                    <Grid container spacing={2} alignItems="flex-start">
                        <Grid item xs={8}><Typography variant="subtitle1" component="div" sx={{fontWeight: 'bold'}}>{name}</Typography></Grid>
                        <Grid item xs={3}>{ issn ? <Typography>ISSN: {issn}</Typography> : null }</Grid>
                        <Grid item xs={1}><ArrowForward fontSize="small"/></Grid>
                        <Grid item xs={12} container spacing={2} alignItems="center">
                            <Grid item xs={1} sx={{minWidth: 80}}><Typography>Policies:</Typography></Grid>
                            <PadCardPolicies pad={pad} />
                        </Grid>
                        <Grid item xs={12} container spacing={2} alignItems="center">
                            <Grid item xs={1} sx={{minWidth: 80}}><Typography>Sources:</Typography></Grid>
                            <PadCardSources pad={pad} />
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

const Cond = ({ cond, children }: { cond: boolean, children: ReactElement }) => (
    cond ? <>{children}</> : null
)

const PadCardPolicies = ({ pad }: PadCardProps) => {
    const pubpolicies       = pad["ppo:PublicationPolicy"]?.length || 0
    const evalpolicies      = pad["ppo:EvaluationPolicy"]?.length || 0
    const elsewherepolicies = pad["ppo:PublicationElsewherePolicy"]?.length || 0
    const open_access = pad["ppo:isOpenAccess"]?.some(Boolean) || false
    return (
        <>
            <Cond cond={pubpolicies > 0}>
                <Grid item>
                    <Chip color="primary" label={`Publication: ${pubpolicies}`} />
                </Grid>
            </Cond>
            <Cond cond={evalpolicies > 0}>
                <Grid item>
                    <Chip color="primary" label={`Evaluation: ${evalpolicies}`} />
                </Grid>
            </Cond>
            <Cond cond={elsewherepolicies > 0}>
                <Grid item>
                    <Chip color="primary" label={`Elsewhere: ${elsewherepolicies}`} />
                </Grid>
            </Cond>
            <Cond cond={pubpolicies + evalpolicies + elsewherepolicies == 0}>
                <Grid item>
                    <Chip label="none" variant="outlined" />
                </Grid>
            </Cond>
            <Cond cond={open_access}>
                <Grid item>
                    <Chip label="Open Access" color="error" />
                </Grid>
            </Cond>
        </>
    )
}

const PadCardSources = ({ pad }: PadCardProps) => {
    const sources = (pad["dcterms:creator"] || []).map(ld_to_str)
    return (
        <>
            { sources.map((c: string) =>
                <Grid item key={c}><Chip color="secondary" label={labelize(c)} /></Grid>) }
            <Cond cond={sources.length == 0}>
                <Grid item>
                    <Chip label="none" variant="outlined" />
                </Grid>
            </Cond>
        </>
    )
}
