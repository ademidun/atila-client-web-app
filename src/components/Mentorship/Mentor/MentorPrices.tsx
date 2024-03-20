import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const MentorPrices = ({ initialPrices, onPricesSaved, viewOnly = false }: { initialPrices: any, onPricesSaved?: any, viewOnly?: boolean }) => {
  const [prices, setPrices] = useState(initialPrices);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    if (unsavedChanges && onPricesSaved) {
      onPricesSaved(prices);
      setUnsavedChanges(false);
    }
  }, [prices, onPricesSaved, unsavedChanges]);

  const handleAddPrice = () => {
    setPrices([...prices, { price: '', minutes: 0, schedule_url: '' }]);
    setUnsavedChanges(true);
  };

  const handleRemovePrice = (index: any) => {
    const newPrices = [...prices];
    newPrices.splice(index, 1);
    setPrices(newPrices);
    setUnsavedChanges(true);
  };

  const handleEditPrice = (index: any, field: any, value: any) => {
    const newPrices = [...prices];
    newPrices[index][field] = value;
    setPrices(newPrices);
    setUnsavedChanges(true);
  };


  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Price</th>
            <th>Minutes</th>
            {!viewOnly && <th>Schedule URL</th>}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((price: any, index: any) => (
            <tr key={index}>
              <td>
                {viewOnly ? (
                  <span>{price.price}</span>
                ) : (
                  <input
                    type="text"
                    value={price.price}
                    style={{ width: '80px' }} // Adjusted width for shorter input
                    onChange={(e) => handleEditPrice(index, 'price', e.target.value)}
                  />
                )}
              </td>
              <td>
                {viewOnly ? (
                  <span>{price.minutes}</span>
                ) : (
                  <input
                    type="number"
                    value={price.minutes}
                    style={{ width: '60px' }} // Adjusted width for shorter input
                    onChange={(e) => handleEditPrice(index, 'minutes', parseInt(e.target.value))}
                  />
                )}
              </td>
              {!viewOnly && (
                <td>
                  <input
                    type="text"
                    value={price.schedule_url}
                    style={{ width: '300px' }} // Adjusted width for longer input
                    onChange={(e) => handleEditPrice(index, 'schedule_url', e.target.value)}
                  />
                </td>
              )}
              <td>
                {!viewOnly && (
                  <Button variant="danger" onClick={() => handleRemovePrice(index)}>Remove</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!viewOnly && (
        <div>
          <Button variant="success" onClick={handleAddPrice}>Add Price</Button>
        </div>
      )}
    </div>
  );
};

export default MentorPrices;
