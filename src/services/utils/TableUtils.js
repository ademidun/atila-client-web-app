import React, { Fragment } from 'react';
import { Tag } from 'antd';
import { FILTER_TYPES } from '../../models/ConstantsForm';
import ReactJson from 'react-json-view'

class TableUtils {
    /**
     * Given a list of objects e.g. contacts, userprofiles, or scholarships.
     * Configure the table columns for rendering the table view of that object.
     * @param {*} objects 
     * @returns 
     */

    static USER_PROFILE_COLUMNS = ["user", "first_name", "last_name", "email", "username", "metadata", "email_analytics"] + FILTER_TYPES;
    static getTableColumnsFromObjects = (items, itemType = "contact") => {

        let columns = [];

        if (items.length > 0) {

            columns = Object.keys(items[0]).filter(itemProperty => {
                if(itemType === "userprofile"){
                    return TableUtils.USER_PROFILE_COLUMNS.includes(itemProperty)
                } else {
                    return true
                }
            }).sort(function(a, b) {
                if(itemType === "userprofile") {
                    // sort array according to USER_PROFILE_COLUMNS
                    // https://stackoverflow.com/a/28377564
                    return TableUtils.USER_PROFILE_COLUMNS.indexOf(a) - TableUtils.USER_PROFILE_COLUMNS.indexOf(b);
                } else {
                    return a - b
                }
              }).map(itemProperty => {
                
                const columnSetting = {
                    title: itemProperty,
                    dataIndex: itemProperty,
                    key: itemProperty,
                    render: (itemPropertyValue, item) => TableUtils.columnRender(itemPropertyValue, item, itemProperty)
                };

                if (itemProperty === "metadata") {
                    columnSetting.sorter = (a, b) => a.metadata.hasOwnProperty("email_batches") ? -1 : b.metadata.hasOwnProperty("email_batches") ? 1 : 0
                }
                if (itemProperty === "email_analytics"){

                    columnSetting.sorter = (a, b) => {
                        console.log({a,b})
                        let clickDetailsA = a.email_analytics.click_details ||[]
                        let clickDetailsB = b.email_analytics.click_details ||[]

                        return  clickDetailsA.length < clickDetailsB.length ? -1 : clickDetailsA.length > clickDetailsB.length  ? 1 : 0
                    }
                    columnSetting.render = (email_analytics, item) => (
                        <ReactJson src={email_analytics} collapsed={1} name="email_analytics" />
                    )
                }

                if (itemProperty === "email"){
                    
                    columnSetting.render = (email, item) => {
                        let mailToUrl = email;
                        // Setting the name in mailto: url might be possible with: https://stackoverflow.com/a/16265466/5405197
                        if(item.first_name) {
                            mailToUrl = `mailto:"${item.first_name}${item.last_name? " " + item.last_name: ""}"<${mailToUrl}>`;
                        } else if (item.organization_name) {
                            mailToUrl = `mailto:"${item.organization_name}"<${mailToUrl}>`;
                        }
                        const mailtoAnchorTag = (<a href={mailToUrl}  target="_blank" rel="noopener noreferrer">
                        {email}
                        </a>)
                        return mailtoAnchorTag;
                    } 
                }
                if (itemProperty === "instagram_following"){
                    
                    columnSetting.render = (instagram_following, item) => (
                        instagram_following ? instagram_following.slice(0, 5) : ""
                    )
                    columnSetting.title = `${itemProperty} (first 5 elements)`
                }

                return columnSetting
            })
        }
        return columns;
    };

    static columnRender = (columnData, rowData, columnName) => {

        switch(columnName) {
            // TODO make a seperate email_batches column
            case "metadata":
                if (columnData.email_batches ) {
                    return (
                        <Fragment>
                            {columnData.email_batches.map(email_batch => <Tag color="blue">{email_batch}</Tag>)}
                        </Fragment>
                    )
                }
                break
            case "city":
            case "province":
            case "country":
                if (Array.isArray(columnData)) {
                    return (
                        <Fragment>
                            {columnData.map(location => location.name)}
                        </Fragment>
                    )
                }
                else {
                    return (<Fragment>
                    {columnData}
                </Fragment>)
                } 
            default:
                if(Array.isArray(columnData)) {
                    return <Fragment>
                    {columnData.join(', ')}
                </Fragment>
                } else {
                    return <Fragment>
                        {columnData}
                    </Fragment>
                }
        }
    }
}

export default TableUtils
