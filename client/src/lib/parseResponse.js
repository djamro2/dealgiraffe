
// reusable function to parse general fields in typically database items
function parseResponse(items, singleItem) {
    if (singleItem) {
        items = [items];
    }
    
    for (var i = 0; i < items.length; i++) {
        items[i].title = items[i].large_data.ItemAttributes.Title;
        items[i].productURL = items[i].large_data.DetailPageURL;
        items[i].pageURL = '/product?id=' + items[i].asin;

        if (items[i].large_data.LargeImage) {
            items[i].image = items[i].large_data.LargeImage.URL;
        } else if (items[i].large_data.MediumImage) {
            items[i].image = items[i].large_data.MediumImage.URL;
        } else {
            items[i].image = "";
        }
    }

    if (singleItem) {
        return items[0]
    }
    return items;
}

module.exports = parseResponse;