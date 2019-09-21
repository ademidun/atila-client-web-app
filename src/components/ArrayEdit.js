import React from 'react';
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

    removeItem = (index) => {
        const {itemsList} = this.state;
        itemsList.splice(index, 1);
        this.setState({itemsList});
    };

    render() {

        const { itemsList } = this.state;

        const displayItemsList = itemsList.map((item, index) => (
            <div className="chip" key={item}>
                {emojiDictionary[item.toLowerCase()] && emojiDictionary[item.toLowerCase()]}
                {item}
                <FontAwesomeIcon className="cursor-pointer ml-1" icon={faTimes}
                                 onClick={() => this.removeItem(index)}/>
            </div>
        ));

        return (
            displayItemsList
        );
    }
}

export default ArrayEdit;