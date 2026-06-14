import "./globals.css";
import Scene from "./components/Scene";
import Navbar from "./components/Navbar";
import GsapSnapper from "./components/GsapSnapper";
import ThemeController from "./components/ThemeController";
import Preloader from "./components/Preloader";

export const metadata = {
  title: "Nour Gamil — Creative Front-End Portfolio",
  description: "Premium portfolio for creative front-end, GSAP, Three.js, and interactive web experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Preloader />
        <Scene />
        <Navbar />
        <ThemeController />
        <GsapSnapper />
        {children}
      </body>
    </html>
  );
}
