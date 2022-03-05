import { Button, Input, List, Spin } from 'antd'
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Scholarship } from '../models/Scholarship.class';
import SearchApi from '../services/SearchAPI';

export interface ImportContentProps {
    contentType: "scholarships", // in the future, add support for other contentTypes. E.g. "scholarships" | "blogs"
    defaultSearchTerm?: string,
    onSelectContent: (content: Scholarship) => void,
}
function ImportContent(props: ImportContentProps) {

  const { contentType, defaultSearchTerm, onSelectContent } = props;


  const [searchResults, setSearchResults] = useState<Scholarship[]>([]);
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm||"");
  const [loading, setLoading] = useState("");
  const [receivedResponse, setReceivedResponse] = useState(false);
  const [showResults, setShowResults] = useState(true)

  const searchContent = () => {

    setLoading(`Searching for ${contentType}`);
    setReceivedResponse(false);
    if (contentType === "scholarships") {
        SearchApi.search(searchTerm, true)
        .then(res => {
            setSearchResults(res.data[contentType]);
        })
        .catch(err=> {
            console.log({err});
        })
        .finally( () => {
            setLoading("");
            setReceivedResponse(true);
        }
        )
    }

  }
  
  return (
    <div>
            <Input placeholder={`Search existing ${contentType} to import`} value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} onPressEnter={searchContent} />

            {receivedResponse && <Button type="link" key="import" onClick={() => setShowResults(!showResults)}>
                {showResults ? 'Hide Results': 'Show Results'}
            </Button>}
            <Spin spinning={!!loading} tip={loading}>
            <List
                className="demo-loadmore-list"
                style={{display: receivedResponse && showResults ? 'block': 'none'}}
                loading={!!loading}
                itemLayout="horizontal"
                dataSource={searchResults}
                renderItem={item => (
                <List.Item
                    actions={[
                    <Button type="link" key="import" onClick={() => onSelectContent(item)}>Import</Button>,
                    <Link key="view" to={`/scholarship/${item.slug}`} target="_blank" rel="noopener noreferrer">View</Link>
                ]}
                >
                    <List.Item.Meta
                        avatar={<img width="50" src={item.img_url} alt={item.name} />}
                        title={item.name}
                        description={`Date Created: ${(new Date(item.date_created).toDateString())}`}
                    />
                        
                    {item.description}
                </List.Item>
                )}
            />
        </Spin>
        
    </div>
  )
}

export default ImportContent