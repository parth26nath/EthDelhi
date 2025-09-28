import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';

const servicesData = [
  {
    icon: 'tabler:speakerphone',
    title: 'Awareness Campaigns',
    description: 'We create accessible resources, workshops, and digital content to spread knowledge about HPV, vaccination, and women’s health.',
  },
  {
    icon: 'tabler:shield-lock',
    title: 'Anonymous Support Spaces',
    description: 'Through our DAO, women can ask questions, share experiences, and seek guidance without revealing their identity.',
  },
  {
    icon: 'tabler:user-check',
    title: 'Verified Health Guardians',
    description: 'Vaccinated members can become trusted community moderators, ensuring safe and accurate health information.',
  },
  {
    icon: 'tabler:award',
    title: 'Reward & Incentive Programs',
    description: 'Members are rewarded with vouchers, stipends, or digital tokens for contributing to awareness, moderation, and community growth.',
  },
  {
    icon: 'tabler:users-group',
    title: 'Community Partnerships',
    description: 'We collaborate with NGOs, health organizations, and women-led groups to expand outreach and impact.',
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-body-bg">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-dark font-semibold text-2xl md:text-4xl md:leading-tight mb-4">
            What We Offer
          </h2>
          <p className="text-secondary">
            HPV Warriors DAO provides a comprehensive ecosystem of support, education, and empowerment for women. Our services are designed to break the stigma surrounding HPV and create a safe, trusted community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center size-16 rounded-full bg-primary text-white mb-6">
                <Icon icon={service.icon} className="text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-dark mb-4">{service.title}</h3>
              <p className="text-secondary">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
