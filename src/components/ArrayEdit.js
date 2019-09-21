import React from 'react';
import PropTypes from 'prop-types';
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {emojiDictionary} from "../models/Constants";

class ArrayEdit extends React.Component{

    constructor(props) {
        super(props);
        const { itemsList } = this.props;

        this.state = {
            itemsList
        }

    }

    removeItem = (event, index) => {

        const {itemsList} = this.state;
        const { onUpdateItemsList,keyName } = this.props;
        itemsList.splice(index, 1);
        this.setState({itemsList});

        if (onUpdateItemsList) {
            event.target.name = keyName;
            event.target.value = itemsList;
            onUpdateItemsList(event);
        }
    };

    render() {

        const { itemsList } = this.state;

        const displayItemsList = itemsList.map((item, index) => (
            <div className="chip" key={item}>
                {emojiDictionary[item.toLowerCase()] && emojiDictionary[item.toLowerCase()]}
                {item}
                <FontAwesomeIcon className="cursor-pointer ml-1" icon={faTimes}
                                 onClick={(event) => this.removeItem(event, index)}/>
            </div>
        ));

        return (
            displayItemsList
        );
    }
}
ArrayEdit.defaultProps = {
    onUpdateItemsList: null,
    keyName: null,
};

ArrayEdit.propTypes = {
    itemsList: PropTypes.array.isRequired,
    onUpdateItemsList: PropTypes.func,
    keyName: PropTypes.string,
};
export default ArrayEdit;