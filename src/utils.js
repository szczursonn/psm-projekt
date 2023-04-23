import { CURRENCY_UNIT, DEGREE_TO_METERS_MULTIPLIER, MINIMAL_MAP_CIRCLE_RADIUS } from "./consts";

export const getUserLocale = () => navigator.language || 'en-us';

export const formatCurrency = (amount) => new Intl.NumberFormat(getUserLocale(), { style: 'currency', currency: CURRENCY_UNIT, maximumFractionDigits: 0 }).format(amount);

export const getLocation = async (searchString) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchString)}&format=json&limit=1&accept-language=en-us`)
    if (!res.ok) {
        throw new Error(res.status)
    }

    return (await res.json())?.[0] || null
}

export const getLocationReverse = async (lat, lon) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=${10}&format=json&accept-language=en-us`)
    if (!res.ok) {
        throw new Error(res.status)
    }

    const location = await res.json()

    return location.error ? null : location
}

export const getLocationByOSMId = async (osmId) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/lookup?osm_ids=${osmId}&format=json&accept-language=en-us`)
    if (!res.ok) {
        throw new Error(res.status)
    }

    return (await res.json())?.[0] || null
}

export const getMapCircleRadius = (boundingBox) => {
    boundingBox = boundingBox.map(n => parseFloat(n))
    const radius = (Math.abs(boundingBox[0] - boundingBox[1]) + Math.abs(boundingBox[2] - boundingBox[3])) * DEGREE_TO_METERS_MULTIPLIER / 4
    return Math.max(radius, MINIMAL_MAP_CIRCLE_RADIUS)
}