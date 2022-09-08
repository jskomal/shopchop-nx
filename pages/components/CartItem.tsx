import { useState } from 'react'
import { TItem } from '../../types'

import listStyles from '../../styles/list.module.css'

type CartItemProps = {
  item: TItem
}

function CartItem({ item }: CartItemProps) {
  return (
    <div className={listStyles.card}>
      <img src={item.img} alt={item.name} className={listStyles.img} />
      <div className={listStyles.namePair}>
        <p>{item.name}</p>
        <p>Quantity: {item.latest_quantity_purchased}</p>
      </div>
      <button>Remove from List</button>
    </div>
  )
}

export default CartItem

// Add quantity Changer
