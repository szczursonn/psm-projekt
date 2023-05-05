import { CURRENCY_UNIT } from "./consts";
import { labels } from "./labels";

export const getUserLocale = () => navigator.language || 'en-us';

export const formatCurrency = (amount) => new Intl.NumberFormat(getUserLocale(), { style: 'currency', currency: CURRENCY_UNIT, maximumFractionDigits: 0 }).format(amount);

export const formatDaysAgo = (date) => {
    const formatter = new Intl.RelativeTimeFormat('en-us', { style: 'short' })
    const daysDiff = Math.ceil(Math.abs(new Date() - date) / (1000 * 60 * 60 * 24))
    return formatter.format(-daysDiff, 'day')
}

export const getOfferSubtitle = (offer) => [
    offer.year,
    typeof offer.miles === "number" && `${offer.miles} km`,
    labels.FUEL_TYPES[offer.fuel_type],
]
    .filter((x) => x)
    .join(" · ");

export const sortBy = (field, reverse = false) => (a, b) => {
    a = parseFloat(a[field]);
    b = parseFloat(b[field]);

    let res;
    if (isNaN(a) && isNaN(b)) {
        res = 0;
    } else if (isNaN(a)) {
        res = 1;
    } else if (isNaN(b)) {
        res = -1;
    } else {
        res = a - b;
    }
    return reverse ? -res : res;
}
