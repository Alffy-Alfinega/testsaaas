import { Input, InputProps } from 'react-daisyui';

import { CopyToClipboardButton } from '@/components/shared';

interface InputWithCopyButtonProps extends InputProps {
  label: string;
  description?: string;
}

const InputWithCopyButton = (props: InputWithCopyButtonProps) => {
  const { label, value, description, ...rest } = props;

  const id = label.replace(/ /g, '');

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center">
        <label className="label pl-0" htmlFor={id}>
          <span className="text-sm">{label}</span>
        </label>
        <CopyToClipboardButton value={value?.toString() || ''} />
      </div>
      <Input
        id={id}
        className="input w-full text-sm"
        {...rest}
        value={value}
      />
      {description && (
        <label className="label">
          <span className="text-xs">{description}</span>
        </label>
      )}
    </div>
  );
};

export default InputWithCopyButton;
