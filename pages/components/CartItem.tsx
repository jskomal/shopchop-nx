import { useState } from 'react'
import { TItem } from '../../types'

import listStyles from '../../styles/list.module.css'

type CartItemProps = {
  item: TItem
}

function ItemToBuy({ item }: CartItemProps) {
  return (
    <div className={listStyles.card}>
      <img src={item.img} alt={item.name} className={listStyles.img} />
      <p>{item.name}</p>
      <button>Remove from List</button>
    </div>
  )
}

export default ItemToBuy

// Add quantity Changer
