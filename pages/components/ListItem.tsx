import { TItem } from '../../types'
import Image from 'next/image'

import listStyles from '../../styles/list.module.css'

type ListItemProps = {
  item: TItem
  removeItemFromList: (itemID: number) => void
}

function ListItem({ item, removeItemFromList }: ListItemProps) {
  return (
    <div className={listStyles.card}>
      <Image
        src={item.img}
        alt={item.name}
        width={80}
        height={80}
        layout='fixed'
        className={listStyles.img}
      />
      <div className={listStyles.namePair}>
        <p>{item.name}</p>
        <p>Quantity: {item.latest_quantity_purchased}</p>
      </div>
      <button onClick={() => removeItemFromList(item.id)}>Remove from List</button>
    </div>
  )
}

export default ListItem

// Add quantity Changer
