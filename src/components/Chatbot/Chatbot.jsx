import { useEffect, useState } from 'react'
import { FiMessageCircle, FiX } from 'react-icons/fi'
import Button from '../Button/Button'
import { getChatBotInfo, sendChatMessage } from '../../services/chat'

const quickReplies = [
  'Info paket umrah',
  'Jadwal keberangkatan',
  'Konsultasi biaya',
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: 'Halo, saya bisa bantu info paket, jadwal, dan konsultasi umrah.' },
  ])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)
  const [botName, setBotName] = useState('Rehlata Assistant')
  const [userId, setUserId] = useState(null)

  const loadStoredUserId = () => {
    const storedUser = localStorage.getItem('authUser')
    if (!storedUser) return null

    try {
      const user = JSON.parse(storedUser)
      return user?.id_pengguna || user?.id || null
    } catch (err) {
      console.error('Gagal membaca authUser dari localStorage:', err)
      return null
    }
  }

  useEffect(() => {
    setUserId(loadStoredUserId())
  }, [])

  useEffect(() => {
    getChatBotInfo()
      .then((data) => {
        if (data?.bot_name) {
          setBotName(data.bot_name)
        }
      })
      .catch((err) => {
        console.warn('Tidak dapat memuat bot info:', err)
      })
  }, [])

  const addMessage = (role, text) => {
    setMessages((current) => [
      ...current,
      { id: Date.now() + Math.random(), role, text },
    ])
  }

  const handleSend = async (messageText) => {
    if (!messageText || messageText.trim() === '') return

    const storedId = loadStoredUserId()
    const effectiveUserId = userId || storedId
    if (!effectiveUserId) {
      setError('Silakan login terlebih dahulu untuk menggunakan chatbot.')
      return
    }

    setError(null)
    addMessage('user', messageText)
    setIsSending(true)

    try {
      const response = await sendChatMessage({ message: messageText, userId: effectiveUserId })
      addMessage('bot', response.bot_response || 'Maaf, saya belum bisa menjawab sekarang.')
      setInput('')
      if (!userId) setUserId(effectiveUserId)
    } catch (err) {
      console.error('Chat API error:', err)
      setError(err.message || 'Gagal mengirim pesan ke chatbot.')
    } finally {
      setIsSending(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    handleSend(trimmed)
  }

  const handleQuickReply = (reply) => {
    handleSend(reply)
  }

  return (
    <div className="chatbot">
      {isOpen ? (
        <div className="chatbot__panel" role="dialog" aria-modal="true" aria-label="Chatbot Rehlata Tour">
          <div className="chatbot__header">
            <div>
              <span className="chatbot__eyebrow">{botName}</span>
              <h3 className="chatbot__title">Butuh bantuan cepat?</h3>
            </div>
            <button
              type="button"
              className="chatbot__close"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup chatbot"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="chatbot__body">
            <div className="chatbot__messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`chatbot__message chatbot__message--${message.role}`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            {error ? <div className="chatbot__error">{error}</div> : null}

            <div className="chatbot__quick-replies">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  className="chatbot__chip"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>

            <form className="chatbot__input-group" onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={userId ? 'Ketik pertanyaan kamu...' : 'Login dulu untuk mulai chat...'}
                disabled={isSending || !userId}
                className="chatbot__input"
              />
              <Button type="submit" variant="primary" disabled={isSending || !userId}>
                {isSending ? 'Mengirim...' : 'Kirim'}
              </Button>
            </form>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="chatbot__launcher"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? 'Tutup chatbot' : 'Buka chatbot'}
        aria-expanded={isOpen}
      >
        <FiMessageCircle size={20} />
        <span>Chatbot</span>
      </button>
    </div>
  )
}
