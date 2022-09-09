import Link from 'next/link'
import { TList } from '../../types'
import myListStyles from '../../styles/myLists.module.css'

type ShoppingListProps = {
  list: TList
}

function ShoppingList({ list }: ShoppingListProps) {
  const itemPreview = list.items.map((item) => item.name).join(', ')

  return (
    <Link href='/myList/[id]'>
      <div className={myListStyles.card}>
        <h3>{list.name}</h3>
        {list.comment && <p>{list.comment}</p>}
        <p>{`${itemPreview.substring(0, 20)}...`}</p>
        <p>{`${list.items.length} items`}</p>
      </div>
    </Link>
  )
}

export default ShoppingList
