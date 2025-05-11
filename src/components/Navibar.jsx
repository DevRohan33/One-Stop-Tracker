'use client'

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useLocation } from 'react-router-dom';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'About', href: '/about' },
  ]

  return (
    <Disclosure as="nav" className="bg-[#1c1c1c] shadow">
      {() => (
        <>
          <div className="w-full px-6">
            <div className="flex h-16 justify-between items-center">
              {/* Logo / Title */}
              <div className="flex items-center">
                <img
                  className="h-10 w-10 mr-4"
                  src="/logo.png"
                  alt="Logo"
                />
                <span className="text-white font-bold text-xl">One Stop Tracker</span>
              </div>

              {/* Desktop Menu */}
              <div className="hidden sm:flex space-x-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        isActive
                          ? 'bg-purple-700 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'px-3 py-2 rounded-md text-sm font-medium'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.name}
                    </a>
                  )
                })}
              </div>

              {/* Right Icons */}
              <div className="flex items-center space-x-3">
                <button className="p-1 rounded-full text-gray-400 hover:text-white focus:ring-2 focus:ring-white">
                  <BellIcon className="h-6 w-6" />
                </button>

                {/* Profile dropdown with icon */}
                <Menu as="div" className="relative">
                  <MenuButton className="flex rounded-full focus:ring-2 focus:ring-white">
                    <UserCircleIcon className="h-8 w-8 text-white" />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/10">
                    <MenuItem>
                      {({ focus }) => (
                        <a
                          href="#"
                          className={classNames(
                            focus ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Your Profile
                        </a>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <a
                          href="#"
                          className={classNames(
                            focus ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Settings
                        </a>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <a
                          href="/login"
                          className={classNames(
                            focus ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Sign out
                        </a>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>

              {/* Mobile Menu Button */}
              <div className="sm:hidden">
                <DisclosureButton className="p-2 text-gray-400 hover:text-white focus:ring-2 focus:ring-white">
                  <Bars3Icon className="h-6 w-6" />
                </DisclosureButton>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <DisclosurePanel className="sm:hidden px-4 pb-3">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      isActive
                        ? 'bg-purple-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                  </DisclosureButton>
                )
              })}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  )
}
