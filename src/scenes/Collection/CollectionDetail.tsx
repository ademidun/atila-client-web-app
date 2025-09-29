import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import ContentListDisplay from '../../components/ContentListDisplay';
import HelmetSeo from '../../components/HelmetSeo';
import Loading from '../../components/Loading';
import { Collection } from '../../models/Collection'
import CollectionsAPI from '../../services/CollectionsAPI';
import { genericItemTransform } from '../../services/utils';

interface CollectionDetailProps {
    // Add any additional props here if needed
}

function CollectionDetail(props: CollectionDetailProps) {
  const { slug } = useParams<{ slug: string }>();

  const [collection, setCollection] = useState(new Collection());
  const [loadingCollection, setLoadingCollection] = useState("");

  const loadCollection = useCallback(
    () => {
        if (!slug) return;
        
        const collectionId = slug.split("-").pop() || "";
        setLoadingCollection("Loading collection");

        CollectionsAPI.get(collectionId)
        .then(res => {
            console.log({res});
            setCollection(res.data);
        })
        .catch(err => {
            console.log({err});
        })
        .finally(() => {
            setLoadingCollection("")
        })
    },
    [slug]
  );

  useEffect(() => {
    loadCollection();
  }, [loadCollection]);
  
  return (
    <div className="container mt-3 card shadow p-3">
        {loadingCollection && <Loading title={loadingCollection} />}

        <HelmetSeo content={genericItemTransform(collection)} />
        <h1 className="text-center center-block mb-3">
            {collection.title}
        </h1>
        <ContentListDisplay contentList={collection.contents.map(collectionContent => collectionContent.content)} />

        <p>
            Make your own collection with <Link to="/atlas">Atlas</Link>
        </p>
    </div>
  )
}

export default CollectionDetail