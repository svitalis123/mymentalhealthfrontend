// src/components/a11y/AccessibleCombobox.tsx
import { useState, useRef, useEffect } from 'react'
import { useA11y } from '../../hooks/useA11y'

interface Option {
  value: string
  label: string
}

interface AccessibleComboboxProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  label: string
  placeholder?: string
}

export const AccessibleCombobox = ({
  options,
  // value,
  onChange,
  label,
  placeholder
}: AccessibleComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)
  const { announce } = useA11y()

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setIsOpen(true)
        setActiveIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setIsOpen(true)
        setActiveIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (isOpen && activeIndex >= 0) {
          onChange(filteredOptions[activeIndex].value)
          setIsOpen(false)
          announce(`Selected ${filteredOptions[activeIndex].label}`)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setActiveIndex(-1)
        inputRef.current?.blur()
        break
      case 'Tab':
        setIsOpen(false)
        break
    }
  }

  useEffect(() => {
    if (isOpen && activeIndex >= 0) {
      const activeOption = listboxRef.current?.children[activeIndex] as HTMLElement
      activeOption?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex, isOpen])

  return (
    <div className="relative">
      <label
        id={`${label}-label`}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="listbox"
        aria-labelledby={`${label}-label`}
        aria-activedescendant={
          activeIndex >= 0 ? `option-${filteredOptions[activeIndex].value}` : undefined
        }
        value={searchTerm}
        onChange={e => {
          setSearchTerm(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        placeholder={placeholder}
      />

      {isOpen && (
        <ul
          ref={listboxRef}
          id="listbox"
          role="listbox"
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          {filteredOptions.map((option, index) => (
            <li
              key={option.value}
              id={`option-${option.value}`}
              role="option"
              aria-selected={activeIndex === index}
              className={`relative cursor-default select-none py-2 pl-3 pr-9 ${
                activeIndex === index ? 'bg-indigo-600 text-white' : 'text-gray-900'
              }`}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
                announce(`Selected ${option.label}`)
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}