import React from "react";
import {faUserMd} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export function makeXHRRequestAsPromise (method, url, data) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        // url encode form data for sending as post data
        const encoded = Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
        }).join('&');
        xhr.send(encoded);
    });
}

export function genericItemTransform (item) {

    item.type = getItemType(item);

    switch(item.type) {
        case 'scholarship':
            item = {
                title: item.name,
                description: item.description,
                id: item.id,
                slug: `/scholarship/${item.slug}/`,
                image: item.img_url,
                type: item.type,
            };
            break;
        case 'essay':
            item = {
                title: item.title,
                description: item.description,
                id: item.id,
                slug: `/essay/${item.user.username}/${item.slug}/`,
                image: `${item.user.profile_pic_url}`,
                type: item.type,
                user: item.user,
            };
            break;
        case 'blog':
            item = {
                title: item.title,
                description: item.description,
                image: item.header_image_url,
                id: item.id,
                slug: `/blog/${item.user.username}/${item.slug}/`,
                type: item.type,
                user: item.user,
            };
            break;
        case 'forum':
            item = {
                title: item.starting_comment ? item.starting_comment.title || item.title : item.title,
                description: item.starting_comment ?  item.starting_comment.text || item.text: item.text,
                id: item.id,
                slug: `/forum/${item.slug}/`,
                type: item.type,
            };
            break;
        default:
        // code block
    }

    return item;

}


export function getItemType(item) {

    let itemType = '';
    if (item.hasOwnProperty('deadline')) {
        itemType = 'scholarship'
    }
    else if (item.hasOwnProperty('starting_comment')) {
        itemType = 'forum'
    }
    else if (item.hasOwnProperty('header_image_url')) {
        itemType = 'blog'
    }
    else if (item.hasOwnProperty('essay_source_url')) {
        itemType = 'essay'
    }
    return itemType;
}

// https://github.com/ademidun/atila-angular/blob/9cb6dbbe8e2c1f0f4d7812740c1a06c6d811e331/src/app/_shared/utils.ts#L11
export function toTitleCase(str) {
    var i, j, lowers, uppers;
    str = str.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    // Certain minor words should be left lowercase unless
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
        'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
    for (i = 0, j = lowers.length; i < j; i++) {
        str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
            function(txt) {
                return txt.toLowerCase();
            });
    }


    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ['Id', 'Tv'];
    for (i = 0, j = uppers.length; i < j; i++) {
        str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'),
            uppers[i].toUpperCase());
    }

    return str;
}

export function formatCurrency(input) {
    return input.toLocaleString('en-ca', {style : 'currency', currency: 'CAD'});
}

export function slugify(text) {
    return text
        .trim()
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .trim()
        .replace(/ +/g, '-')
        ;
}
export const initialReduxState = {
    data: {
        user: {
            loggedInUserProfile: null
        }
    },
    ui: {
        user: {
            isLoadingLoggedInUserProfile: false
        }}
};

export const emojiDictionary = {
    china: <span role="img" aria-label="china emoji">🇨🇳</span>,
    canada: <span role="img" aria-label="canada emoji">🇨🇦</span>,
    basketball: <span role="img" aria-label="basketball emoji">🏀</span>,
    biology: <span role="img" aria-label="biology emoji">🔬</span>,
    medicine: <FontAwesomeIcon icon={faUserMd} className="mr-1" />,
};