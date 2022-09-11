import Image from 'next/image'
import { TAPIList } from '../../types'

import shopListStyles from '../../styles/shopList.module.css'

type Props = {
  imgSrc: string
  id: number
  name: string
  latest_quantity_purchased: number
  isBought: boolean
  setList: React.Dispatch<React.SetStateAction<TAPIList>>
}

function ShopCard({
  id,
  imgSrc,
  name,
  latest_quantity_purchased,
  isBought,
  setList
}: Props) {
  const handleChange = () =>
    setList((prev) => {
      const indexToChange = prev.items.findIndex((item) => item.id === id)
      if (indexToChange > -1) {
        prev.items[indexToChange].isBought = !prev.items[indexToChange].isBought
        return { ...prev }
      } else {
        return { ...prev }
      }
    })

  return (
    <div className={shopListStyles.card}>
      <Image
        src={imgSrc}
        height={75}
        width={75}
        layout='intrinsic'
        className={shopListStyles.img}
      />
      <h3 className={isBought ? shopListStyles.bought : ''}>{name}</h3>
      <p className={isBought ? shopListStyles.bought : ''}>
        Quantity: {latest_quantity_purchased}
      </p>
      <input type='checkbox' checked={isBought} onChange={handleChange} />
    </div>
  )
}

export default ShopCard
