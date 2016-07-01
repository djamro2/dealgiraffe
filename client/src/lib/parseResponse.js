
// reusable function to parse general fields in typically database items
function parseResponse(items) {
    for (var i = 0; i < items.length; i++) {
        items[i].title = items[i].large_data.ItemAttributes.Title;
        items[i].image = items[i].large_data.LargeImage.URL;
    }
    return items;
}

module.exports = parseResponse;