import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import {Row, Col, Tag} from "antd";
import ContentCard from "../../components/ContentCard";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";
import {genericItemTransform} from "../../services/utils";

class ScholarshipFinalists extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scholarshipFinalistEssays: [],
            scholarshipFinalistUserProfiles: [],
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
                this.setState({
                        scholarshipFinalistEssays: res.data.finalist_essays,
                        scholarshipFinalistUserProfiles: res.data.finalist_user_profiles,
                });
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

        const { scholarshipFinalistEssays, scholarshipFinalistUserProfiles, isLoadingScholarshipFinalists  } = this.state;
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
                    {scholarshipFinalistUserProfiles.map(user => {
                        return (
                            // Use zoom:0.8 as a temporary workaround so that that ScholarshipFinalists doesn't
                            // take up too much space.
                            <Col xs={24} md={12} lg={8} style={{zoom:0.9}} key={user.username}>
                                <div className="bg-light mb-3 p-1 rounded-pill">
                                    <Link to={`/profile/${user.username}`} >
                                        <img
                                            alt="user profile"
                                            style={{ height: '50px', maxWidth: 'auto' }}
                                            className="rounded-circle py-1 pr-1"
                                            src={user.profile_pic_url} />
                                        {user.first_name} {user.last_name}
                                    </Link>
                                    {user.is_winner && <Tag color="green">Winner</Tag>}
                                </div>
                            </Col>)
                    })}

                </Row>
                <h3 className="text-center">{title}' Essays</h3>
                <Row gutter={[{ xs: 8, sm: 16}, 16]}>
                    {scholarshipFinalistEssays.map(item => {
                        // set this so getItemType() in genericItemTransform() returns an essay
                        item.essay_source_url="";
                        return (
                            // Use zoom:0.8 as a temporary workaround so that that ScholarshipFinalists doesn't
                            // take up too much space.
                            <Col xs={24} md={12} lg={8} style={{zoom:0.9}} key={item.slug}>
                                <ContentCard key={item.slug}
                                             content={genericItemTransform(item)}
                                             customStyle={{height: "850px"}}
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

