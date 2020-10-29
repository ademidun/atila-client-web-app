import firebase from 'firebase/app';
import 'firebase/storage';
import {firebaseConfig} from "../firebase.config";
import {getRandomString} from "./utils";
firebase.initializeApp(firebaseConfig);

export class FilesAPI {

    static FIREBASE_STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

    static uploadFile = (fileData) => {

        console.log({event: fileData});
        const { file } = fileData;
        const storage = firebase.storage();
        const storageRef = storage.ref();
        const fileKey = `${getRandomString(8)}-${file.name}`;
        const uploadRef = storageRef.child(`user-uploads/scholarship-images/${fileKey}`);
        const uploadTask = uploadRef.put(file);

        return {
            uploadTask,
            uploadRef,
        }
    };


}