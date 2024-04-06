"use client";
import React from "react";
import { Box, Text, Image, useColorModeValue } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { A11y, Navigation } from "swiper/modules";
import Link from "next/link";

// Mock data for the slider
const slidesData = [
  {
    title: "Soroswap",
    image: "/images/soroswap-dark.svg",
    href: "https://soroswap.finance",
    bg: "#000",
  },
  {
    title: "Meru",
    image: "/images/meru.svg",
    href: "https://getmeru.com",
    bg: "#FFF",
  },
  {
    title: "Mercury",
    image: "/images/mercury.png",
    href: "https://mercurydata.app/",
    bg: "#000",
  },
  {
    title: "Okashi",
    image: "/images/Okashi.svg",
    href: "https://okashi.dev/",
    bg: "#000",
  },
];

export const FeaturedSlider = () => {
  return (
    <Box position="relative" width="full">
      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={4}
        rewind={true}
        navigation={true}
        pagination={{ clickable: true }}
        loop
        autoplay
        mousewheel
      >
        {slidesData.map((slide, index) => (
          <SwiperSlide key={index}>
            <Link href={slide.href} target="_blank">
              <Box
                position="relative"
                height={40}
                width="full"
                bg={slide.bg}
                rounded={"xl"}
                p={4}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  objectFit="contain"
                  width="full"
                  height={132}
                />
              </Box>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};
