import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const MentorPrices = ({ initialPrices, onPricesChange, viewOnly = false }: { initialPrices: any, onPricesChange?: any, viewOnly?: boolean }) => {
  const [prices, setPrices] = useState(initialPrices);

  useEffect(() => {
    if (onPricesChange) {
      onPricesChange(prices);
    }
  }, [prices, onPricesChange]);

  const handleAddPrice = () => {
    setPrices([...prices, { price: '', minutes: 0, schedule_url: '' }]);
  };

  const handleRemovePrice = (index: any) => {
    const newPrices = [...prices];
    newPrices.splice(index, 1);
    setPrices(newPrices);
  };

  const handleEditPrice = (index: any, field: any, value: any) => {
    const newPrices = [...prices];
    newPrices[index][field] = value;
    setPrices(newPrices);
  };

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Price</th>
            <th>Minutes</th>
            <th>Schedule URL</th>
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
              <td>
                {viewOnly ? (
                  <span>{price.schedule_url}</span>
                ) : (
                  <input
                    type="text"
                    value={price.schedule_url}
                    style={{ width: '300px' }} // Adjusted width for longer input
                    onChange={(e) => handleEditPrice(index, 'schedule_url', e.target.value)}
                  />
                )}
              </td>
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
        <Button variant="success" onClick={handleAddPrice}>Add Price</Button>
      )}
    </div>
  );
};

export default MentorPrices;
