# Car Auction App

## Projekt na Programowanie Systemów Mobilnych

### Grupa:

- Michał Szczurek
- Mateusz Puto

### [Live demo](https://psm-firebase-4f74c.web.app/) @Firebase Hosting

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
    created_at: date
    owner_id: string (user id)
    photo_url: string?
    horses: number?
    fuel_type: string?
}
```

### Chat (`/chats`)

```
{
    members: string[] (user ids)
    offer_id: string (offer doc id)
    messages: {
        sender: string (user id)
        content: string
        created_at: date
    }[]
}
```

### Profile (`/profiles`)

```
{
    name: string?
    email: string?
    phone_number: string?
    photo_url: string?
}
```
