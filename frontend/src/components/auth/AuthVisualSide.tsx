import { Box, Flex, Grid } from "@chakra-ui/react";

const AuthVisualSide = () => {
  return (
    <Grid>
      <Flex
        display={{ base: "none", lg: "flex" }}
        position="relative"
        bg="#0d1f4e"
        bgImage="radial-gradient(at 65% 50%, rgba(16, 185, 129, 0.12) 0%, transparent 70%)"
        overflow="hidden"
        align="center"
        justify="center"
        p="64px"
        minH="100vh"
      >
        <Box
          position="absolute"
          inset="0"
          pointerEvents="none"
          opacity="0.05"
          bgImage={`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}
        />

        <Flex
          position="relative"
          zIndex="1"
          direction="column"
          align="center"
          gap="40px"
        >
          <Flex
            align="center"
            justify="center"
            w="280px"
            h="280px"
            borderRadius="full"
            border="1px solid rgba(16, 185, 129, 0.15)"
            bg="rgba(16, 185, 129, 0.02)"
            boxShadow="0 0 100px rgba(16, 185, 129, 0.05)"
          >
            <Flex
              align="center"
              justify="center"
              w="180px"
              h="180px"
              borderRadius="full"
              border="1px solid rgba(16, 185, 129, 0.3)"
              bg="rgba(16, 185, 129, 0.05)"
            >
              <Flex
                w="88px"
                h="88px"
                bg="#10b981"
                borderRadius="24px"
                align="center"
                justify="center"
                boxShadow="0 20px 40px rgba(16, 185, 129, 0.3)"
              >
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Grid>
  );
};

export default AuthVisualSide;
