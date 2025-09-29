import React from 'react';
import { Row, Col } from 'antd';
import { Hit } from 'react-instantsearch-core';

interface HitWrapperProps<THit> {
  hit: THit;
  component: React.ComponentType<{ hit: THit }>;
}

function HitWrapper<THit>({ hit, component: Component }: HitWrapperProps<THit>) {
  return <Component hit={hit} />;
}

interface HitsGridProps<THit> {
  hits: THit[];
  hitComponent: React.ComponentType<{ hit: THit }>;
}

export function HitsGrid<THit extends Hit>({ hits, hitComponent }: HitsGridProps<THit>) {
  return (
    <Row gutter={[12, 12]}>
      {hits.map(hit => (
        <Col xs={24} sm={24} md={8} key={hit.objectID} className="d-flex">
          <HitWrapper hit={hit} component={hitComponent} />
        </Col>
      ))}
    </Row>
  );
} 