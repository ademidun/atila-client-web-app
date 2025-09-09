import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import Loading from './Loading';
import BlogsApi from '../services/BlogsAPI';
import EssaysApi from '../services/EssaysAPI';

function RelatedItems({ className, id, itemType }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedItems, setRelatedItems] = useState([]);

    const ContentAPI = itemType === 'Essay' ? EssaysApi : BlogsApi;

    const loadRelatedItems = useCallback(async () => {
        try {
            const response = await ContentAPI.relatedItems(id);
            setRelatedItems(response.data.results);
        } catch (error) {
            console.error('Error loading related items:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [ContentAPI, id]);

    useEffect(() => {
        loadRelatedItems();
    }, [loadRelatedItems]);

    if (loading) {
        return <Loading title="Loading related items..." />;
    }

    if (error) {
        return null;
    }

    if (!relatedItems.length) {
        return null;
    }

    return (
        <div className={className}>
            <h3>Related {itemType}s</h3>
            {relatedItems.map(item => (
                <Card
                    key={item.id}
                    className="mb-3"
                    cover={item.header_image_url && (
                        <img
                            alt={item.title}
                            src={item.header_image_url}
                            style={{ height: 200, objectFit: 'cover' }}
                        />
                    )}
                >
                    <Card.Meta
                        title={
                            <Link to={`/${itemType.toLowerCase()}/${item.slug}`}>
                                {item.title}
                            </Link>
                        }
                        description={item.description}
                    />
                </Card>
            ))}
        </div>
    );
}

RelatedItems.propTypes = {
    className: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    itemType: PropTypes.oneOf(['Blog', 'Essay']).isRequired
};

export default RelatedItems;

