
// titles longer than maxLimit or 30 should be taken as a substring and have '...' added on the end
// if maxLimit is -1, then return all of the text
const truncateText = function(text, maxLimit) {
    if (!text) {
        return '';
    }
    if (maxLimit == -1) {
        return text;
    }

    var result = text,
        defaultLimit = 30,
        limit = maxLimit || defaultLimit,
        finalIndex = limit;

    // find the finalIndex
    while(result.charAt(finalIndex) !== ' ') {
        finalIndex--;
    }

    // cut the string up
    if (text.length > limit) {
        result = text.substring(0, finalIndex);
        result += ' ...';
    }

    return result;
};

export default truncateText;