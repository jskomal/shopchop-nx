import Link from 'next/link'
import { TAPIList, TList } from '../../types'
import myListStyles from '../../styles/myLists.module.css'
import dayjs from 'dayjs'

type ShoppingListProps = {
  list: TAPIList
}

function ShoppingList({ list }: ShoppingListProps) {
  const itemPreview = list.items.map((item) => item.name).join(', ')

  return (
    <Link href='/myList/[id]'>
      <div className={myListStyles.card}>
        <h3>{list.name}</h3>
        <p>***</p>
        {list.comment && <p>{list.comment}</p>}
        <p>
          {itemPreview.length > 20 ? `${itemPreview.substring(0, 25)}...` : itemPreview}
        </p>
        <p>{`${list.items.length} items`}</p>
        <p>{`Created ${dayjs(list.created_at).format('dddd, MMMM D, YYYY')}`}</p>
      </div>
    </Link>
  )
}

export default ShoppingList
