export type TItem = {
  id: number
  created_at: string
  name: string
  img: string
  latest_quantity_purchased: number
  total_quantity_purchased: number
  isBought: boolean
}

export type TList = {
  items: TItem[]
  name: string
  comment?: string
}

export interface TAPIList extends TList {
  id: number
  created_at: string
}
