import React from 'react';
import ContentAddEdit from "../../components/ContentAddEdit/ContentAddEdit";

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
                <ContentAddEdit contentType="Essay" />
            </div>
        );
    }
}

export default EssayAddEdit;
