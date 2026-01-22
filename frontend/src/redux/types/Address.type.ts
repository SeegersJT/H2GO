export type GeoPoint = {
  type: 'Point'
  coordinates: [number, number]
}

export type Address = {
  _id: string
  user_id: string
  country_id: string
  label: string

  address_line_01: string
  address_line_02?: string
  suburb?: string
  city?: string
  region?: string
  postal_code?: string

  lat: number
  lng: number
  location: GeoPoint

  delivery_instructions?: string
  contact_person?: string
  contact_phone?: string

  is_default: boolean
  active: boolean

  address_no: string

  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
}
