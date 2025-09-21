import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"]
      },
      colors: {
        petal: {50:"#fbf9fb",100:"#f7f1f7",200:"#efe3ee",300:"#e6d3e4",400:"#d7b9d2",500:"#c699bd",600:"#b27fa6",700:"#916684",800:"#6f4e64",900:"#584051"},
        blush: {50:"#fff7f7",100:"#ffecec",200:"#ffd9db",300:"#ffc0c4",400:"#ffa2a9",500:"#ff8791",600:"#f56e7a",700:"#d95567",800:"#b04354",900:"#8c3745"},
        sage:  {50:"#f5faf7",100:"#eaf5ef",200:"#d3ecdf",300:"#b7dfcb",400:"#94ceb2",500:"#73b797",600:"#589a7d",700:"#467a64",800:"#3a6452",900:"#2f5143"},
        cream: {50:"#fffefb",100:"#fffaf0",200:"#fff2d9",300:"#ffe8ba",400:"#ffd98c",500:"#fccb66",600:"#e2b04b",700:"#b88b39",800:"#976f30",900:"#7c5a29"}
      },
      boxShadow: {
        soft: "0 20px 60px rgba(30, 27, 75, 0.08)",
        ring: "0 0 0 8px rgba(244, 240, 248, 0.8)",
        glow: "0 10px 30px rgba(158, 140, 181, 0.35)"
      },
      borderRadius: {
        xl2: "1.25rem",
        blob: "40% 60% 60% 40% / 45% 35% 65% 55%"
      },
      backdropBlur: {
        6: "6px"
      }
    },
  },
  plugins: [],
} satisfies Config;
