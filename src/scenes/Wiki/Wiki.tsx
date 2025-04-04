import React from 'react';
import { useParams } from 'react-router-dom';
import HelmetSeo, { defaultSeoContent } from '../../components/HelmetSeo';
import NotionPage from '../../components/Notion/NotionPage';
import { prettifyKeys } from '../../services/utils';

function Wiki() {
  const { pageId } = useParams();

  const pageSlugToPageID: { [key: string]: any } = {
    careers: '034847710b9e418db750da8c2cee076d',
  };

  const seoContent = {
    ...defaultSeoContent,
    title: `Wiki - ${prettifyKeys(pageId)}`,
  };

  return (
    <div className="Wiki card container shadow p-5 mt-5">
      {pageSlugToPageID[pageId] && (
        <>
          <HelmetSeo content={seoContent} />
          <h1>{prettifyKeys(pageId)}</h1>
        </>
      )}
      <NotionPage pageId={pageSlugToPageID[pageId] || pageId} />
    </div>
  );
}

export default Wiki;