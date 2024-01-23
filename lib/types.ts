import { ButtonProps } from '@nextui-org/react'

export type PressEvent = Parameters<NonNullable<ButtonProps['onPress']>>[0]
