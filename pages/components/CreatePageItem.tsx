import { TItem } from '../../types'
import Image from 'next/image'

import createStyles from '../../styles/create.module.css'

type CreatePageItemProps = {
  item: TItem
  handleErrorText: (input: string) => void
  addToList: (id: number, quantity: number) => void
  listQuantity: number | undefined
}

function CreatePageItem({
  item,
  handleErrorText,
  addToList,
  listQuantity,
}: CreatePageItemProps) {
  const handleAddToList = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) < 0) {
      handleErrorText('Quantity must be greater than 0')
    } else {
      addToList(item.id, parseInt(e.target.value))
    }
  }

  return (
    <div className={createStyles.card}>
      <Image
        src={item.img}
        width={80}
        height={80}
        layout='fixed'
        alt={item.name}
        className={createStyles.img}
      />
      <p>{item.name}</p>
      <input
        type='number'
        onChange={handleAddToList}
        className={createStyles.quantInput}
        placeholder={listQuantity !== undefined ? listQuantity.toString() : 'Quantity'}
      />
    </div>
  )
}

export default CreatePageItem
