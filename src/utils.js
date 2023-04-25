import { CURRENCY_UNIT, DEGREE_TO_METERS_MULTIPLIER, FUEL_TYPE_LABELS, MINIMAL_MAP_CIRCLE_RADIUS } from "./consts";

export const getUserLocale = () => navigator.language || 'en-us';

export const formatCurrency = (amount) => new Intl.NumberFormat(getUserLocale(), { style: 'currency', currency: CURRENCY_UNIT, maximumFractionDigits: 0 }).format(amount);

export const formatDaysAgo = (date) => {
    const formatter = new Intl.RelativeTimeFormat('en-us', { style: 'short' })
    const daysDiff = Math.ceil(Math.abs(new Date() - date) / (1000 * 60 * 60 * 24))
    return formatter.format(-daysDiff, 'day')
}

export const getMapCircleRadius = (boundingBox) => {
    boundingBox = boundingBox.map(n => parseFloat(n))
    const radius = (Math.abs(boundingBox[0] - boundingBox[1]) + Math.abs(boundingBox[2] - boundingBox[3])) * DEGREE_TO_METERS_MULTIPLIER / 4
    return Math.max(radius, MINIMAL_MAP_CIRCLE_RADIUS)
}

export const getOfferSubtitle = (offer) => [
    offer.year,
    typeof offer.miles === "number" && `${offer.miles} km`,
    FUEL_TYPE_LABELS[offer.fuel_type],
]
    .filter((x) => x)
    .join(" · ");