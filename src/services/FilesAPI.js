import firebase from 'firebase/app';
import 'firebase/storage';
import {firebaseConfig} from "../firebase.config";
import {getRandomString} from "./utils";
firebase.initializeApp(firebaseConfig);

export class FilesAPI {

    static FIREBASE_STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

    static uploadFile = (fileData, filePath="files") => {

        // In case filePath is set to null or an empty string
        if (!filePath) {
            filePath = "files";
        }
        const { file, type } = fileData;
        const storage = firebase.storage();
        const storageRef = storage.ref();
        // Add a random suffix to each file to prevent files with the same name from overriding each other
        // Notes that not all file types contain a file object, an example is the audio file type.
        let fileKey = file ? `${getRandomString(8)}-${file.name}` : `${getRandomString(8)}`;

        if (type) {
            // Split the MIME type string at the first slash
            let mimeTypeParts = type.split('/');
            let subtype = '';

            // Check if there is a subtype or parameter
            if (mimeTypeParts.length > 1) {
                subtype = mimeTypeParts[1].split(';')[0];
            }

            // Add the subtype to the file key if it exists
            if (subtype) {
                fileKey += `.${subtype}`;
            }

            // Add the file extension to the file key if it is missing
            if (!fileKey.endsWith(`.${subtype}`)) {
                fileKey += `.${type.split('/')[1]}`;
            }
        }

        const uploadRef = storageRef.child(`user-uploads/${filePath}/${fileKey}`);
        let uploadTask;
        if (file) {
            uploadTask = uploadRef.put(file);
        } else {
            uploadTask = uploadRef.put(fileData);
        }

        return {
            uploadTask,
            uploadRef,
        }
    };


}