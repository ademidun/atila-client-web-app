import { Col, Row } from 'antd';
import React from 'react';
import { Blog } from '../models/Blog';
import { Content } from '../models/Content';
import { genericItemTransform } from '../services/utils';
import ContentCard from './ContentCard';

type Props = {
    contentList: Array<Blog|Content>,
}

function ContentListDisplay(props: Props) {

    let { contentList } = props;
    const contentListDisplay = contentList.map( content =>        <Col xs={24} md={12} lg={8} key={content.id}>
        <ContentCard
                     content={genericItemTransform(content)}
                     className=" mb-3"
                     
        />
    </Col>)

    return (<Row gutter={{ xs: 8, sm: 16, md: 24}}>
        {contentListDisplay}
    </Row>)

}

export default ContentListDisplay