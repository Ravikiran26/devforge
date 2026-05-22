import React from "react";
import { ContainerScroll } from "./container-scroll-animation";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Build real products with <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                DevForge
              </span>
            </h1>
          </>
        }
      >
        <img
          src="https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=1400&q=80"
          alt="DevForge dashboard preview"
          className="mx-auto rounded-2xl object-cover h-full w-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
