import React from "react";
import Box from "@mui/material/Box";
import { useBlitoadzRendererContract } from "../../hooks/useBlitoadzRendererContract";
import { useBlitoadzContract } from "../../hooks/useBlitoadzContract";

const OPENSEA_ADDRESS =
  process.env.REACT_APP_NETWORK === "rinkeby"
    ? "https://testnets.opensea.io"
    : "https://opensea.io";

type YourBlitoadzProps = {
  ids: number[];
};

function YourBlitoadz({ ids }: YourBlitoadzProps) {
  return (
    <Box sx={{ padding: "12px", marginBottom: "48px" }}>
      <Box
        sx={{
          fontSize: "32px",
          marginBottom: "24px",
          textAlign: "center",
          fontWeight: 600,
        }}
      >
        Your Blitoadz
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {ids.map((id) => (
          <YourBlitoadzImage key={id} id={id} />
        ))}
      </Box>
    </Box>
  );
}

type YourBlitoadzImageProps = {
  id: number;
};

function YourBlitoadzImage({ id }: YourBlitoadzImageProps) {
  const { address, extractOriginalIdsFromBlitoadzId } = useBlitoadzContract();
  const { getSvg } = useBlitoadzRendererContract();
  const [image, setImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    extractOriginalIdsFromBlitoadzId(id).then(({ blitmapId, toadzId }) => {
      if (blitmapId !== null && toadzId !== null) {
        getSvg(blitmapId, toadzId).then(setImage);
      }
    });
  }, [id, getSvg, extractOriginalIdsFromBlitoadzId]);

  return (
    <Box
      sx={{
        margin: "4px",
        "& .link": {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none",
          color: "#485fc7",
          border: "2px solid black",
          padding: "4px",
          position: "relative",

          "::before": {
            content: '""',
            height: "3px",
            width: "3px",
            backgroundColor: "black",
            position: "absolute",
            top: "-5px",
            right: "-5px",
          },

          "&:hover": { color: "black" },
        },
        "& .image": { maxWidth: "86px" },
      }}
    >
      <a
        href={`${OPENSEA_ADDRESS}/assets/${address}/${id}`}
        target="_blank"
        rel="noreferrer"
        className="link"
      >
        {image && (
          <img
            className="image"
            src={`data:image/svg+xml;utf8,${image}`}
            alt="result"
          />
        )}
        <Box sx={{ fontSize: "16px", fontWeight: 600, marginTop: "4px" }}>
          #{id}
        </Box>
      </a>
    </Box>
  );
}

export default YourBlitoadz;
