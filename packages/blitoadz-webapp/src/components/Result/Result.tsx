import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { blitmap } from "../../blitmap";
import { toadz } from "../../toadz";
import { useBlitoadzContract } from "../../hooks/useBlitoadzContract";
import { useBlitoadzRendererContract } from "../../hooks/useBlitoadzRendererContract";

type ResultProps = {
  toadzId?: number;
  blitmapId?: number;
  sx?: BoxProps["sx"];
};

function Result({ blitmapId, toadzId, sx }: ResultProps) {
  const { mint, isMinting, hasBeenMinted, blitoadzExists } =
    useBlitoadzContract();
  const { getSvg } = useBlitoadzRendererContract();

  const [image, setImage] = React.useState<string | null>(null);
  const [exists, setExists] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (blitmapId !== undefined && toadzId !== undefined) {
      getSvg(blitmapId, toadzId).then(setImage);
      blitoadzExists(toadzId, blitmapId).then(setExists);
    } else {
      setImage(null);
    }
  }, [blitmapId, toadzId, blitoadzExists, getSvg]);

  const minted = React.useMemo(
    () =>
      blitmapId !== undefined &&
      toadzId !== undefined &&
      hasBeenMinted(toadzId, blitmapId),
    [blitmapId, toadzId, hasBeenMinted]
  );

  return (
    <Box sx={{ padding: "12px", ...sx }}>
      <Box
        sx={{
          textAlign: "center",
          fontSize: "32px",
          fontWeight: 600,
          marginBottom: "24px",
        }}
      >
        {toadzId !== undefined &&
          ((toadz[toadzId].attributes.find((attr) => attr.trait_type === "Name")
            ?.value as string) ||
            toadz[toadzId].name)}{" "}
        {blitmapId !== undefined && blitmap[blitmapId].name}
      </Box>
      <Box
        sx={{
          border: "2px solid black",
          padding: "8px",
          position: "relative",

          "::before": {
            content: '""',
            height: "8px",
            width: "8px",
            backgroundColor: "black",
            position: "absolute",
            top: "-10px",
            right: "-10px",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ flex: 1 }}>
            {toadzId !== undefined && (
              <img
                alt={
                  (toadz[toadzId].attributes.find(
                    (attr) => attr.trait_type === "Name"
                  )?.value as string) || toadz[toadzId].name
                }
                src={toadz[toadzId].image}
                style={{ width: "100%" }}
              />
            )}
          </Box>
          <Box
            sx={{
              fontFamily: "Snap ITC",
              flex: 1,
              textAlign: "center",
              fontSize: "96px",
              lineHeight: "144px",
              fontWeight: 400,
            }}
          >
            +
          </Box>
          <Box sx={{ flex: 1 }}>
            {blitmapId !== undefined && (
              <img
                alt={`blitmap #${blitmapId}`}
                src={blitmap[blitmapId].image}
                style={{ width: "100%" }}
              />
            )}
          </Box>
        </Box>
        {blitmapId !== undefined && toadzId !== undefined && (
          <Box sx={{ marginTop: "24px" }}>
            {!exists && !minted && (
              <button
                style={{
                  fontFamily: '"Press Start 2P", "system-ui"',
                  fontSize: "24px",
                  fontWeight: 700,
                  backgroundColor: "rgb(163,131,250)",
                  background:
                    "linear-gradient(90deg, rgba(163,131,250,1) 35%, rgba(158,203,250,1) 100%)",
                  color: "white",
                  boxShadow: "none",
                  padding: "11px 24px",
                  borderRadius: "4px",
                  height: "60px",
                  cursor: "pointer",
                  width: "100%",
                  border: "1px solid black",
                }}
                onClick={() => mint(toadzId, blitmapId)}
              >
                Mint
              </button>
            )}
            {exists && !minted && (
              <Box
                sx={{
                  marginTop: "24px",
                  fontSize: "24px",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                This pair has already been minted.
              </Box>
            )}
            {isMinting && (
              <Box
                sx={{
                  marginTop: "24px",
                  fontSize: "24px",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Minting...
              </Box>
            )}
            {minted && (
              <Box
                sx={{
                  marginTop: "24px",
                  fontSize: "24px",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Congratulations! Your Blitoadz has been successfully minted
              </Box>
            )}
            {image && (
              <Box
                sx={{
                  marginTop: "32px",

                  "& .result": {
                    width: "100%",
                  },
                }}
              >
                <img
                  className="result"
                  src={`data:image/svg+xml;utf8,${image}`}
                  alt="result"
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Result;
