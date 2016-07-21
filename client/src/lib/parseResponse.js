
import formatPrice from './formatPrice';

// reusable function to parse general fields in typically database items
function parseResponse(items, singleItem) {
    if (singleItem) {
        items = [items];
    }

    for (var i = 0; i < items.length; i++) {
        items[i].title = items[i].large_data.ItemAttributes.Title || '';
        items[i].productURL = items[i].large_data.DetailPageURL;
        items[i].pageURL = '/product?id=' + items[i].asin;

        // 'image' is the first available image or nothing
        if (items[i].large_data.LargeImage) {
            items[i].image = items[i].large_data.LargeImage.URL;
        } else if (items[i].large_data.MediumImage) {
            items[i].image = items[i].large_data.MediumImage.URL;
        } else {
            items[i].image = "";
        }

        // 'price' is the first available price
        if (items[i].price_amazon_new && items[i].price_amazon_new.length && items[i].price_amazon_new[0].price !== 0) {
            items[i].price = items[i].price_amazon_new[items[i].price_amazon_new.length - 1].price;
        } else if (items[i].price_third_new  && items[i].price_third_new.length && items[i].price_third_new[0].price !== 0) {
            items[i].price = items[i].price_third_new[items[i].price_third_new.length - 1].price;
        } else if (items[i].price_third_used && items[i].price_third_used.length && items[i].price_third_used[0].price !== 0) {
            items[i].price = items[i].price_third_used[items[i].price_third_used.length - 1].price;
        } else {
            items[i].price = 0; // no price tracking
        }
        items[i].priceFormatted = formatPrice(items[i].price);
    }

    if (singleItem) {
        return items[0]
    }
    return items;
}

export default parseResponse;