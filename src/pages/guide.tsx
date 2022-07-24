import Header from "@/components/dom/Header";
import Head from "next/head";
import React from "react";

const Guide = () => {
  return (
    <>
      <Head>
        <title>{" < guide >"}</title>
      </Head>
      <Header />
      <p className="guide-paragraph">
        Welcome to lainTSX: a web-based, open source, English recreation of the
        underappreciated 1998 PlayStation game <i>Serial Experiments Lain</i>.
        In an interview with character designer Yoshitoshi Abe, he said that the
        game started development before the far better known anime of the same
        name, which means that SEL was intended to be a mixed media project.
        Unfortunately, the game never took off as well as its television
        counterpart and ended up getting left in the dust. Although you could
        experience either the game or the anime first, the game will make more
        sense if you have seen the anime and not so much vise-versa.
        <br />
        <br />
        As for how to actually play lainTSX, that’s a bit trickier to explain.
        This isn’t really a video game and I’d even struggle to call it a visual
        novel (although it is closer to the latter). The “gameplay” revolves
        around selecting files in a menu and eventually getting to experience
        all of them.
        <br />
        <br />
        The file types are:
        <br />
        Touko’s Diary (Tda) - Touko’s personal thoughts.
        <br />
        Lain’s Diary (Lda) - Lain’s personal thoughts.
        <br />
        Counseling (Cou) - Interactions between Touko and Lain.
        <br />
        Diagnosis (Dia) - Touko’s diagnosis of Lain.
        <br />
        Digital Camera (Dc) - Video clips.
        <br />
        Polytan (P2) - parts of Lain’s bear, Polytan.
        <br />
        Saisei-kun (SSkn) - upgrades needed to access more nodes.
        <br />
        Gate Passes (GaTE) - upgrades needed to access Site B.
        <br />
        Talk (TaK) - Random quotes by Lain.
        <br />
        <br />
        At the beginning, you’ll see an odd and clunky hub with a bunch of blue
        orbs. This is the main menu, so you better get used to it. Those orbs
        are called nodes, and they each represent a specific file. Blue nodes
        haven’t been assessed yet and grey nodes have. If a node you already
        went through is still blue, that means you haven’t actually
        listened/watched all of it. There’s a progress bar on the top right of
        the screen which will show how far you are into the clip, so I recommend
        checking that before leaving the file.
        <br />
        <br />
        If you try to access a node by selecting it, there’s a good chance
        you’ll be greeted with an animation of Lain either knocking on the node
        with no result, knocking on the node and falling on her face, or getting
        shot at with lasers coming from the node. This is the only real puzzle
        that the game provides you with. What you need to do is access all the
        SSkn files in numerical order, meaning that you’re gonna have to search
        through four of these nodes starting from the very bottom of the map.
        There are also six P2 files, and after accessing them all you will
        unlock two more files. The GaTE files are the last collectable, and
        collecting all four will unlock Site B; Site B is another area that can
        be accessed by going to the menu and selecting “Change”, although I
        wouldn’t recommend doing this quite yet.
        <br />
        <br />
        Now that you have all these files at your disposal, you’re probably
        extremely overwhelmed. “Oh no,” you might be saying to yourself. “How
        will I be able to experience this story in a streamlined, linear order?”
        Try as much as you want to go in a straightforward path, but the game
        will constantly discourage you. There is no direct order to experience
        everything in, even with the individual files being numbered and each
        level being a direct progression from the last. Even having gone through
        all the collectibles and upgrades, there’s still a ton of stuff you
        haven’t yet unlocked. As you chug through the game, more and more files
        will pile up. On top of this, each audio file contains three key words
        of literal or thematic importance, and each word brings you to a file
        that will most likely be on a completely different level. I strongly
        believe that part of the artistic vision behind this game was to have
        players jump around the map and experience it in their own unique order
        through whichever key words or plot elements they find themselves most
        interested in. Take this however you want and go through the files in
        whatever way you find the most engaging. Personally, I took full
        advantage of this unique system and found myself loving the game even
        more for it. It becomes a bit tedious when you only have a few nodes
        left since you’re booted so often to files you’ve already gone through,
        so at that point I just directly exited out of files after listening to
        them and selected the blue node closest to me.
        <br />
        <br />
        Once every single node on all twenty-two levels has become gray, it’s
        time for you to go to Site B! This is a direct continuation of the story
        in Site A, and there are only thirteen levels this time around. There
        are no P2 or GaTE files in Site B, but you will have to find three more
        SSkn files before you can freely access everything you see. There’s also
        a one-shot manga called Serial Experiments Lain: The Nightmare of
        Fabrication that takes place sometime during the events of Site B, so
        you’re gonna want to read that.
        <br />
        <br />
        <br />
        Everything below this line is post-game, so you should have watched the
        ending before reading this final paragraph.
        <br />
        After watching the final cutscene and pressing continue, you will be
        booted back to Site A. This time, there are a ton of added blue nodes!
        While some of these are useful or add to the story, there’s a new file
        type labeled TaK which is pretty much just a five-second quote from
        Lain. A majority of these new nodes are TaK files, making the post-game
        an absolutely tedious grind. If you want to unlock even more stuff, you
        will have to go through each and every one of these; there are
        one-hundred and twenty-one in total, counting those on both sites. After
        all your nodes are gray once again, watch the ending and you’ll get the
        remaining nodes—sixty-one of which are more TaK files. You get very,
        very few important files. If you grind your way through all of these and
        watch the ending once again, you’ll get… nothing. This is it. You’re
        done. Yeah, the post-game isn’t great to say the least, so you decide if
        you’re Lain enough to complete it.
      </p>
    </>
  );
};

export default Guide;
