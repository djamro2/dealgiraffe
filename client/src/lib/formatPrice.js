
import numeral from 'numeral';

// formats to a default currency format
const formatPrice = function(priceString) {
    if (!priceString || isNaN(priceString)) {
        return "$0.00";
    }
    var updatedPrice = (Number(priceString)/100);
    return numeral(updatedPrice).format('$0,0.00');
};

export default formatPrice;