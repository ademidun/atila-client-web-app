import React from 'react';

class EssayAddEdit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            blog: null,
            errorGettingEssay: null,
            isLoadingEssay: false,
        }
    }

    render () {
        return (
            <div className="text-center container">
                <h1>Essay Add Edit</h1>
            </div>
        );
    }
}

export default EssayAddEdit;
