// src/App.tsx
import Header from "./components/Header";
import Homepage from "./components/homepage/Homepage";

export default function App() {
  return (
    <div className="min-h-screen bg-petal-50 text-stone-800 antialiased">
      <Header />
      <Homepage />
    </div>
  );
}
