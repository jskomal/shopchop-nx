import { useState } from 'react'
import { TItem } from '../../types'

import createStyles from '../../styles/create.module.css'

type ItemToBuyProps = {
  item: TItem
  handleErrorText: (input: string) => void
}

function ItemToBuy({ item, handleErrorText }: ItemToBuyProps) {
  const [quantityToBuy, setQuantityToBuy] = useState(0)

  const handleQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) < 0) {
      setQuantityToBuy(0)
      handleErrorText('Quantity must be greater than 0')
      return
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
        name='quantityToBuy'
        value={quantityToBuy}
        onChange={handleQuantity}
        className={createStyles.quantInput}
      />
      <button>add to list</button>
    </div>
  )
}

export default ItemToBuy
