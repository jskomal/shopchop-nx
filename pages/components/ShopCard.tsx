import Image from 'next/image'
import { useState } from 'react'
import { TItem } from '../../types'

import shopListStyles from '../../styles/shopList.module.css'

type Props = {
  item: TItem
  imgSrc: string
  name: string
  latest_quantity_purchased: number
}

function ShopCard({ item, imgSrc, name, latest_quantity_purchased }: Props) {
  const [isBought, setIsBought] = useState(false)

  const handleChange = () => setIsBought((prev) => !prev)

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
