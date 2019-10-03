import React from 'react';
import PropTypes from 'prop-types';
import {FILTER_TYPES} from "../../models/ConstantsForm";
import {prettifyKeys, transformFilterDisplay} from "../../services/utils";

class ScholarshipsListFilter extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            filterValue: 'Select Filter'
        }
    }

    updateFilterBy = (event) => {
        event.preventDefault();

        const { updateFilterBy } = this.props;
        this.setState({filterValue: event.target.value});
        updateFilterBy(event);
    };

    render() {
        const { model } = this.props;
        const { filterValue } = this.state;

        return (
            <div className="row">
                <div className="col-sm-6 col-md-3">
                    <label htmlFor="filter_type" className="float-left">
                        Filter by:
                    </label>
                    <select
                        className="form-control"
                        name="filter_by_user"
                        value={filterValue || 'Select Filter'}
                        onChange={this.updateFilterBy}
                    >
                        <option key={'Select Filter'} disabled hidden>{'Select Filter'}</option>
                        {FILTER_TYPES.map(filter_type => (
                            <option key={filter_type} value={filter_type}>
                            {prettifyKeys(filter_type)}
                            </option>
                        ))}
                    </select>
                </div>
                {model[filterValue] &&
                <div className="col-sm-6 col-md-3 font-weight-bold">
                    {transformFilterDisplay(model, filterValue)}
                </div>
                }
            </div>
        );
    }
}

ScholarshipsListFilter.defaultProps = {
    model: {},
    updateFilterBy: () => {},
};

ScholarshipsListFilter.propTypes = {
    model: PropTypes.shape({}),
    updateFilterBy: PropTypes.func
};

export default ScholarshipsListFilter;