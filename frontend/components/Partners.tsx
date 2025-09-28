import Image from "next/image";

const partners = [
  { name: "Self Protocol", logo: "/assets/partners/self-protocol.png" },
  { name: "The Graph", logo: "/assets/partners/the-graph.svg" },
  { name: "World", logo: "/assets/partners/world.svg" },
  { name: "Self Protocol", logo: "/assets/partners/self-protocol.png" },
  { name: "The Graph", logo: "/assets/partners/the-graph.svg" },
  { name: "World", logo: "/assets/partners/world.svg" },
];

const Partners = () => {
  return (
    <section
      className="bg-primary py-4 bg-cover"
      style={{ backgroundImage: `url("/assets/hero/1.png")` }}
    >
      <div className="overflow-hidden relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {partners.concat(partners).map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex-shrink-0 w-32 md:w-48 mx-8"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={150}
                height={50}
                className="object-contain h-10 md:h-20"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
