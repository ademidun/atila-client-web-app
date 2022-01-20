import { Input } from 'antd';
import React, { useState } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';

function SearchBox ({ refine, delay, currentRefinement, className }: { refine: any, delay: any, currentRefinement: any, className: any }) {
    let timerId: any = null;
  
    const [value, setValue] = useState(currentRefinement);
  
    const onChangeDebounced = (event: any) => {
      const inputValue = event.currentTarget.value
  
      setValue(inputValue)
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        refine(inputValue)
      }, delay);
    }
  
    return (
        <Input
          value={value}
          className={className}
          onChange={onChangeDebounced}
          placeholder="Search..."
        />
      )
}

export const DebouncedSearchBox = connectSearchBox(SearchBox)