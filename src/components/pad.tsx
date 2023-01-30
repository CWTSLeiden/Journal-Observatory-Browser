import React, { ReactElement, ReactNode } from "react";
import { LinkItUrl } from "react-linkify-it";
import PropTypes from "prop-types";

function urlize(thing: ReactNode): ReactElement {
    return <LinkItUrl>{thing}</LinkItUrl>;
}

const SrcView = ({ sources }) => (
    <div className="src">
        <div className="src-short">{sources.length}</div>
        <div className="src-long">{urlize(sources.join(", "))}</div>
    </div>
);
SrcView.propTypes = { sources: PropTypes.arrayOf(PropTypes.string).isRequired };

const ValueView = ({ value, crumb, src }) => (
    <div key={crumb} className="value">
        {urlize(value)}
        {src}
    </div>
);
ValueView.propTypes = {
    value: PropTypes.string.isRequired,
    crumb: PropTypes.string,
    src: PropTypes.node,
};

const IdView = ({ id, crumb, src }) => (
    <div key={crumb} className="id">
        {urlize(id)}
        {src}
    </div>
);
IdView.propTypes = {
    id: PropTypes.string.isRequired,
    crumb: PropTypes.string,
    src: PropTypes.node,
};

const ListView = ({ value, crumb, src }) => (
    <li key={crumb}>
        {value}
        {src}
    </li>
);
ListView.propTypes = {
    value: PropTypes.any.isRequired,
    crumb: PropTypes.string,
    src: PropTypes.node,
};

const DefListView = ({ title, value, crumb, src }) => (
    <li key={crumb}>
        <dt>{title}</dt>
        <dd>{value}</dd>
        {src}
    </li>
);
DefListView.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    crumb: PropTypes.string,
    src: PropTypes.node,
};

export { SrcView, ValueView, IdView, DefListView, ListView };
