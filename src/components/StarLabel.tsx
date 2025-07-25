import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { STAR_TYPE_LABELS, Star } from '../utils/types';

interface Props {
  stars: Star[];
  yearGan: string; // ⬅ 新增傳入年干
}

const StarLabels: React.FC<Props> = ({ stars, yearGan }) => {
  return (
    <>
      {stars && stars.length > 0 && (
        <div className="stars">
          {stars.map((s, i) => (
            <OverlayTrigger
              key={i}
              placement="top"
              overlay={
                <Tooltip>
                  {`${s.name}（${STAR_TYPE_LABELS[s.type]}）`}
                  {s.transform ? ` - 化${s.transform}（年干：${yearGan}）` : ''}
                </Tooltip>
              }
            >
              <div
                key={i}
                className={`star-label star-${s.type} ${
                  s.transform ? `transform transform-${s.transform}` : ''
                }`}
              >
                {s.name}
                {s.transform
                  ? ` ${STAR_TYPE_LABELS[s.type]}／化${s.transform}`
                  : ` ${STAR_TYPE_LABELS[s.type]}`}
              </div>
            </OverlayTrigger>
          ))}
        </div>
      )}
    </>
  );
};

export default StarLabels;
