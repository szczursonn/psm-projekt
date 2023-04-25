export const searchLocation = async (searchString) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchString)}&format=json&limit=1&accept-language=en-us`)
    if (!res.ok) {
        throw new Error(res.status)
    }

    return (await res.json())?.[0] || null
}

export const getLocationByCoords = async (lat, lon) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=${10}&format=json&accept-language=en-us`)
    if (!res.ok) {
        throw new Error(res.status)
    }

    const location = await res.json()

    return location.error ? null : location
}

export const getLocationByOsmId = async (osmId) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/lookup?osm_ids=${osmId}&format=json&accept-language=en-us`)
    if (!res.ok) {
        throw new Error(res.status)
    }

    return (await res.json())?.[0] || null
}