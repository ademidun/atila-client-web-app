import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col} from "antd";
import ContentCard from "../../components/ContentCard";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";
import {genericItemTransform} from "../../services/utils";

class ScholarshipFinalists extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scholarshipFinalists: [],
            isLoadingScholarshipFinalists: false,
            errorLoadingScholarshipFinalists: false,
        }
    }
    componentDidMount() {

        const { id } = this.props;
        this.setState({ isLoadingScholarshipFinalists: true });

        const scholarshipFinalistsPromise = ScholarshipsAPI
            .getFinalists(`${id}`);
        scholarshipFinalistsPromise
            .then(res => {
                let scholarshipFinalists = [];
                if (res.data.applications) {
                    scholarshipFinalists = res.data.applications;
                }
                this.setState({ scholarshipFinalists });
            });

        scholarshipFinalistsPromise
            .catch(err => {
                console.log({ err});
            })
            .finally(() => {
                this.setState({ isLoadingScholarshipFinalists: false });
            });
    }

    render () {

        const { scholarshipFinalists, isLoadingScholarshipFinalists  } = this.state;
        const { className, title  } = this.props;

        if (isLoadingScholarshipFinalists) {
            return (
                <div className={`${className}`}>
                    <Loading
                        isLoading={isLoadingScholarshipFinalists}
                        title={'Loading Scholarship Finalists..'} />
                </div>);
        }

        return (
            <div className={`${className}`}>
                <h3 className="text-center">{title}</h3>
                <Row gutter={[{ xs: 8, sm: 16}, 16]}>
                    {scholarshipFinalists.map(item => {
                        // set this so getItemType() in genericItemTransform() returns an essay
                        item.essay_source_url="";
                        return (
                            // Use zoom:0.8 as a temporary workaround so that that ScholarshipFinalists doesn't
                            // take up too much space.
                            <Col xs={24} md={12} lg={8} style={{zoom:0.9}}>
                                <ContentCard key={item.slug}
                                             content={genericItemTransform(item)}
                                             customStyle={{"min-height": "800px"}}
                                             className="mb-3" />
                            </Col>)
                    })}

                </Row>
            </div>
        );
    }
}

ScholarshipFinalists.defaultProps = {
    className: '',
    title: 'Related',
};

ScholarshipFinalists.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    itemType: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
};

export default ScholarshipFinalists;

