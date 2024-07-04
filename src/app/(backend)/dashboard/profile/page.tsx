import React from "react";
import dynamic from "next/dynamic";

const BasicInfo = dynamic(() => import("@/app/components/BasicInfo"), {
  ssr: false,
});

const Page = () => {
  return (
    <div>
      <BasicInfo />
    </div>
  );
};

export default Page;
