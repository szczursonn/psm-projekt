import { labels } from "./labels"
import { CURRENCY_UNIT } from "./consts";

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
    FUEL_TYPE_TO_LABEL[offer.fuel_type],
]
    .filter((x) => x)
    .join(" · ");

export const FUEL_TYPE_TO_LABEL = {
    'petrol': labels.FUEL_TYPES.PETROL,
    'diesel': labels.FUEL_TYPES.DIESEL,
    'lpg': labels.FUEL_TYPES.LPG,
    'hybrid': labels.FUEL_TYPES.HYBRID,
    'electric': labels.FUEL_TYPES.ELECTRIC,
};

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
