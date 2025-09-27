import { Icon } from '@iconify/react/dist/iconify.js'
import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
    <section
      id="home"
      className="relative before:content-[''] bg-body-bg before:absolute before:top-0 h-full before:left-[67%] before:bottom-0 before:right-0 before:bg-pink-100 py-20 md:py-0 bg-[length:85px_85px] bg-[linear-gradient(#ffefed_2px,transparent_2px),linear-gradient(to_right,#ffefed_2px,transparent_2px)] bg-repeat w-full"
    >
      <div className="container">
        <div>
          <div className="grid lg:grid-cols-12 gap-6 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5">
              <div className="py-1 px-2 border border-bg mb-6 inline-flex rounded-full items-center">
                <a
                  href="#"
                  className="bg-primary py-0.75 px-2 text-white rounded-full text-xs me-2"
                >
                  New
                </a>
                <p className="text-primary me-2 font-medium">
                  Anonymous Women’s Health Community
                </p>
                <Icon
                  icon="tabler:arrow-narrow-right"
                  className="iconify tabler--arrow-narrow-right text-primary size-4"
                />
              </div>
              <h1 className="mb-2 lg:text-4.0xl md:text-3.3xl text-2.7xl leading-tight">
                HPV Warriors DAO <br /> Breaking Stigma, Building Support
              </h1>
              <p className="text-secondary mb-4">
                A safe and anonymous space where women can ask questions, find
                trusted answers, and support each other through verified
                guidance — without fear, shame, or exposure.
              </p>

              <div className="flex gap-6 mt-6">
                <div className="gap-3.75 flex">
                  <div>
                    <Icon
                      icon="tabler:circle-check-filled"
                      className="iconify tabler--circle-check-filled text-green size-5"
                    />
                  </div>
                  <div>
                    <p className="text-dark font-medium"> Anonymous & Safe </p>
                  </div>
                </div>
                <div className="gap-3.75 flex">
                  <div>
                    <Icon
                      icon="tabler:circle-check-filled"
                      className="iconify tabler--circle-check-filled text-green size-5"
                    />
                  </div>
                  <div>
                    <p className="text-dark font-medium">
                      Verified Health Guardians
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-6">
                <button className="py-3 px-6.25 bg-primary text-white rounded-full border border-primary border-b-3 border-b-orange-100 hover:bg-orange-200 hover:border-b-orange-300 transition-all duration-300">
                  Learn About HPV
                </button>
                <button className="py-3 px-6.25 text-primary rounded-full border border-primary hover:bg-primary hover:text-white transition-all duration-300">
                  Join the Community
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-7 flex justify-center">
              <Image
                src="/assets/hero/2.png"
                width={800}
                height={800}
                alt="HPV Warriors illustration"
                className="max-w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
