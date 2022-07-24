import Head from "next/head";
import React from "react";
import Keybinding from "@/components/dom/Keybinding";
import Language from "@/components/dom/Language";
import Savefile from "@/components/dom/Savefile";
import Header from "@/components/dom/Header";

const Options = () => {
  return (
    <>
      <Head>
        <title>{" < options >"}</title>
      </Head>
      <Header />
      <Language />
      <hr />
      <Keybinding />
      <hr />
      <Savefile />
    </>
  );
};

export default Options;
