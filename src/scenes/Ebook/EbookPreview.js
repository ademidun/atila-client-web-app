import React, { Component } from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import {Button} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCaretLeft,
    faCaretRight
} from "@fortawesome/free-solid-svg-icons";
// list of pages
const pages = [
    {
        url: 'https://i.imgur.com/kkV3Cra.png',
    },
    {
        url: 'https://i.imgur.com/pLaJDbn.png',
    },
    {
        url: 'https://i.imgur.com/tubBv4w.png',
    },
    {
        url: 'https://i.imgur.com/po09bdf.png',
    },
    {
        url: 'https://i.imgur.com/VKwEAYC.png',
    },
    {
        url: 'https://i.imgur.com/EeHtEBd.png',
    },
    {
        url: 'https://i.imgur.com/9EdP2Jt.png',
    },
    {
        url: 'https://i.imgur.com/qCYu9rL.png',
    },
    {
        url: 'https://i.imgur.com/z1WJibU.png',
    },
    {
        url: 'https://i.imgur.com/nrFwWei.png',
    },
    {
        url: 'https://i.imgur.com/X4l5XGn.png',
    },
    {
        url: 'https://i.imgur.com/yLrt8Y4.png',
    },
    {
        url: 'https://i.imgur.com/CxMZCwk.png',
    },
    {
        url: 'https://i.imgur.com/pLaJDbn.png',
    },
];

// One item component
// selected prop will be passed
const MenuItem = ({data, selected}) => {
    return <div
        className={`menu-item ${selected ? 'active' : ''} text-center card shadow`}
    >
        <img
            className="responsive-images center-block"
            src={data.url} alt={`Page ${data.title}`} />
    </div>;
};

// All items component
// Important! add unique key
export const Menu = (list, selected) =>
    list.map((el, index) => {
        const {url} = el;

        return <MenuItem data={el}
                         key={`${url}-${index}`}
                         selected={selected} />;
    });


const Arrow = ({ text, className }) => {
    return (
        <Button
            className={`${className}`}
        >{text}</Button>
    );
};


const ArrowLeft = Arrow({ text: <FontAwesomeIcon icon={faCaretLeft} />, className: 'arrow-prev' });
const ArrowRight = Arrow({ text: <FontAwesomeIcon icon={faCaretRight} />, className: 'arrow-next' });

const selected = pages[0].url;

class EbookPreview extends Component {
    constructor(props) {
        super(props);
        // call it again if items count changes
        this.menuItems = Menu(pages, selected);
    }

    state = {
        selected
    };

    onSelect = key => {
        this.setState({ selected: key });
    };

    render() {
        const { selected } = this.state;
        // Create menu from items
        const menu = this.menuItems;

        return (
            <div className="EbookPreview" id="EbookPreview">
                {/*lineHeight: '7.5vw' so title is not truncated when offset*/}
                <h1 className="text-center mt-3"
                    style={{lineHeight: '11vw'}}>
                    See Inside the Book
                </h1>
                <ScrollMenu
                    data={menu}
                    arrowLeft={ArrowLeft}
                    arrowRight={ArrowRight}
                    selected={selected}
                    onSelect={this.onSelect}
                    wheel={false}
                />
            </div>
        );
    }
}

export default EbookPreview