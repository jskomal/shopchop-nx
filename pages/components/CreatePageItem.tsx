import { TItem } from '../../types'

import createStyles from '../../styles/create.module.css'

type CreatePageItemProps = {
  item: TItem
  handleErrorText: (input: string) => void
  addToList: (id: number, quantity: number) => void
}

function CreatePageItem({ item, handleErrorText, addToList }: CreatePageItemProps) {
  const handleAddToList = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) < 0) {
      handleErrorText('Quantity must be greater than 0')
    } else {
      addToList(item.id, parseInt(e.target.value))
    }
  }

  return (
    <div className={createStyles.card}>
      <img src={item.img} alt={item.name} className={createStyles.img} />
      <p>{item.name}</p>
      <input
        type='number'
        onChange={handleAddToList}
        className={createStyles.quantInput}
        placeholder={
          item.latest_quantity_purchased > 0
            ? item.latest_quantity_purchased.toString()
            : 'Quantity'
        }
      />
    </div>
  )
}

export default CreatePageItem
