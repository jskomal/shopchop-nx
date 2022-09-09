import { useState } from 'react'
import { TItem } from '../../types'

import createStyles from '../../styles/create.module.css'

type ItemToBuyProps = {
  item: TItem
  handleErrorText: (input: string) => void
  addToList: (id: number, quantity: number) => void
}

function ItemToBuy({ item, handleErrorText, addToList }: ItemToBuyProps) {
  const [quantityToBuy, setQuantityToBuy] = useState<number | string>(
    item.latest_quantity_purchased || ''
  )

  const handleQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) < 0) {
      setQuantityToBuy(0)
      handleErrorText('Quantity must be greater than 0')
    } else {
      setQuantityToBuy(parseInt(e.target.value))
    }
  }

  return (
    <div className={createStyles.card}>
      <img src={item.img} alt={item.name} className={createStyles.img} />
      <p>{item.name}</p>
      <input
        type='number'
        value={quantityToBuy}
        onChange={handleQuantity}
        className={createStyles.quantInput}
        placeholder='Quantity'
      />
      <button onClick={() => addToList(item.id, parseInt(quantityToBuy.toString()))}>
        Add To List
      </button>
    </div>
  )
}

export default ItemToBuy
