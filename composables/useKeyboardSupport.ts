export const useKeyboardSupport = (callbacks: {
  appendNumber: (num: string) => void
  appendDecimal: () => void
  appendOperator: (op: string) => void
  calculate: () => void
  clear: () => void
  backspace: () => void
}) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key

    // Numbers 0-9
    if (/^[0-9]$/.test(key)) {
      event.preventDefault()
      callbacks.appendNumber(key)
      return
    }

    // Operators
    switch (key) {
      case '+':
      case '-':
        event.preventDefault()
        callbacks.appendOperator(key)
        break
      case '*':
        event.preventDefault()
        callbacks.appendOperator(key)
        break
      case '/':
        event.preventDefault()
        callbacks.appendOperator(key)
        break
      case '%':
        event.preventDefault()
        callbacks.appendOperator('%')
        break
      case '.':
      case ',':
        event.preventDefault()
        callbacks.appendDecimal()
        break
      case 'Enter':
      case '=':
        event.preventDefault()
        callbacks.calculate()
        break
      case 'Backspace':
        event.preventDefault()
        callbacks.backspace()
        break
      case 'Delete':
      case 'c':
      case 'C':
        event.preventDefault()
        callbacks.clear()
        break
      default:
        break
    }
  }

  return {
    handleKeyDown,
  }
}
