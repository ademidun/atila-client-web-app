import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const MentorPrices = ({ initialPrices, onPricesChange }: {initialPrices: any, onPricesChange?: any}) => {
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
                <input
                  type="text"
                  value={price.price}
                  onChange={(e) => handleEditPrice(index, 'price', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={price.minutes}
                  onChange={(e) => handleEditPrice(index, 'minutes', parseInt(e.target.value))}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={price.schedule_url}
                  onChange={(e) => handleEditPrice(index, 'schedule_url', e.target.value)}
                />
              </td>
              <td>
                <Button variant="danger" onClick={() => handleRemovePrice(index)}>Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button variant="success" onClick={handleAddPrice}>Add Price</Button>
    </div>
  );
};

export default MentorPrices;
