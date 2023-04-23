# Car Auction App

## Projekt na Programowanie Systemów Mobilnych

### Grupa:

- Michał Szczurek
- Mateusz Puto

### [Live demo]() @Firebase Hosting

## Wymagania do developowania

- Node.js

## Instalacja

1. Zklonuj repo
2. W terminalu `npm i`
3. Odpal dev server `npm run dev`

## DB Schema

### Car Offer (`/cars`)

```
{
    manufacturer: string
    model: string
    year: string
    price: number
    features: string[]
    miles: number?
    location_osm_id: string?
    photo_url: string?
}
```

### Contact Request (`/contact_requests`)

```
{
    offer_id: string (car offer doc id)
    message: string
    phone_number: string?
    email: string?
}
```
