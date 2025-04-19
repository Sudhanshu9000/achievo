import Image from "next/image";
import MainPage from "./home/page";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
     <MainPage/>
    </div>
  );
}