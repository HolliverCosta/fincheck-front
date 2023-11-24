import { CrossCircledIcon } from '@radix-ui/react-icons';
import { NumericFormat } from 'react-number-format';

interface InputCurrencyProps {
  error?: string;
  value?: string | number;
  onChange?(value: string): void;
}

export function InputCurrency({ error, onChange, value }: InputCurrencyProps) {
  return (
    <div>
      <NumericFormat
        onChange={event => onChange?.(event.target.value)}
        value={value}
        className='w-full text-gray-800 text-[32px] font-bold tracking-[-1px] outline-none'
        thousandSeparator="."
        decimalSeparator=','
      />
      {error && (
        <div className="flex gap-2 items-center mt-2 text-red-900">
          <CrossCircledIcon />
          <span className="text-xs ">{error}</span>
        </ div>
      )}
    </div >
  )
}