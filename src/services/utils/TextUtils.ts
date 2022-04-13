class TextUtils {

    static countWords = (str: string) => {
        // https://stackoverflow.com/a/18679592/5405197
        //  TODO: The function below doesn't count words on new line as a new word
        if(!str || !str.trim ) {
            return 0;
        }
        return str.trim().split(/\s+/).length;
    }

    static formatCurrency = (input : number, currency = "CAD", convertToInteger= false) => {
        let minimumFractionDigits = 2;
        if (convertToInteger) {
            input = Math.round(input);
            minimumFractionDigits = 0;
        }
        if (["ETH", "BNB"].includes(currency)) {
            return `${currency} ${input.toFixed(6)}`
        }
        return input.toLocaleString('en-ca', {style : 'currency', currency, minimumFractionDigits });
    }
}

/**
 * 
 * @source https://stackoverflow.com/a/16251861
 * @param words 
 * @returns 
 */
export const arrayToString = (words: Array<string>) => {
    return [words.slice(0, -1).join(', '), words.slice(-1)[0]].join(words.length < 2 ? '' : ' and ');
}

export default TextUtils;
