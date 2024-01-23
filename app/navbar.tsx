'use client'

import { IoChatbubblesSharp } from 'react-icons/io5'

import { useModal } from '@/hooks/useModal'
import { useUser } from '@/hooks/useUser'
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Input
} from '@nextui-org/react'

export function Navbar() {
  const { user, changeName } = useUser()
  const { open } = useModal()

  function handleNameChange() {
    open({
      body: <Input label="name" defaultValue={user.name} onValueChange={changeName} labelPlacement="outside" />,
      actions: [{ children: 'Cancel', color: 'danger', onPress: () => changeName(user.name) }, { children: 'Save' }]
    })
  }

  return (
    <NextUINavbar className="bg-background">
      <NavbarBrand className="gap-2">
        <IoChatbubblesSharp size={24} className="shrink-0 text-foreground" />
        <p className="font-bold text-inherit">Next Real-Time Chat</p>
      </NavbarBrand>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name={user.name}
              size="sm"
              src={`https://i.pravatar.cc/150?u=${user.id}`}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{user.name}</p>
            </DropdownItem>
            <DropdownItem key="name" onPress={handleNameChange}>
              Change Name
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </NextUINavbar>
  )
}
