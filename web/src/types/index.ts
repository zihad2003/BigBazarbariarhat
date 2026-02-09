export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image: string
}

export interface ShippingAddress {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    country: string
}
