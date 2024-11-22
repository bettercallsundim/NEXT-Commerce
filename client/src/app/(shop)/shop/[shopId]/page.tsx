import React from "react";

type Props = {};

const page = ({ params }) => {
  console.log("🚀 ~ page ~ params:", params);
  return <div>page</div>;
};

export default page;
