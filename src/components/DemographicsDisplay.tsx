import { Tag } from 'antd';
import React from 'react'
import { emojiDictionary } from '../models/Constants';
import { ALL_DEMOGRAPHICS } from '../models/ConstantsForm';
import { Mentor } from '../models/Mentor'
import { prettifyKeys } from '../services/utils';


interface DemographicsDisplayProps {
    model: Mentor
}

function DemographicsDisplay(props: DemographicsDisplayProps) {

    const { model } = props;

  return (
    <div>
        {Object.keys(ALL_DEMOGRAPHICS)
                .filter((criteria)=>model[criteria] && (model[criteria] as Array<string>).length>0)
                .map(criteria => (
                <React.Fragment key={criteria}>
                    <p> <strong>{prettifyKeys(criteria)}: {' '}</strong>

                        {(model[criteria] as Array<string>).map(value => (
                                <Tag>
                                {value}
                                {(emojiDictionary as any)[value.toLowerCase()]}
                                </Tag>
                            ))}
                    </p>
                </React.Fragment>
            ))}
    </div>
  )
}

export default DemographicsDisplay;