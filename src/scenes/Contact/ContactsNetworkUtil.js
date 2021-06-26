const getNodesFromContacts = contacts => {
    return contacts.map(contact => {
        return {
            id: contact.instagram_username,
            group: 1
        }
    })
}

const getLinksFromContacts = contacts => {
    let links = [];
    let allUsernames = contacts.map(contact => contact.instagram_username);

    contacts.forEach(contact => {
        let following = contact.instagram_following;
        for (const following_username of following) {
            if (allUsernames.includes(following_username)) {
                let newLink = {
                    source: contact.instagram_username,
                    target: following_username,
                    value: 2
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
