import React from 'react';
import Image from 'next/image';

const Approach = () => {
  return (
    <div id="approach" className="bg-body-bg">
      <div className="max-w-5xl px-4 xl:px-0 py-10 lg:pt-20 lg:pb-20 mx-auto">
        <div className="max-w-3xl mb-10 lg:mb-14">
          <h2 className="text-dark font-semibold text-2xl md:text-4xl md:leading-tight">
            Our Approach
          </h2>
          <p className="mt-1 text-secondary">
            HPV Warriors DAO is built on privacy, trust, and empowerment. From
            raising awareness about HPV to creating a safe space for anonymous
            conversations, our strategy ensures women can seek support without
            fear or stigma.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-center">
          {/* Left Image */}
          <div className="aspect-w-16 aspect-h-9 lg:aspect-none">
            <Image
              className="w-full object-cover rounded-xl"
              src="/assets/Approach.jpg"
              alt="Supportive Women Community"
              width={480}
              height={600}
            />
          </div>

          {/* Right Steps */}
          <div>
            <div className="mb-4">
              <h3 className="text-primary text-xs font-medium uppercase">
                How It Works
              </h3>
            </div>

            {/* Step 1 */}
            <div className="flex gap-x-5 ms-1">
              <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-gray-200">
                <div className="relative z-10 size-8 flex justify-center items-center">
                  <span className="flex shrink-0 justify-center items-center size-8 border border-primary text-primary font-semibold text-xs uppercase rounded-full">
                    1
                  </span>
                </div>
              </div>
              <div className="grow pt-0.5 pb-8 sm:pb-12">
                <p className="text-sm lg:text-base text-secondary">
                  <span className="text-dark">Learn & Raise Awareness:</span>{' '}
                  Understand how HPV spreads, prevention through vaccination,
                  and why early awareness matters.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-x-5 ms-1">
              <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-gray-200">
                <div className="relative z-10 size-8 flex justify-center items-center">
                  <span className="flex shrink-0 justify-center items-center size-8 border border-primary text-primary font-semibold text-xs uppercase rounded-full">
                    2
                  </span>
                </div>
              </div>
              <div className="grow pt-0.5 pb-8 sm:pb-12">
                <p className="text-sm lg:text-base text-secondary">
                  <span className="text-dark">Join Anonymously:</span> Enter
                  the DAO via World App with full privacy — ask questions,
                  connect, and share experiences without revealing your identity.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-x-5 ms-1">
              <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-gray-200">
                <div className="relative z-10 size-8 flex justify-center items-center">
                  <span className="flex shrink-0 justify-center items-center size-8 border border-primary text-primary font-semibold text-xs uppercase rounded-full">
                    3
                  </span>
                </div>
              </div>
              <div className="grow pt-0.5 pb-8 sm:pb-12">
                <p className="text-sm md:text-base text-secondary">
                  <span className="text-dark">Verified Guardians:</span> Women
                  who get vaccinated can become trusted moderators through NFC +
                  Self Protocol, providing reliable and safe health guidance.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-x-5 ms-1">
              <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-gray-200">
                <div className="relative z-10 size-8 flex justify-center items-center">
                  <span className="flex shrink-0 justify-center items-center size-8 border border-primary text-primary font-semibold text-xs uppercase rounded-full">
                    4
                  </span>
                </div>
              </div>
              <div className="grow pt-0.5 pb-8 sm:pb-12">
                <p className="text-sm md:text-base text-secondary">
                  <span className="text-dark">Reward & Empower:</span> Helpful
                  contributions are tracked transparently with The Graph, and
                  women earn vouchers or stipends for their impact.
                </p>
              </div>
            </div>

            <a
              className="group inline-flex items-center gap-x-2 py-2 px-3 bg-primary font-medium text-sm text-white rounded-full focus:outline-hidden"
              href="#"
            >
              Join the Movement
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Approach;
