export class Content {
    title: string = '';
    description: string = '';
    header_image_url: string = '';
    url: string = '';
    // The following properties are set in the server
    readonly id?: string;
    readonly objectID?: string;
    readonly date_created?: string = "";
    readonly date_modified?: string = "";
}
export class SavedContent {
    notes?: string = ''
    content: Content = new Content();
    userId?: string;
    date_created: string = "";
    date_modified: string = "";
}
