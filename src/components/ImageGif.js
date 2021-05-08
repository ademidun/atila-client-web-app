import React from 'react';

export class ImageGif extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: props.imageUrl,
            gifUrl: props.gifUrl,
            activeImage: props.imageUrl || props.gifUrl,
            title: props.title
        }
    }

    handleClick = () => {
        const currentActiveImage = this.state.activeImage;
        if(this.state.imageUrl) {
            if(this.state.gifUrl) {
                let nextActiveImage = currentActiveImage === this.state.imageUrl ? this.state.gifUrl : this.state.imageUrl;
                this.setState({activeImage: nextActiveImage})
            }
        }

    }
    render() {
        const { activeImage, title } = this.state;
        return (
            <a>
                <img src={activeImage} width="580px" onClick={this.handleClick} alt={title}/>
            </a>
        )
    }
}