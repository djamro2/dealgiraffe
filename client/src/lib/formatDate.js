
import moment from 'moment';

const formatDate = function(date, format) {

    if (!date || !format) {
        return "no date or format";
    }

    return moment( new Date(date)).format(format);
};

export default formatDate;
