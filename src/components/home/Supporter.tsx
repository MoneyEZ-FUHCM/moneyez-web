import Digital from "@/assets/images/logo/digital_ocean.png";
import Firebase from "@/assets/images/logo/firebase.png";
import Gemini from "@/assets/images/logo/gemini.png";
import Google from "@/assets/images/logo/google.png";
import Microsoft from "@/assets/images/logo/microsoft.png";
import { Divider } from "antd";
import Image from "next/image";

const imageSources = [Firebase, Google, Digital, Gemini, Microsoft];

const Supporter = () => {
  return (
    <section className="w-full px-4">
      <div className="flex flex-col items-center">
        <Divider />
        <div className="grid w-full grid-cols-2 place-items-center gap-6 md:grid-cols-3 lg:grid-cols-5">
          {imageSources.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Logo ${index + 1}`}
              width={120}
              height={120}
              quality={80}
              className={`max-w-[100px] object-contain md:max-w-[120px]`}
            />
          ))}
        </div>
      </div>
      <Divider />
    </section>
  );
};

export { Supporter };
