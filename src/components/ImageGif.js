import React from 'react';
import PropTypes from 'prop-types';

export class ImageGif extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: props.imageUrl,
            gifUrl: props.gifUrl,
            activeImage: props.defaultImageType === "gif" ? props.gifUrl : props.imageUrl,
            title: props.title
        }
    }

    handleClick = () => {
        if(this.state.imageUrl && this.state.gifUrl) {
            let nextActiveImage = this.state.activeImage === this.state.imageUrl ? this.state.gifUrl : this.state.imageUrl;
            this.setState({activeImage: nextActiveImage});
        }

    }
    render() {
        const { activeImage, title } = this.state;
        return (
            <div style={{border: "none"}} className="cursor-pointer" onClick={this.handleClick}>
                <img src={activeImage} width="100%" alt={title}/>
            </div>
        )
    }
}
ImageGif.defaultProps = {
    defaultImageType: "image"
};

ImageGif.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    gifUrl: PropTypes.string.isRequired,
    title: PropTypes.string,
    defaultImageType: PropTypes.oneOf(["image", "gif"]).isRequired,
};