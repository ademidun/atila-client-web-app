
function countWords(str) {
    if (str.split(" ")[0] === ""){
        return 0;
    }
    return str.split(" ").length;
}

export default countWords;