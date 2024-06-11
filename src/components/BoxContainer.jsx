import { Box } from "@mui/material"

export const BoxContainer = ({ children, sx }) => {
  return(
    <>
      <Box
        noValidate
        autoComplete="off"
        width="100%"
        sx={{
          p: { xs: "1rem", sm: "2rem" },
          borderRadius: "15px",
          color: "black",
          ...sx,
        }}
      >
        { children }
      </Box>
    </>
  )
}