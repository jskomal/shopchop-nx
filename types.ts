export type TItem = {
  id: number
  created_at: string
  name: string
  img: string
  latest_quantity_purchased: number
  total_quantity_purchased: number
}

export type TList = {
  items: TItem[]
  name: string
  comment: string
}
