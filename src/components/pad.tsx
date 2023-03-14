import React, { ReactElement, ReactNode, useContext, useState } from "react";
import { LinkItUrl } from "react-linkify-it";
import PropTypes from "prop-types";
import {
    Card,
    CardContent,
    Chip,
    Dialog,
} from "@mui/material";
import { ld_to_str, graph_to_ul } from "../query/display_pad";
import { labelize } from "../query/labels";
import { SourcesContext } from "../context";

function urlize(thing: ReactNode): ReactElement {
    return <LinkItUrl>{thing}</LinkItUrl>;
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

const SrcViewPop = ({ id }: { id?: string }) => {
    const [open, setOpen] = useState(false);
    const sources = useContext(SourcesContext);
    const source = sources.find((s) => s["@id"] == id) || {"@id": id};
    const creator = ld_to_str(source["dcterms:creator"]);
    const name = labelize(creator, "undefined")
    const content = source ? graph_to_ul([source]) : id;
    return (
        <>
            <Chip
                size="small"
                label={name}
                onClick={() => setOpen(!open)}
            ></Chip>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <Card>
                    <CardContent>{content}</CardContent>
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
