import { Input } from 'antd'
import { SEARCH_INPUT_MAX_WIDTH, STRINGS } from '@/constants'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  busy?: boolean
  large?: boolean
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  busy = false,
  large = false,
}: SearchInputProps) {
  return (
    <Input.Search
      type="search"
      aria-label={STRINGS.search.inputLabel}
      placeholder={STRINGS.search.placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onSearch={() => onSubmit()}
      allowClear
      loading={busy}
      enterButton={STRINGS.search.searchButton}
      size={large ? 'large' : 'middle'}
      autoComplete="off"
      spellCheck={false}
      style={{ maxWidth: SEARCH_INPUT_MAX_WIDTH, width: '100%' }}
    />
  )
}
