import React, { Component } from "react";
import ScrollMenu from "react-horizontal-scrolling-menu";

// list of pages
const pages = [
  {
    title: "Book Cover",
    url: "https://i.imgur.com/kkV3Cra.png",
  },
  {
    title: "Back Image",
    url: "https://i.imgur.com/pLaJDbn.png",
  },
  {
    title: "Methodology",
    url: "https://i.imgur.com/tubBv4w.png",
  },
  {
    title: "Methodology Continued",
    url: "https://i.imgur.com/po09bdf.png",
  },
  {
    title: "Student Profiles",
    url: "https://i.imgur.com/VKwEAYC.png",
  },
  {
    title: "Student Profiles (perspectives)",
    url: "https://i.imgur.com/qCYu9rL.png",
  },
  {
    title: "How Much do I Really Make?",
    url: "https://i.imgur.com/z1WJibU.png",
  },
  {
    title: "More Student Profiles",
    url: "https://i.imgur.com/nrFwWei.png",
  },
  {
    title: "Industry Analysis",
    url: "https://i.imgur.com/X4l5XGn.png",
  },
  {
    title: "Industry Analysis - Consulting",
    url: "https://i.imgur.com/yLrt8Y4.png",
  },
  {
    title: "Detailed Graphics",
    url: "https://i.imgur.com/CxMZCwk.png",
  },
  {
    title: "Student Profiles (Western)",
    url: "https://i.imgur.com/EeHtEBd.png",
  },
  {
    title: "Student Interviews",
    url: "https://i.imgur.com/9EdP2Jt.png",
  },
  {
    title: "And Much More!",
    url: "https://i.imgur.com/pLaJDbn.png",
  },
];

// One item component
// selected prop will be passed
const MenuItem = ({ data, selected, audience }) => {
  return (
    <div
      className={`menu-item ${
        selected ? "active" : ""
      } text-center card shadow`}
    >
      <h4 className='my-3'>{data.title}</h4>
      <img
        className='responsive-images center-block'
        src={
          data.title === "Book Cover" && audience === "2"
            ? "https://i.imgur.com/KdYNLId.png?1"
            : data.url
        }
        alt={`Page ${data.title}`}
      />
    </div>
  );
};

// All items component
// Important! add unique key
export const Menu = (list, selected, audience) =>
  list.map((el) => {
    const { title } = el;

    return (
      <MenuItem data={el} key={title} selected={selected} audience={audience} />
    );
  });

const Arrow = ({ text, className }) => {
  return <div className={className}>{text}</div>;
};

const ArrowLeft = Arrow({ text: "<", className: "arrow-prev" });
const ArrowRight = Arrow({ text: ">", className: "arrow-next" });

const selected = pages[0].title;

class EbookPreview extends Component {
  constructor(props) {
    super(props);
    // call it again if items count changes
    this.menuItems = Menu(pages, selected, this.props.audience);
  }

  state = {
    selected,
  };

  onSelect = (key) => {
    this.setState({ selected: key });
  };

  render() {
    console.log("audience from ebook preview " + this.props.audience);
    const { selected } = this.state;
    // Create menu from items
    const menu = this.menuItems;

    return (
      <div className='EbookPreview' id='EbookPreview'>
        {/*lineHeight: '7.5vw' so title is not truncated when offset*/}
        <h1 className='text-center mt-3' style={{ lineHeight: "11vw" }}>
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

export default EbookPreview;
