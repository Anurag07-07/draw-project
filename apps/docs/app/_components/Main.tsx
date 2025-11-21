import Image from "next/image";
import Link from "next/link";

import Pencil from '../../public/Silhouette_quill_writing_curves___Premium_Vector-removebg-preview.png'

const Main = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/myvideo.mp4" type="video/mp4" />
      </video>

      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-4xl font-bold">
        <div>EDUNAX DRAW APP</div>
        <div>DRAW THE</div>
        <div className="uppercase">Imagination</div>

        <Link href="/dashboard" className="mt-4 text-xl underline">
          Show Dashboard
        </Link>
      </div>
      <div>
        <Image src={Pencil} alt="logo"></Image>
      </div>

      <div className="absolute inset-0 bg-black/40 z-10"></div>
    </div>
  );
};

export default Main;
