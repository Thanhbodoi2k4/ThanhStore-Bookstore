import React, { useState, useRef, useEffect, useCallback } from 'react'
import styles from './Chatbot.module.css'
import chatApi from '../../api/chatApi'

const SUGGESTIONS = [
  '📚 Gợi ý sách hay nên đọc',
  '🔍 Tôi muốn tìm sách về tâm lý học',
  '🚚 Chính sách giao hàng của ThanhStore?',
  '💳 ThanhStore hỗ trợ thanh toán gì?',
]

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
)

function formatTime(date) {
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showBadge, setShowBadge] = useState(true)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  const handleOpen = () => {
    setIsOpen(true)
    setShowBadge(false)
  }

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false)
    } else {
      handleOpen()
    }
  }

  const handleClearHistory = () => {
    setMessages([])
  }

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: trimmed,
      time: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsLoading(true)

    // Resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      // Build history for API (exclude the just-added user message)
      const history = messages.map(m => ({
        role: m.role,
        content: m.content
      }))

      const data = await chatApi.sendMessage(trimmed, history)

      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        content: data.response,
        time: new Date()
      }
      setMessages(prev => [...prev, botMsg])
    } catch (error) {
      const errText = error?.response?.data?.error || 'Xin lỗi, mình gặp sự cố. Thử lại nhé!'
      const errMsg = {
        id: Date.now() + 1,
        role: 'bot',
        content: errText,
        isError: true,
        time: new Date()
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, messages])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputValue)
    }
  }

  const handleTextareaChange = (e) => {
    setInputValue(e.target.value)
    // Auto resize
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 90) + 'px'
  }

  return (
    <div className={styles.chatbotWrapper}>
      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>🤖</div>
              <div className={styles.onlineDot} />
            </div>
            <div className={styles.headerInfo}>
              <div className={styles.botName}>ThanhStore AI</div>
              <div className={styles.botStatus}>Trợ lý sách thông minh • Online</div>
            </div>
            <button
              className={styles.clearBtn}
              onClick={handleClearHistory}
              title="Xóa lịch sử"
            >
              <TrashIcon />
            </button>
          </div>

          {/* Messages */}
          <div className={styles.messagesArea}>
            {messages.length === 0 && (
              <div className={styles.welcomeMessage}>
                <div className={styles.welcomeEmoji}>📚</div>
                <div className={styles.welcomeTitle}>Xin chào! Mình là ThanhStore AI</div>
                <div className={styles.welcomeSubtitle}>
                  Mình có thể giúp bạn tìm sách, gợi ý đọc hay, hoặc tư vấn về cửa hàng 😊
                </div>
                <div className={styles.suggestions}>
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      className={styles.suggestionBtn}
                      onClick={() => sendMessage(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${msg.role === 'user' ? styles.userRow : ''}`}
              >
                {msg.role === 'bot' && (
                  <div className={styles.msgAvatar}>🤖</div>
                )}
                <div>
                  <div
                    className={`${styles.bubble} ${
                      msg.role === 'user'
                        ? styles.userBubble
                        : msg.isError
                        ? styles.errorBubble
                        : styles.botBubble
                    }`}
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {msg.content}
                  </div>
                  <div className={styles.msgTime}>{formatTime(msg.time)}</div>
                </div>
                {msg.role === 'user' && (
                  <div className={`${styles.msgAvatar} ${styles.userAvatar}`}>😊</div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className={styles.typingRow}>
                <div className={styles.msgAvatar}>🤖</div>
                <div className={styles.typingBubble}>
                  <div className={styles.typingDot} />
                  <div className={styles.typingDot} />
                  <div className={styles.typingDot} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={styles.inputArea}>
            <div className={styles.inputWrapper}>
              <textarea
                ref={textareaRef}
                className={styles.textInput}
                rows={1}
                value={inputValue}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi... (Enter để gửi)"
                disabled={isLoading}
              />
            </div>
            <button
              className={styles.sendBtn}
              onClick={() => sendMessage(inputValue)}
              disabled={isLoading || !inputValue.trim()}
              title="Gửi"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        id="chatbot-toggle-btn"
        className={styles.toggleBtn}
        onClick={handleToggle}
        title={isOpen ? 'Đóng chat' : 'Mở chat với ThanhStore AI'}
        aria-label={isOpen ? 'Đóng chatbot' : 'Mở chatbot'}
      >
        {showBadge && !isOpen && <span className={styles.badge}>1</span>}
        <span className={`${styles.toggleIcon} ${isOpen ? styles.toggleIconOpen : ''}`}>
          {isOpen ? <CloseIcon /> : <ChatIcon />}
        </span>
      </button>
    </div>
  )
}

export default Chatbot
