import React, { ReactElement, ReactNode, useContext, useState } from "react";
import { LinkItUrl } from "react-linkify-it";
import PropTypes from "prop-types";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    Dialog,
    Link,
    Typography,
} from "@mui/material";
import { ld_to_str } from "../query/ld";
import { labelize } from "../query/labels";
import { useAppSelector } from "../store";

function urlize(thing: ReactNode): ReactElement {
    return <LinkItUrl>{thing}</LinkItUrl>;
}

export const MaybeLink = ({link, label}: {link: string; label?: string}) => {
    const ishref = link.match(/^(https|http|www):/)
    const title = ishref && label ? label : link
    return ishref ? <Link href={link}>{title}</Link> : <Typography>{link}</Typography>
}

const LoadingView = () => <div>Loading</div>;

type SrcViewProps = { sources: Array<string> };
const SrcView = ({ sources }: SrcViewProps) => {
    return (
        <div className="src">
            {sources.map((s) => (
                <SrcViewPop key={s} id={s} />
            ))}
        </div>
    );
};
SrcView.propTypes = { sources: PropTypes.arrayOf(PropTypes.string).isRequired };

export const todate = (date: string) => {
    const parse = Date.parse(date)
    return isNaN(parse) ? date : (new Date(parse)).toISOString().substring(0, 10)
}

const SrcViewPop = ({ id }: { id?: string }) => {
    const [open, setOpen] = useState(false);
    const sources = useAppSelector(s => s.details.sources)
    const source = sources[id] || {"@id": id};
    const creator = labelize(ld_to_str(source["dcterms:creator"]))
    const created = todate(ld_to_str(source["dcterms:created"]))
    const license = ld_to_str(source["dcterms:license"])
    const license_link = <MaybeLink link={license} label={labelize(license)} />
    return (
        <>
            <Chip
                size="small"
                label={creator}
                onClick={() => setOpen(!open)}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <Card sx={{minWidth: 400}}>
                    <CardHeader title={creator} />
                    <CardContent sx={{ml: 4}}>
                        <Typography variant="subtitle1">Created</Typography>
                        <Typography color="text.secondary" sx={{ml: 2}}>{created}</Typography>
                        <Typography variant="subtitle1">License</Typography>
                        <Typography color="text.secondary" sx={{ml: 2}}>{license_link}</Typography>
                    </CardContent>
                    <CardActions><Button href={id}>Visit</Button></CardActions>
                </Card>
            </Dialog>
        </>
    );
};

type ValueViewProps = { value: string; src?: ReactNode };
const ValueView = ({ value, src }: ValueViewProps) => (
    <div className="value">
        {urlize(labelize(value))}
        {src}
    </div>
);
ValueView.propTypes = {
    value: PropTypes.string.isRequired,
    src: PropTypes.node,
};

type IdViewProps = { id: string; children?: ReactNode; src?: ReactNode };
const IdView = ({ id, children, src }: IdViewProps) => (
    <div className="id">
        {urlize(labelize(id))}
        {src}
        {children}
    </div>
);
IdView.propTypes = {
    id: PropTypes.string.isRequired,
    content: PropTypes.any,
    src: PropTypes.node,
};

type ListViewProps = { value: string | ReactNode; src?: ReactNode };
const ListView = ({ value, src }: ListViewProps) => (
    <li>
        {typeof(value) == "string" ? labelize(value): value}
        {src}
    </li>
);
ListView.propTypes = {
    value: PropTypes.any.isRequired,
    src: PropTypes.node,
};

type SortProps = { children: Array<ReactNode>; by?: string };
const Sort = ({ children, by }: SortProps) => {
    const compare = (a: ReactNode, b: ReactNode) => (a[by] > b[by] ? 1 : -1);
    if (by) {
        return <>{React.Children.toArray(children).sort(compare)}</>;
    }
    return <>{children}</>;
};

type UnorderedListViewProps = {
    children: Array<ReactNode>;
    sortBy?: string;
    src?: ReactNode;
};
const UnorderedListView = ({
    children,
    sortBy,
    src,
}: UnorderedListViewProps) => (
    <ul>
        {src}
        <Sort by={sortBy || "key"}>{children}</Sort>
    </ul>
);
UnorderedListView.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
    sortBy: PropTypes.string,
    src: PropTypes.node,
};

type OrderedListViewProps = {
    children: Array<ReactNode>;
    sortBy?: string;
    src?: ReactNode;
};
const OrderedListView = ({ children, sortBy, src }: OrderedListViewProps) => (
    <ol>
        {src}
        <Sort by={sortBy || "key"}>{children}</Sort>
    </ol>
);
OrderedListView.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
    sortBy: PropTypes.string,
    src: PropTypes.node,
};

type DefListViewProps = {
    title: string;
    value: string | ReactNode;
    src?: ReactNode;
};
const DefListView = ({ title, value, src }: DefListViewProps) => (
    <li>
        <dt>{labelize(title)}</dt>
        <dd>{value}</dd>
        {src}
    </li>
);
DefListView.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    src: PropTypes.node,
};

export {
    LoadingView,
    SrcView,
    ValueView,
    IdView,
    DefListView,
    ListView,
    UnorderedListView,
    OrderedListView,
};
