
// titles longer than maxLimit or 30 should be taken as a substring and have '...' added on the end
const truncateText = function(text, maxLimit) {
    if (!text) {
        return '';
    }
    if (maxLimit == -1) {
        return text;
    }

    var result = text,
        defaultLimit = 30,
        limit = maxLimit || defaultLimit;

    if (text.length > limit) {
        result = text.substring(0, limit);
        result += '...';
    }
    return result;
};

export default truncateText;