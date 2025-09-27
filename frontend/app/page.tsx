"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Hero from "@/components/Hero";

const Page = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      <Hero 
        title="HPV Warriors DAO"
        subtitle="An Anonymous Women's Health Community"
      />

      {/* Partners Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-6">
            In Partnership With
          </h2>
          <div className="flex justify-center items-center space-x-8">
            <p className="text-xl font-bold">Self Protocol</p>
            <p className="text-xl font-bold">World App</p>
            <p className="text-xl font-bold">The Graph</p>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">The Real Problem</h2>
          <p className="text-lg text-gray-600">
            Women won't discuss HPV openly due to stigma, misinformation
            spreads unchecked, there's no safe space for anonymous health
            discussions, peer educators work for free, and verified health
            info is inaccessible.
          </p>
        </div>
      </section>

      {/* The Solution Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">The Solution</h2>
            <p className="text-lg text-gray-600 mb-4">
              Our DAO provides a safe, anonymous space for women to discuss
              health issues, get verified information, and earn rewards for
              their contributions.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-2">✔</span>
                <p>
                  <span className="font-semibold">
                    Tier 1 - Verified Moderators:
                  </span>{" "}
                  "Health Guardians" are verified through a secure NFC process,
                  ensuring trustworthy information.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-2">✔</span>
                <p>
                  <span className="font-semibold">
                    Tier 2 - Anonymous Community Members:
                  </span>{" "}
                  Anyone can join anonymously to ask questions and share
                  experiences.
                </p>
              </li>
            </ul>
          </div>
          <div className="text-center">
            <Image
              src="/globe.svg"
              alt="Community"
              width={400}
              height={400}
            />
          </div>
        </div>
      </section>

      {/* How NFC Powers Trust Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">How NFC Powers Trust</h2>
          <p className="text-lg text-gray-600">
            A simple tap of an NFC wristband at a clinic instantly and
            anonymously verifies a user as a "Guardian," creating a foundation
            of trust without compromising privacy.
          </p>
        </div>
      </section>

      {/* Reward System Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Reward System</h2>
          <p className="text-lg text-gray-600 mb-8">
            The Graph tracks all contributions, and smart contracts
            automatically distribute rewards.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-2">Top Contributors</h3>
              <p>Brand vouchers for health products.</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-2">Verified Guardians</h3>
              <p>Monthly stipend for moderation work.</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-2">Referral Rewards</h3>
              <p>Bring new members, earn more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Works Section */}
      <section id="about" className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Why This Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-2">Stigma-Free</h3>
              <p>Nobody knows your identity, so you can speak freely.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Trust Without Exposure</h3>
              <p>
                NFC + Self Protocol = verified advice without revealing who you
                are.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Economic Incentives</h3>
              <p>Women get paid for their health education labor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prize Strategy Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Prize Strategy</h2>
          <p className="text-lg text-gray-600 mb-8">
            We're leveraging the best technology to build a robust and secure
            platform.
          </p>
          <div className="flex justify-center space-x-8">
            <div className="p-4 border rounded-lg">
              <p className="font-bold">Self Onchain SDK</p>
              <p>$9k</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-bold">World Mini App</p>
              <p>$10k</p>
            </div>
            <p className="font-bold">The Graph</p>
            <p>$5k</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-pink-400 to-purple-500 text-white text-center py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Join the Movement?
          </h2>
          <p className="text-lg mb-8">
            Become a part of a supportive community, get access to verified
            health information, and help us end the stigma around HPV.
          </p>
          <Button
            variant="secondary"
            className="text-lg font-semibold py-3 px-8"
          >
            Join HPV Warriors DAO
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Page;