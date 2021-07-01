const getNodesFromContacts = contacts => {
    return contacts.map(contact => {
        return {
            id: contact.instagram_username,
            group: 1,
            node_size: getNodeSize(!contact.instagram_followers_count || ! contact.instagram_following_count ? 0 : contact.instagram_followers_count - contact.instagram_following_count),
            data: contact,
        }
    })
}

const getLinksFromContacts = contacts => {
    let links = [];
    let allUsernames = contacts.map(contact => contact.instagram_username);

    contacts.forEach(contact => {
        let following = contact.instagram_following || [];
        for (const following_username of following) {
            if (allUsernames.includes(following_username)) {
                let newLink = {
                    source: contact.instagram_username,
                    target: following_username,
                    value: 4
                }
                links.push(newLink)
            }
        }
    })

    return links;
}

export const getFormattedDataFromContacts = contacts => {
    let nodes = getNodesFromContacts(contacts)
    let links = getLinksFromContacts(contacts)

    return {
        nodes,
        links,
    }
}

const normalizeNumberBetweenBounds = (num, actual_bounds, desired_bounds) => {
    /*
    This function normalizes num (which is expected to be between actual_bounds) and returns the num
    in the desired_bounds
     */

    if (!num) {
        return desired_bounds[0];
    }

    if (num >= actual_bounds[1]) {
        return desired_bounds[1]
    }

    if (num <= actual_bounds[0]) {
        return desired_bounds[0]
    }

    return Math.round(desired_bounds[0] + ((num - actual_bounds[0]) * (desired_bounds[1] - desired_bounds[0]) / (actual_bounds[1] - actual_bounds[0])))
}

const getNodeSize = net_followers => {
    let actual_bounds = [0, 2000]
    let desired_bounds = [20, 40]

    return normalizeNumberBetweenBounds(net_followers, actual_bounds, desired_bounds)
}
