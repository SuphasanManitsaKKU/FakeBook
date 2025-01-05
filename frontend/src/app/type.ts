// Geo interface
export interface Geo {
    lat: string;
    lng: string;
}

// Address interface
export interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
}

// Company interface
export interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
}

// Main User interface
export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
}
