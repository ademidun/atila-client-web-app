import React from 'react';
import PropTypes from 'prop-types';
import {FILTER_TYPES, SORT_TYPES} from "../../models/ConstantsForm";
import {prettifyKeys, transformFilterDisplay} from "../../services/utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

class ScholarshipsListFilter extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            filterValue: 'Select Filter',
            sortValue: 'relevance_new'
        }
    }

    updateFilterOrSortBy = (event) => {
        event.preventDefault();

        const { updateFilterOrSortBy } = this.props;
        if (event.target.name==='filter_by_user') {
            this.setState({filterValue: event.target.value});
        }
        else if (event.target.name==='sort_by') {
            this.setState({sortValue: event.target.value});
        }
        updateFilterOrSortBy(event);
    };

    clearFilterBy = (event) => {
        event.preventDefault();

        const { updateFilterOrSortBy } = this.props;
        this.setState({filterValue: 'Select Filter'});

        event.target = {
            name: 'clear_filter',
            vale: null,
        };
        updateFilterOrSortBy(event);
    };

    render() {
        const { model } = this.props;
        const { filterValue, sortValue } = this.state;

        return (
            <div className="row">
                <div className="col-sm-6">
                    <label htmlFor="filter_by_user" className="float-left">
                        Filter by:
                    </label>
                    {filterValue !== 'Select Filter' &&
                    <div className="chip">
                        Clear Filter
                        <FontAwesomeIcon className="cursor-pointer ml-1" icon={faTimes}
                                         onClick={this.clearFilterBy}/>
                    </div>
                    }
                    <select
                        className="form-control"
                        name="filter_by_user"
                        value={filterValue || 'Select Filter'}
                        onChange={this.updateFilterOrSortBy}
                    >
                        <option key={'Select Filter'} disabled hidden>{'Select Filter'}</option>
                        {FILTER_TYPES.map(filter_type => (
                            <option key={filter_type} value={filter_type}>
                            {prettifyKeys(filter_type)}
                            </option>
                        ))}
                    </select>
                    {filterValue !== 'Select Filter' &&
                    <div className="font-weight-bold">
                        {/*Change here*/}
                        {transformFilterDisplay(filterValue, model)}
                    </div>
                    }
                </div>
                <div className="col-sm-6 col-md-3">
                    <label htmlFor="sort_by" className="float-left">
                        Sort by:
                    </label>
                    <select
                        className="form-control"
                        name="sort_by"
                        value={sortValue}
                        onChange={this.updateFilterOrSortBy}
                    >
                        {SORT_TYPES.map(sort_type => (
                            <option key={sort_type} value={sort_type}>
                                {prettifyKeys(sort_type)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }
}

ScholarshipsListFilter.defaultProps = {
    model: {},
    updateFilterOrSortBy: () => {},
};

ScholarshipsListFilter.propTypes = {
    model: PropTypes.shape({}),
    updateFilterOrSortBy: PropTypes.func
};

export default ScholarshipsListFilter;