'use client'

import useScrollEvent from '@/hooks/useScrollEvent'
import useToggle from '@/hooks/useToggle'
import { Icon } from '@iconify/react'
import Link from 'next/link'

const TopBar = () => {
    const { scrollY } = useScrollEvent()
    const { isTrue, toggle } = useToggle()
    return (
        <>
            <header className={`bg-transparent fixed top-0 w-full z-20 transition-all [.active]:bg-white [.active]:shadow ${scrollY && 'active'} `} id="navbar-sticky">
                <div className="container">
                    <div className="flex items-center lg:justify-start justify-between lg:py-5 py-2.5">
                        <div className="text-lg font-bold">
                            <Link href="/">
                            <h2>HPV</h2>
                                {/* <Image src={logoDark} width={168} height={30} alt="Logo" className="h-7.5" /> */}
                            </Link>
                        </div>
                        <div className="lg:flex hidden justify-center ms-auto">
                            <Link href="#home" target="_blank" className="inline-flex items-center font-medium text-dark hover:text-primary transition-all duration-300 mx-3.75 py-1.5">Home</Link>
                            <Link href="#feature" target="_blank" className="inline-flex items-center font-medium text-dark hover:text-primary transition-all duration-300 mx-3.75 py-1.5">Feature</Link>
                            <Link href="#services" target="_blank" className="inline-flex items-center font-medium text-dark hover:text-primary transition-all duration-300 mx-3.75 py-1.5">Services</Link>
                            <Link href="#team" target="_blank" className="inline-flex items-center font-medium text-dark hover:text-primary transition-all duration-300 mx-3.75 py-1.5">Team</Link>
                            <Link href="#contact" target="_blank" className="inline-flex items-center font-medium text-dark hover:text-primary transition-all duration-300 mx-3.75 py-1.5">Contact</Link>
                        </div>
                        <div className="flex flex-row justify-center items-center md:gap-4 gap-2.5">
                            <div className="md:flex hidden justify-end">
                                <button className="py-1.75 px-4.5 ms-6 bg-primary text-sm text-white rounded-full border border-primary border-b-3 border-b-orange-100 hover:bg-orange-200 hover:border-b-orange-300 transition-all duration-300">
                                    Dashboard
                                </button>
                            </div>
                            <div className="flex lg:hidden">
                                <button type="button" onClick={toggle} className="text-black focus:border-3 inline-flex justify-center items-center focus:rounded-md md:h-9 w-12.5 size-11 p-3.5 font-medium transition-all duration-300" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-offcanvas-MobileMenu" data-hs-overlay="#hs-offcanvas-MobileMenu">
                                    <Icon icon='tabler:menu' className="iconify text-2xl size-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div id="hs-offcanvas-MobileMenu" className={`${isTrue ? 'hs-overlay hs-overlay-open:translate-x-0 -translate-x-full fixed top-0 start-0 transition-all duration-300 transform h-full max-w-xs w-full z-80 bg-white border-e border-gray-200 open opened ' : 'hs-overlay hs-overlay-open:translate-x-0 -translate-x-full fixed top-0 start-0 transition-all duration-300 transform h-full max-w-xs w-full z-80 bg-white border-e border-gray-200 hidden'} `} role="dialog" tabIndex={-1} aria-labelledby="hs-offcanvas-MobileMenu-label">
                <div className="flex justify-center items-center py-3 px-4 border-b border-gray-200">
                    <Link href="/">
                                                <h2>HPV</h2>

                        {/* <Image width={168} height={30} src={logoDark} alt='logoDark' className="h-7.5" /> */}
                    </Link>
                </div>
                <div className="p-4 overflow-y-scroll h-full">
                    <Link href="#home" className="text-dark text-base flex items-center py-2.5 font-medium hover:underline">Home</Link>
                    <Link href="#feature" className="text-dark text-base flex items-center py-2.5 font-medium hover:underline">Feature</Link>
                    <Link href="#services" className="text-dark text-base flex items-center py-2.5 font-medium hover:underline">Services</Link>
                    <Link href="#team" className="text-dark text-base flex items-center py-2.5 font-medium hover:underline">Team</Link>
                    <Link href="#contact" className="text-dark text-base flex items-center py-2.5 font-medium hover:underline">Contact</Link>
                </div>
            </div>
            {
                isTrue ?
                    <div onClick={toggle} className='bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30'></div>
                    :
                    ''
            }
        </>

    )
}

export default TopBar