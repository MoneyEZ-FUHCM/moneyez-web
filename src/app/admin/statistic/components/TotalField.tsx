import Bag from "@/assets/images/icons/ic_glass_bag.png";
import Cart from "@/assets/images/icons/ic_glass_buy.png";
import User from "@/assets/images/icons/ic_glass_users.png";
import Revenue from "@/assets/images/icons/revenue.png";
import { AdminDashboardInfo } from "@/helpers/types/dashboard.type";
import Image from "next/image";
import CountUp from "react-countup";
import { TEXT_TRANSLATE } from "../statistic.translate";

interface TotalFieldProps {
  data: AdminDashboardInfo;
}

const TotalField = ({ data }: TotalFieldProps) => {
  const fields = [
    {
      icon: Cart,
      label: TEXT_TRANSLATE.TOTAL_FIELDS.BALANCE,
      value: data.revenue,
      suffix: "đ",
    },
    {
      icon: Revenue,
      label: TEXT_TRANSLATE.TOTAL_FIELDS.TRANSACTION,
      value: data.numOfOrders ?? 0,
    },
    {
      icon: Bag,
      label: TEXT_TRANSLATE.TOTAL_FIELDS.SPENDING_MODELS,
      value: data.numOfStores,
    },
    {
      icon: User,
      label: TEXT_TRANSLATE.TOTAL_FIELDS.USER,
      value: data.numOfUsers,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {fields &&
        fields.length > 0 &&
        fields?.map((field, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:translate-y-px hover:shadow-md"
          >
            <div className="flex items-center p-6">
              <div className="flex-shrink-0 rounded-lg p-3">
                <Image
                  src={field.icon}
                  alt={`${field.label} icon`}
                  width={50}
                  height={50}
                  quality={100}
                  className="h-14 w-14"
                />
              </div>
              <div className="ml-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">
                  {field.label}
                </p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-800">
                    <CountUp end={field.value} duration={2} separator="." />
                    {field.suffix && <span>{field.suffix}</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
    </section>
  );
};

export { TotalField };
