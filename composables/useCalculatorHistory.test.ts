import { describe, it, expect, beforeEach } from 'vitest'
import { useCalculatorHistory } from './useCalculatorHistory'

describe('useCalculatorHistory', () => {
  let history: ReturnType<typeof useCalculatorHistory>

  beforeEach(() => {
    history = useCalculatorHistory()
  })

  it('should initialize with empty history', () => {
    expect(history.history.value).toEqual([])
  })

  it('should add entry to history', () => {
    history.addToHistory('1 + 1', '2')
    expect(history.history.value).toHaveLength(1)
    expect(history.history.value[0].expression).toBe('1 + 1')
    expect(history.history.value[0].result).toBe('2')
  })

  it('should maintain insertion order (newest first)', () => {
    history.addToHistory('1 + 1', '2')
    history.addToHistory('2 * 3', '6')
    history.addToHistory('10 - 5', '5')

    expect(history.history.value[0].expression).toBe('10 - 5')
    expect(history.history.value[1].expression).toBe('2 * 3')
    expect(history.history.value[2].expression).toBe('1 + 1')
  })

  it('should clear history', () => {
    history.addToHistory('1 + 1', '2')
    history.addToHistory('2 * 3', '6')
    history.clearHistory()
    expect(history.history.value).toEqual([])
  })

  it('should remove history entry by index', () => {
    history.addToHistory('1 + 1', '2')
    history.addToHistory('2 * 3', '6')
    history.removeHistoryEntry(0)
    expect(history.history.value).toHaveLength(1)
    expect(history.history.value[0].expression).toBe('1 + 1')
  })

  it('should not exceed max history size', () => {
    for (let i = 0; i < 60; i++) {
      history.addToHistory(`${i} + 1`, `${i + 1}`)
    }
    expect(history.history.value).toHaveLength(50)
  })
})
