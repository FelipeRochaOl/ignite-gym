import { ComponentProps } from 'react';

import { ButtonGroup, ButtonIcon, ButtonSpinner, ButtonText, Button as GluestackButton } from '@components/ui/button';

type ButtonProps = ComponentProps<typeof GluestackButton> & {
  title: string;
  isLoading?: boolean;
  variant?: 'solid' | 'outline';
  icon?: React.ReactNode;
};

export function Button({ title, icon, variant = 'solid', isLoading = false, ...props }: ButtonProps) {

  const variantStyles = variant === 'outline'
    ? 'h-14 bg-transparent border border-green-500 rounded-sm data-[active=true]:border-green-500 data-[active=true]:bg-gray-500'
    : 'h-14 bg-green-500 border-0 rounded-sm data-[active=true]:bg-green-500';

  const variantTextStyles = variant === 'outline'
    ? 'text-green-500 font-heading text-sm'
    : 'text-white font-heading text-sm';

  return (
    <ButtonGroup className='w-full'>
      <GluestackButton {...props}
        className={variantStyles}
        disabled={isLoading}
      >
        {isLoading
          ? <ButtonSpinner color={'white'} className='backdrop-brightness-100' />
          : <ButtonText className={variantTextStyles}>{title}</ButtonText>
        }

        {icon && !isLoading && <ButtonIcon>{icon}</ButtonIcon>}
      </GluestackButton>
    </ButtonGroup>
  )
}