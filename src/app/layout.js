import { Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Docs from "@/components/Docs";
import Footer from "@/components/Footer";

import { ContractProvider } from "../../Context";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Stakeitup",
  description: "Stake and Earn platform on polygon amoy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <body className={inter.className}>
        <ContractProvider>
          <Header />
          <HeroSection />
          
          {children}
          
          <Docs />
          <Footer />
        </ContractProvider>
      </body>
    </html>
  );
}
