import toast from "react-hot-toast";

export const success = (msg:string) => toast.success(msg);
export const error = (msg:string) => toast.error(msg);
