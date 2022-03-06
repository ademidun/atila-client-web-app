import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router';
import HelmetSeo, { defaultSeoContent } from '../../components/HelmetSeo';
import NotionPage from '../../components/Notion/NotionPage';
import { toTitleCase } from '../../services/utils';


interface RouteParams {pageId: string};

function Wiki(props: RouteComponentProps<RouteParams>) {
    
  const { pageId } = props.match.params;

  const pageSlugToPageID: {[key: string]: any} = {
    careers: '034847710b9e418db750da8c2cee076d'
  }

  const seoContent = {
    ...defaultSeoContent,
    title: `Wiki - ${toTitleCase(pageId)}`,
  }

  return (
    <div className="Wiki card container shadow p-5 mt-5">
      {pageSlugToPageID[pageId] &&
      <>
        <HelmetSeo content={seoContent} />
        <h1>
            {toTitleCase(pageId)}
        </h1>
      </>
        
      }
        <NotionPage pageId={pageSlugToPageID[pageId] || pageId} />
    </div>
  )
}

export default withRouter(Wiki);