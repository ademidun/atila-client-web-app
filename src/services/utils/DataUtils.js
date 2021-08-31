import React from 'react';
import { FILTER_TYPES } from '../../models/ConstantsForm';

class DataUtils {
    /**
     * Given a list of objects e.g. contacts, userprofiles, or scholarships.
     * Configure the table columns for rendering the table view of that object.
     * @param {*} objects 
     * @returns 
     */

    static USER_PROFILE_COLUMNS = ["user", "first_name", "last_name", "email", "username"] + FILTER_TYPES;
    static getTableColumnsFromObjects = (items, itemType = "contact") => {

        let columns = [];

        if (items.length > 0) {

            columns = Object.keys(items[0]).filter(itemProperty => {
                if(itemType === "userprofile"){
                    return DataUtils.USER_PROFILE_COLUMNS.includes(itemProperty)
                } else {
                    return true
                }
            }).sort(function(a, b) {
                if(itemType === "userprofile") {
                    // sort array according to USER_PROFILE_COLUMNS
                    // https://stackoverflow.com/a/28377564
                    return DataUtils.USER_PROFILE_COLUMNS.indexOf(a) - DataUtils.USER_PROFILE_COLUMNS.indexOf(b);
                } else {
                    return a - b
                }
              }).map(itemProperty => {
                
                const columnSetting = {
                    title: itemProperty,
                    dataIndex: itemProperty,
                    key: itemProperty,
                };
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

        console.log({columns});

        return columns;
    };
}

export default DataUtils
