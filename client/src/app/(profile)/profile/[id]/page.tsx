import axios from "axios";
import { cookies } from "next/headers";
import Profile from "./Profile";
type Props = {};

const page = async (props: Props) => {
  // const cookie = await cookies();
  // const token = await cookie.get("token")?.value;
  // console.log("🚀 ~ page ~ nexttoken:", token);
  // const data = await fetch("http://localhost:4000/api/v1/user/authPersist", {
  //   method: "GET",
  //   credentials: "include",
  //   cache: "no-cache",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: "Bearer " + token, // Replace with your token
  //   },
  // });
  // const res = await data.json();

  // console.log("🚀 ~ pageeeeeee ~ data:", res);
  return <Profile />;
};

export default page;
