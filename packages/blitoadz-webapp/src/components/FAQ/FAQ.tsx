import React from "react";
import Box from "@mui/material/Box";
import { useMediaQuery } from "@mui/material";

function FAQ() {
  const isNarrow = useMediaQuery("(max-width:768px)");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px",
      }}
    >
      <Box
        sx={{
          padding: "24px",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            fontFamily: "Snap ITC",
            marginBottom: "24px",
            fontSize: isNarrow ? "48px" : "96px",
            lineHeight: "142px",
          }}
        >
          Blitoadz
        </Box>
        <Box
          sx={{
            marginBottom: "24px",
            fontSize: isNarrow ? "32px" : "48px",
            lineHeight: "54px",
            fontWeight: 600,
          }}
        >
          Frequently asked questions for the Blitzverse
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: "1185px",
          margin: "auto",
        }}
      >
        <Box>
          <h2>What are blitoadz?</h2>
          <p>
            Blitoadz are an on-chain collection of 5,600 unique NFTs. They are,
            effectively, blitzed Cryptoadz – the offspring of the 100 OG
            blitmaps and the 56 customized 1/1 Cryptoadz.
          </p>
        </Box>
        <Box>
          <h2>
            Wait – let's take this back a step can you tell me more about
            blitmap and Cryptoadz?
          </h2>
          <p>
            Blitmap all started with some pixel art. The NFT collection was
            created by dhof in early 2021 with original artwork from himself and
            16 other extremely talented artists in the NFT space. Blitmap
            catered for a unique minting experience, mixing the 100 original
            artworks to create 1,600 siblings and, ultimately, a full collection
            of 1,700 NFTs. Hashtag blitfam.
          </p>
          <p>
            Cryptoadz - The collection consists of 6,969 NFTs that were stealth
            launched in Sept 2021. The project sold out in ~15 minutes (yes, you
            read that correctly) - undoubtedly aided by the huge influence
            artist and creator GREMPLIN has in the NFT space. Cryptoadz
            currently reside in the Swamp.
          </p>
          <p>
            Consistent with the CC0 licensing, both projects have waived all
            copyright and related rights - as will blitoadz.
          </p>
        </Box>
        <Box>
          <h2>
            Wow wow wow - you say 6,6969 NFTS but CrypToadz actually has 7,025
            Toadz in the full collection?
          </h2>
          <p>
            Correct!! The ‘other’ 56 Toadz (numbered 1,000,000 to 56,000,000)
            were a customized set created separately to the main collection and
            were not intended to be part of the Cryptoadz mint process. Lacking
            a sense of belonging in the Swamp, they sought out the blitfam OGs
            and had a vision of a different future. Enter blitzverse.
          </p>
        </Box>
        <Box>
          <h2>How much is this mint gonna cost me?</h2>
          <p>
            Each individual mint will cost 0.056 ETH (+ gas fee which is not
            controllable by us).
          </p>
        </Box>
        <Box>
          <h2>Can I try before I buy?</h2>
          <p>
            You can! On our minting page you will effectively be creating your
            unique art piece before you mint the NFT. Steps:
          </p>
          <ul>
            <li>Choose one of the Cryptoadz compositions on the left.</li>
            <li>Click on a blitmap colour palette on the right.</li>
            <li>
              Decide if it’s for you before minting or repeating the steps.
              Easy!
            </li>
          </ul>
        </Box>
        <Box>
          <h2>When Roadmap?</h2>
          <p>
            Great question. We have a zillion ideas to thrash out and put on
            paper. What we can say is that it will be community driven, in every
            sense of the word. Our discord and Twitter page will be best placed
            for updates and announcements.
          </p>
        </Box>
        <Box>
          <h2>Ok then... can I have some Linkz?</h2>
          <p>Sure thing:</p>
          <p>
            Twitter:{" "}
            <a
              href="https://twitter.com/blitoadz"
              target="_blank"
              rel="noreferrer"
            >
              https://twitter.com/blitoadz
            </a>
          </p>
          <p>
            Discord:{" "}
            <a
              href="https://discord.gg/Zqrp8kewuk"
              target="_blank"
              rel="noreferrer"
            >
              https://discord.gg/Zqrp8kewuk
            </a>
          </p>
          <p>
            Website:{" "}
            <a href="https://Blitoadz.io" target="_blank" rel="noreferrer">
              https://Blitoadz.io
            </a>
          </p>
          <p>ENS: Blitoadz.ens</p>
        </Box>
        <Box>
          <h2>
            I always see people in Discord asking about a ‘Whitepaper’. Do you
            have one?
          </h2>
          <p>
            We have a PDF doc. Feel free to peruse this for a little more info
            around the project as a whole. We are agile. Things will be
            constantly changing and evolving. Again, Discord and Twitter will be
            your best bet for updates.
          </p>
          <p>****NEED TO INSERT DOC LATER***</p>
        </Box>
        <Box>
          <h2>Are you sure Blitoadz are stored on-chain?</h2>
          <p>
            Yes! All data will be stored fully on-chain. We have actually used
            the Blitmap contract as a template but had to encode the Cryptoadz
            artwork (at time of writing, Cryptoadz are not on- chain but we are
            confident they will be, soon). As a result, all of our artwork will
            be composable and is open to be used by the community, at will.
          </p>
        </Box>
        <Box>
          <h2>Err, you mention CC0 licensing. What’s that in English?</h2>
          <p>
            Basically, the project will be put in public domain. There’s no
            copyright. The contract and artwork are free to use how you feel,
            whether that be a derivative NFT project, clothing range, or opening
            a tattoo parlor (this is not life advice, hehe).
          </p>
        </Box>
        <Box>
          <h2>Do original artists get commission?</h2>
          <p>
            They do! 25% of all mint sales will be paid in commission to the
            original artists of blitmap and Cryptoadz. We, literally, wouldn’t
            be here without them.
          </p>
        </Box>
        <Box>
          <h2>Any other forms of giving back or rewarding holders?</h2>
          <p>
            There sure is. See our PDF doc (I mean whitepaper) above for some
            tasters. However, we want to strike a fine balance between growth
            and simple giveaways. This is where our experience will come in. If
            you want us to just ‘sweep the floor’ every week, you are looking at
            the wrong project. We are finally getting to put those college
            economics lessons to good use!
          </p>
        </Box>
        <Box>
          <h2>Are there royalty fees on secondary sales?</h2>
          <p>
            Yes. There will be a 5% royalty on secondary sales, part of which
            will go to the founding members of the team to incentivize further
            growth. The rest will go directly into a treasury wallet for future
            development and community incentives **you are going to want to
            watch this space**.
          </p>
        </Box>
        <Box>
          <h2>What's the contract address?</h2>
          <p>***TO BE ADDED LATER***</p>
        </Box>
      </Box>
    </Box>
  );
}

export default FAQ;
