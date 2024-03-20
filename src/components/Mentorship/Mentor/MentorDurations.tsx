import React, { useState, useEffect } from 'react';
import { Button, Tag } from 'antd';

const MentorDurations = ({ initialDurations, onDurationsSaved, onDurationSelected, viewOnly = false }: { initialDurations: any, onDurationsSaved?: any, onDurationSelected?: any, viewOnly?: boolean }) => {
  const [durations, setDurations] = useState(initialDurations);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    if (unsavedChanges && onDurationsSaved) {
      onDurationsSaved(durations);
      setUnsavedChanges(false);
    }
  }, [durations, onDurationsSaved, unsavedChanges]);

  const handleAddDuration = () => {
    setDurations([...durations, { price: '', minutes: 0, schedule_url: '' }]);
    setUnsavedChanges(true);
  };

  const handleRemoveDuration = (index: any) => {
    const newDurations = [...durations];
    newDurations.splice(index, 1);
    setDurations(newDurations);
    setUnsavedChanges(true);
  };

  const handleEditDuration = (index: any, field: any, value: any) => {
    const newDurations = [...durations];
    newDurations[index][field] = value;
    setDurations(newDurations);
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
          {durations.map((duration: any, index: any) => (
            <tr key={index}>
              <td>
                {viewOnly ? (
                  <span>{duration.price ? duration.price : <Tag color="green">free</Tag> }</span>
                ) : (
                  <input
                    type="text"
                    value={duration.price}
                    style={{ width: '80px' }} // Adjusted width for shorter input
                    onChange={(e) => handleEditDuration(index, 'price', e.target.value)}
                  />
                )}
              </td>
              <td>
                {viewOnly ? (
                  <span>{duration.minutes}</span>
                ) : (
                  <input
                    type="number"
                    value={duration.minutes}
                    style={{ width: '60px' }} // Adjusted width for shorter input
                    onChange={(e) => handleEditDuration(index, 'minutes', parseInt(e.target.value))}
                  />
                )}
              </td>
              {!viewOnly && (
                <td>
                  <input
                    type="text"
                    value={duration.schedule_url}
                    style={{ width: '300px' }} // Adjusted width for longer input
                    onChange={(e) => handleEditDuration(index, 'schedule_url', e.target.value)}
                  />
                </td>
              )}
              <td>
                {viewOnly ? (
                  <Button type='primary' onClick={() => onDurationSelected && onDurationSelected(duration)}>Select Session</Button>
                ) : (
                  <Button danger onClick={() => handleRemoveDuration(index)}>Remove</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!viewOnly && (
        <div>
          <Button type='primary' onClick={handleAddDuration}>Add Price</Button>
        </div>
      )}
    </div>
  );
};

export default MentorDurations;
