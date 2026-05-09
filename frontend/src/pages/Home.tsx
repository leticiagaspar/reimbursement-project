import { Box } from "@chakra-ui/react";
import { Navbar } from "../components/home/Navbar";
import { Hero } from "../components/home/Hero";
import { Footer } from "../components/home/Footer";

export default function Home() {
  return (
    <Box bg="#0d1f4e" minH="100vh">
      <Navbar />
      <Hero />
      <Footer />
    </Box>
  );
}
