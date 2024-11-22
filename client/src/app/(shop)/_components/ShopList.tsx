"use client";
import { useGetAllShop } from "@/hooks/queries";
import { Vendor } from "@/prisma-types";
import Link from "next/link";

type Props = {};

const ShopList = (props: Props) => {
  const { data: getAllShopData, isPending: getAllShopPending } =
    useGetAllShop();
  return (
    <div>
      <div className="font-bold my-4">Shop List</div>
      <div className="flex flex-col gap-y-2">
        {getAllShopData?.map((shop: Vendor) => (
          <Link
            href={`/shop/${shop.id}`}
            className="font-medium px-6 py-1 bg-gray-300 capitalize rounded-md"
            key={shop.id}
          >
            {shop.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopList;


