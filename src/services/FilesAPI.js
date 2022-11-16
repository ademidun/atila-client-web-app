import firebase from 'firebase/app';
import 'firebase/storage';
import {firebaseConfig} from "../firebase.config";
import {getRandomString} from "./utils";
firebase.initializeApp(firebaseConfig);

export class FilesAPI {

    static FIREBASE_STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

    static uploadFile = (fileData, filePath="scholarship-images") => {

        // In case filePath is set to null or an empty string
        if (!filePath) {
            filePath = "scholarship-images";
        }
        const { file } = fileData;
        const storage = firebase.storage();
        const storageRef = storage.ref();
        // Add a random suffix to each file to prevent files with the same name from overriding each other
        // Notes that not all file types contain a file object, an example is the audio file type.
        let fileKey = file ? `${getRandomString(8)}-${file.name}` : `${getRandomString(8)}`
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