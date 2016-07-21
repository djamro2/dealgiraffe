
// Pass in offers_item and get each of prices returned as an object
var getPricingData = function(offers_item) {
    // object to be returned
    var result = {
        price_amazon_new: 0,
        price_third_new: 0,
        price_third_used: 0
    };

    // check valid
    if (!offers_item) {
        console.log("Offers item did not exist!");
        return;
    }

    // get price amazon new
    if (offers_item.Offers &&
        offers_item.Offers.Offer &&
        offers_item.Offers.Offer.OfferListing.Price.Amount) {
        result.price_amazon_new = offers_item.Offers.Offer.OfferListing.Price.Amount;
    } else {
        console.log("Could not get the price_amazon_new data for asin: " + offers_item.ASIN);
    }

    // get price third new
    if (offers_item.OfferSummary &&
        offers_item.OfferSummary.LowestNewPrice) {
        result.price_third_new = offers_item.OfferSummary.LowestNewPrice.Amount;
    } else {
        console.log("Could not get the price_third_new data for asin: " + offers_item.ASIN);
    }

    // get price third used
    if (offers_item.OfferSummary &&
        offers_item.OfferSummary.LowestUsedPrice) {
        result.price_third_used = offers_item.OfferSummary.LowestUsedPrice.Amount;
    } else {
        console.log("Could not get the price_third_used data for asin: " + offers_item.ASIN);
    }

    return result;
};

module.exports = getPricingData;