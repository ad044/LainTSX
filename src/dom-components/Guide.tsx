import React, { useEffect } from "react";
import Header from "./Header";
import "../static/css/guide.css";

const Guide = () => {
  useEffect(() => {
    document.title = "< guide >";
  }, []);

  return (
    <>
      <Header />
      <p className="guide-paragraph">
        <br /> A bit of a disclaimer - as stated on the main page, these are
        entirely my thoughts from observations while developing the game, some
        of the information may be innacurate. <br /> <br />
        First, let's get this out of the way - Serial Experiments Lain PSX isn't
        a "game" in a traditional sense, it's more like a visual novel which you
        piece together yourself. The story revolves around Lain and her
        interactions with her psychiatrist - Touko.
        <br /> <br />A common misconception about the game is that there's no
        specific order, and that you just randomly watch stuff and come up with
        an explanation yourself. From what I've noticed, this is not entirely
        true. Let me explain:
        <br />
        <br />
        The blue orbs that you navigate through (we'll call those blue orbs
        "nodes" from now on) contain either:
        <br />
        <br />
        A. Media (audio/video)
        <br />
        B. Collectibles
        <br />
        C. Upgrades
        <br />
        <br />
        There are also multiple "types" of nodes. You can tell them apart by
        their names and icons.
        <br />
        Here's a basic list of these nodes according to their names in their
        respective categories:
        <br />
        <br />A category (Media) - Tda, Lda, Dia, Cou, TaK, Dc
        <br />B category (Collectibles) - P2
        <br />C category (Upgrades) - SSkn, GaTE
        <br /> <br />
        Let's step through each of these one by one:
        <br />
        <br />
        Category A - Media:
        <br /> Tda - Touko's diary - Touko's personal thoughts.
        <br />
        Lda - Lain's diary - Lain's personal thoughts.
        <br />
        Dia - Diagnosis - Lain's diagnosis after their interactions, provided by
        Touko.
        <br />
        Cou - Counseling - Lain and Touko's interactions.
        <br />
        TaK - Not sure what TaK stands for - Random quotes by Lain.
        <br />
        Dc - Videos.
        <br />
        <br />
        This is where the no-real-order issue comes into play - each of these
        separate types are put in chronological order, meaning After Lda001
        comes Lda002, then Lda003, etc. This is identical for every other node
        type I mentioned. <br /> <br />
        What might lead some people to believe that there is no real order is
        that the way you UNLOCK them may not be entirely chronological, for
        example, the first node you'll most likely interact with from Tda is
        Tda028, since that's the closest to where you start from at the
        beginning of the game.
        <br /> <br />
        There's also another issue - despite these separate types being put in a
        specific order, it is unclear how they interact with each other. For
        example, there is no way (to my knowledge) to tell which Cou comes after
        which Lda judging by their names alone. What might help here are the
        "words" you select while you play them (on the right hand side there are
        3 floating things on each audio node which you can select).
        <br /> <br />
        Category B - Collectibles: <br />
        P2 - Polytan - You collect parts of Lain's bear, after you collect all
        the pieces, 2 extra idle media files become available.
        <br /> <br />
        Category C - Upgrades:
        <br />
        SSkn - Saisei-kun (roughly translates to Mr. Recovery) - The main
        upgrade inside the game. Some nodes have an "upgrade requirement" that
        you need to meet to be able to view them, the way you do that is by
        collecting these. So, the next time you see Lain try to knock on a node
        and fall over, know that you need to collect more SSkn nodes.
        <br />
        GaTE - Gate (I guess) - A "gate pass" as the game calls it - after
        collecting all of them, you unlock Site B, which contains more nodes and
        is the place where you continue the story.
        <br /> <br />
      </p>
    </>
  );
};

export default Guide;
