import { PARTY_CONTENT } from '../../constants/party'
import './styles.scss'

export function BirthdayMessage() {
  const { miniTitle, title, text, wish, ending, signature } = PARTY_CONTENT.finale
  return (
    <div className="birthday-message" aria-live="polite" aria-label="Mensagem surpresa de aniversário">
      <span className="birthday-message__sparkle" aria-hidden="true">✦</span>
      {miniTitle && <p className="birthday-message__eyebrow">{miniTitle}</p>}
      <h2 className="birthday-message__title">{title}</h2>
      <p className="birthday-message__body">{text}</p>
      <p className="birthday-message__body">{wish}</p>
      <p className="birthday-message__ending">{ending}</p>
      <p className="birthday-message__signature"><em>{signature} ♡</em></p>
    </div>
  )
}
