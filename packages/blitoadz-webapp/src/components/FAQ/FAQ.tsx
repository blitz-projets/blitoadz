import React from "react";
import Box from "@mui/material/Box";
import { useMediaQuery } from "@mui/material";
import { useBlitoadzContract } from "../../hooks/useBlitoadzContract";
import config from "../../config";

function FAQ() {
  const isNarrow = useMediaQuery("(max-width:768px)");
  const { address } = useBlitoadzContract();
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
            fontSize: isNarrow ? "24px" : "32px",
            lineHeight: "54px",
            fontWeight: 600,
          }}
        >
          Frequently asked questions for the blitzverse
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: "1185px",
          margin: "auto",

          "& .question": {
            marginBottom: "48px",
          },

          "& .question h2": {
            fontSize: "18px",
          },

          "& .question p": {
            fontFamily: "system-ui",
          },

          "& .question li": {
            fontFamily: "system-ui",
          },
        }}
      >
        <Box className="question">
          <h2>What are blitoadz?</h2>
          <p>
            Blitoadz is an on-chain collection of 5,600 unique NFTs. They are,
            effectively, blitzed CrypToadz – the offspring of the 100 OG
            blitmaps and the 56 customized 1/1 CrypToadz.
          </p>
        </Box>
        <Box className="question">
          <h2>
            Wait – take this back a step. Tell me more about blitmap and
            CrypToadz?
          </h2>
          <p>
            Blitmap all started with some pixel art. The NFT collection was
            created by dhof in early 2021 with original artwork from himself and
            16 other extremely talented artists in the NFT space. Blitmap
            catered for a unique minting experience, mixing the 100 original
            artworks to create 1,600 siblings and, ultimately, a full collection
            of 1,700 NFTs - #blitfam.
          </p>
          <p>
            The CrypToadz collection consists of 6,969 NFTs that were stealth
            launched in Sept 2021. The project sold out in ~15 minutes (yes, you
            read that correctly) - undoubtedly aided by the huge influence
            artist and creator GREMPLIN has in the NFT space. CrypToadz
            currently reside in the Swamp.
          </p>
          <p>
            Consistent with the CC0 licensing, both projects have waived all
            copyright and related rights - as will blitoadz.
          </p>
        </Box>
        <Box className="question">
          <h2>
            Hold on - you say 6,969 NFTs but doesn’t CrypToadz have 7,025 Toadz
            in the full collection?
          </h2>
          <p>
            It does! The ‘other’ 56 Toadz were a special customized set, created
            separately to the main collection and were not intended to be part
            of the Cryptoadz mint process . With such prestige, they sought out
            the blitfam OGs and had a vision of a more expansive future. Enter
            the blitzverse.
          </p>
        </Box>
        <Box className="question">
          <h2>How much is this mint gonna cost me?</h2>
          <p>
            Each individual mint will cost 0.056 ETH (+ gas fee which is not
            controllable by us).
          </p>
        </Box>
        <Box className="question">
          <h2>Can I try before I buy?</h2>
          <p>
            You can! On our home page you will be creating your own unique art
            piece before you mint the NFT. Just follow these simple steps:
          </p>
          <ol>
            <li>Choose one of the CrypToadz compositions on the left</li>
            <li>Click on a blitmap color palette on the right</li>
            <li>
              Use the 'Flip Colors' randomizer if you want to invert the colors
              (you can do this multiple times)
            </li>
            <li>Mint! ...or.... repeat these steps. Easy!</li>
          </ol>
          <p>
            Each composition and color palette combination can only be used once
            - so please choose wisely.
          </p>
        </Box>
        <Box className="question">
          <h2>When ToadMap?</h2>
          <p>
            Great question. We have quite a few ideas to thrash out and put on
            paper. What we can say is that if & when there is a ToadMap - it
            will be community driven, in every sense of the word. Our discord
            and Twitter page will be best placed for updates and announcements.
            In the meantime, feel free to simply enjoy the art.
          </p>
        </Box>
        <Box className="question">
          <h2>Ok then... can I have some Linkz?</h2>
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
          {address && (
            <p>
              Etherscan:{" "}
              <a
                href={`${config.app.etherScanBaseUrl}/address/${address}`}
                target="_blank"
                rel="noreferrer"
              >
                {`${config.app.etherScanBaseUrl}/address/${address}`}
              </a>
            </p>
          )}
          {process.env.REACT_APP_OPENSEA_URL && (
            <p>
              Opensea:{" "}
              <a
                href={process.env.REACT_APP_OPENSEA_URL}
                target="_blank"
                rel="noreferrer"
              >
                {process.env.REACT_APP_OPENSEA_URL}
              </a>
            </p>
          )}
          <p>ENS: blitoadz.eth</p>
        </Box>
        <Box className="question">
          <h2>
            I always see people in Discord asking about a ‘Whitepaper’. Do you
            have one?
          </h2>
          <p>
            We have a PDF doc, if that helps? Feel free to peruse this for a
            little more info around the project as a whole. We are agile. Things
            will be constantly changing and evolving. Again, Discord and Twitter
            will be your best bet for updates.
          </p>
          <p>
            <a href="/blitoadz-whitepaper.pdf" target="_blank">
              Whitepaper
            </a>
          </p>
        </Box>
        <Box className="question">
          <h2>
            I see blitoadz are stored on-chain. What exactly does that mean?
          </h2>
          <p>
            This means that the metadata and images are all stored on the
            (Ethereum) blockchain. Therefore, no additional information needs to
            be retrieved from a centralized server or IPFS. The main advantage
            of this is permeance and our artwork / smart contract are
            composable.
          </p>
        </Box>
        <Box className="question">
          <h2>Err, you mention CC0 licensing. What’s that in English?</h2>
          <p>
            Basically, the project will be put in public domain. There’s no
            copyright. The contract and artwork are free to use how you feel -
            whether that be for a derivative NFT project, a new clothing range
            or even opening / branding a new tattoo parlor (note: this is not
            life advice - but keep us posted if you follow through)!
          </p>
        </Box>
        <Box className="question">
          <h2>Do original artists get commission?</h2>
          <p>
            They do! In our smart contract we have allocated 17% of mint sales
            commission to the 17 blitmap artists and 5.6% to the creator of the
            56 Cryptoadz. We (literally!) wouldn’t be here without them.
          </p>
        </Box>
        <Box className="question">
          <h2>What's the contract address?</h2>
          {address && (
            <p>
              <a
                href={`${config.app.etherScanBaseUrl}/address/${address}`}
                target="_blank"
                rel="noreferrer"
              >
                {address}
              </a>
            </p>
          )}
        </Box>
        <Box className="question">
          <h2>Any other forms of giving back or rewarding holders?</h2>
          <p>
            There sure is. See our PDF doc (I mean whitepaper) above for a tad
            more information. However, we want to strike a balance in what we
            see as a possible trade-off between sustained growth and continuous
            giveaways. This is where our experience will come in - finally
            getting to put those college Economics lessons to good use!
          </p>
        </Box>
        <Box className="question">
          <h2>Are there royalty fees on secondary sales?</h2>
          <p>
            Yes - there will be a 5% royalty on secondary sales, part of which
            will go to the founding members of the team to incentivize further
            growth. The rest will go directly into a treasury wallet for future
            development and community incentives **you are going to want to
            watch this space**.
          </p>
        </Box>
      </Box>
    </Box>
  );
}

export default FAQ;
