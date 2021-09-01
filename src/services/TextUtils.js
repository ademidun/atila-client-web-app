class TextUtils {

    static countWords = (str) => {
        // https://stackoverflow.com/a/18679592/5405197
        //  TODO: The function below doesn't count words on new line as a new word
        if(!str || !str.trim ) {
            return 0;
        }
        return str.trim().split(/\s+/).length;
    }
}

export default TextUtils;
