import React, { useCallback, useEffect, useState } from "react";
import { BlockMapType, NotionRenderer } from "react-notion";
import Loading from "../Loading";
import NotionService from "../../services/NotionService";
import { createTableOfContents, openAllLinksInNewTab } from "../../services/utils";

export interface NotionPageProps {
    pageId?: string;
    pageData?: BlockMapType;
    showTableOfContents: boolean;
    className: string;
}
NotionPage.defaultProps = {
  showTableOfContents: true,
  className: "",
}

const notionPageContentClassName = "NotionPage-content";
function NotionPage(props: NotionPageProps) {
  
  const { className } = props;
  const [loading, setLoading] = useState<string|undefined>(undefined);
  const [pageData, setPageData] = useState<BlockMapType|undefined>(props.pageData);

  const loadPageData = useCallback(
    () => {
        setLoading("Loading page information");
        NotionService.getPageId(props.pageId)
        .then(res => {
            setPageData(res.data);
            if (props.showTableOfContents) {
              createTableOfContents(`.${notionPageContentClassName}`);
            }
            openAllLinksInNewTab(`.${notionPageContentClassName}`);
            
        })
        .catch( err => {
            console.log({err});
        })
        .then(()=> {
            setLoading(undefined);
        })
    },
    [props.pageId, props.showTableOfContents]
  );

  useEffect(() => {
    if (props.pageId) {
        loadPageData();
    }
  }, [loadPageData, props.pageId])
  
  
  return (
    
    <div className={`NotionPage ${className}`}>
        <div className={`${notionPageContentClassName}`}>
            <Loading isLoading={!!loading} title={loading} />
            {pageData && <NotionRenderer blockMap={pageData} />}
        </div>
    </div>
  )
}

export default NotionPage