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
  const { mint, isMinting } = useBlitoadzContract();
  const { getSvg } = useBlitoadzRendererContract();

  const [image, setImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (blitmapId !== undefined && toadzId !== undefined) {
      getSvg(blitmapId, toadzId).then(setImage);
    } else {
      setImage(null);
    }
  }, [blitmapId, toadzId]);

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
        {blitmapId !== undefined && blitmap[blitmapId].name}{" "}
        {toadzId !== undefined &&
          ((toadz[toadzId].attributes.find((attr) => attr.trait_type === "Name")
            ?.value as string) ||
            toadz[toadzId].name)}
      </Box>
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
          <button
            style={{
              fontSize: "24px",
              fontWeight: 700,
              backgroundColor: "rgb(127, 254, 168)",
              color: "black",
              boxShadow: "none",
              padding: "11px 24px",
              border: 0,
              borderRadius: "4px",
              height: "60px",
              cursor: "pointer",
              width: "100%",
            }}
            onClick={() => console.log("mint")}
          >
            Mint
          </button>
          {image && (
            <Box
              sx={{
                marginTop: "16px",

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
  );
}

export default Result;
