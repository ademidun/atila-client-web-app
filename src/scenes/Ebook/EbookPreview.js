import React, { Component } from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';

// list of items
const list = [
    {
        title: 'Book Cover',
        url: 'https://i.imgur.com/kkV3Cra.png',
    },
    {
        title: 'Back Image',
        url: 'https://i.imgur.com/pLaJDbn.png',
    },
    {
        title: 'Methodology',
        url: 'https://i.imgur.com/tubBv4w.png',
    },
    {
        title: 'Methodology Continued',
        url: 'https://i.imgur.com/po09bdf.png',
    },
    {
        title: 'Student Profiles',
        url: 'https://i.imgur.com/VKwEAYC.png',
    },
    {
        title: 'Student Profiles (perspectives)',
        url: 'https://i.imgur.com/qCYu9rL.png',
    },
    {
        title: 'How Much do I Really Make?',
        url: 'https://i.imgur.com/z1WJibU.png',
    },
    {
        title: 'More Student Profiles',
        url: 'https://i.imgur.com/nrFwWei.png',
    },
    {
        title: 'Industry Analysis',
        url: 'https://i.imgur.com/X4l5XGn.png',
    },
    {
        title: 'Detailed Graphics',
        url: 'https://i.imgur.com/CxMZCwk.png',
    },
    {
        title: 'Student Profiles (Western)',
        url: 'https://i.imgur.com/EeHtEBd.png',
    },
    {
        title: 'Student Interviews',
        url: 'https://i.imgur.com/9EdP2Jt.png',
    },
    {
        title: 'Back Image',
        url: 'https://i.imgur.com/pLaJDbn.png',
    },
];

// One item component
// selected prop will be passed
const MenuItem = ({data, selected}) => {
    return <div
        className={`menu-item ${selected ? 'active' : ''}`}
    >
        <div className='text-center card shadow'>
            <h4 className="my-3">{data.title}</h4>
            <img
                className="responsive-images"
                src={data.url} alt={`Page ${data.title}`} />
        </div>
    </div>;
};

// All items component
// Important! add unique key
export const Menu = (list, selected) =>
    list.map(el => {
        const {title} = el;

        return <MenuItem data={el} key={title} selected={selected} />;
    });


const Arrow = ({ text, className }) => {
    return (
        <div
            className={className}
        >{text}</div>
    );
};


const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });

const selected = 'item1';

class EbookPreview extends Component {
    constructor(props) {
        super(props);
        // call it again if items count changes
        this.menuItems = Menu(list, selected);
    }

    state = {
        selected
    };

    onSelect = key => {
        this.setState({ selected: key });
    }


    render() {
        const { selected } = this.state;
        // Create menu from items
        const menu = this.menuItems;

        return (
            <div className="EbookPreview">
                <ScrollMenu
                    data={menu}
                    arrowLeft={ArrowLeft}
                    arrowRight={ArrowRight}
                    selected={selected}
                    onSelect={this.onSelect}
                />
            </div>
        );
    }
}

export default EbookPreview