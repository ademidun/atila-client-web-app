import { Button, InputNumber, Radio } from 'antd';
import React from 'react'
import { Award } from '../../models/Award'
import { Scholarship } from '../../models/Scholarship.class'

interface AwardsAddEditProps {
    scholarship: Scholarship;
    awards: Award[];
    onCurrencyChange: (event: any) => {};
    onChangeAward: (newValue: any, index: number) => {};
    onRemoveAward: (index: number) => {};
    onAddAward: (event: any) => {};
  };

function AwardsAddEdit(props: AwardsAddEditProps) {

    const { scholarship, awards } = props;

    const currencyOptions = [
        { label: 'Canadian Dollar (CAD)', value: 'CAD' },
        { label: 'American Dollar (USD)', value: 'USD' },
        { label: 'Ethereum (ETH)', value: 'ETH' },
    ];
    let currencyPrefix = `${scholarship.currency || ""} $`;

    if (scholarship.currency === "ETH") {
        currencyPrefix = scholarship.currency + " "
    }

    return (
        <div>
                <h5>Total Funding Amount: {currencyPrefix}{scholarship.funding_amount}</h5>
                <br />
                <h5>Select Currency: </h5>
                <Radio.Group
                    options={currencyOptions}
                    onChange={props.onCurrencyChange}
                    value={scholarship.currency}
                    optionType="button"
                    buttonStyle="solid"
                    name="currency"
                    />
                <br />
                <br />
                {awards.map((award, index) => (
                    <div key={index}>
                        Award {index + 1}:{' '}
                        <InputNumber size={"large"}
                                    value={award.funding_amount as number}
                                    onChange={value => props.onChangeAward(value, index)}
                                    style={{width: "30%"}}
                                    formatter={value => `${scholarship.currency === "ETH" ? "": "$"} ${value}`}
                                    // @ts-ignore */}
                                    //  added @ts-ignore because ompiler is complaning that keyboard property does not exist
                                    // Property 'keyboard' does not exist on type 'IntrinsicAttributes & InputNumberProps & RefAttributes<unknown>'.ts(2322)
                                    keyboard={false} 
                                    // @ts-ignore */}
                                    stringMode={true}
                        />

                        {index > 0 &&
                            <Button danger
                                    onClick={()=>props.onRemoveAward(index)}
                                    style={{float: "right"}}>Remove</Button>
                        }
                        <br />
                        <br />
                    </div>
                ))}
                <Button type="primary" onClick={props.onAddAward} >Add Award</Button>
            </div>
    )
}

export default AwardsAddEdit
