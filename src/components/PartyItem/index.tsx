import type { PartyItemData } from '../../constants/party'
import './styles.scss'

type PartyItemProps = { item: PartyItemData }

export function PartyItem({ item }: PartyItemProps) {
  return (
    <figure className={`party-item party-item--${item.id}`} data-collage-item={item.id}>
      <div className="party-item__motion" data-party-item={item.id}>
        <img className="party-item__image" src={item.src} alt={item.alt} draggable={false} decoding="async" />
      </div>
    </figure>
  )
}
