import { PressEvent } from '@/lib/types'
import { Button, ButtonProps, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { create } from 'zustand'

interface ModalAction extends Omit<ButtonProps, 'onPress'> {
  close?: boolean
  onPress?(e: PressEvent, onClose: () => void): void | Promise<void>
}

interface OpenModalProps {
  header?: React.ReactNode
  body: React.ReactNode
  actions?: ModalAction[]
}

type ModalStore = {
  isOpen: boolean
  header?: React.ReactNode
  body: React.ReactNode
  actions: ModalAction[]
  open(props: OpenModalProps): void
  onOpenChange(open: boolean): void
}

export const useModal = create<ModalStore>()(set => ({
  isOpen: false,
  body: <></>,
  actions: [],
  open: props => set({ ...props, isOpen: true }),
  onOpenChange: open => set({ isOpen: open })
}))

export function Modals() {
  const { isOpen, header, body, actions, onOpenChange } = useModal()

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">{header}</ModalHeader>
            <ModalBody>{body}</ModalBody>
            {actions.length > 0 && (
              <ModalFooter>
                {actions.map(({ close = true, type = 'button', onPress, ...rest }, i) => {
                  function handlePress(e: PressEvent) {
                    onPress?.(e, onClose)
                    close && onClose()
                  }

                  return <Button type={type} onPress={handlePress} key={i} {...rest} />
                })}
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
