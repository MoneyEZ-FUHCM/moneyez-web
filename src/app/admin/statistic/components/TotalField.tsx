import Bag from "@/assets/images/icons/ic_glass_bag.png";
import Cart from "@/assets/images/icons/ic_glass_buy.png";
import User from "@/assets/images/icons/ic_glass_users.png";
import Revenue from "@/assets/images/icons/revenue.png";
import { AdminDashboardInfo } from "@/types/dashboard.type";
import Image from "next/image";
import CountUp from "react-countup";

interface TotalFieldProps {
  data: AdminDashboardInfo;
}

const TotalField = ({ data }: TotalFieldProps) => {
  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:translate-y-px hover:shadow-md">
        <div className="flex items-center p-6">
          <div className="flex-shrink-0 rounded-lg bg-blue-50 p-3">
            <Image
              src={Cart}
              alt="Revenue icon"
              width={50}
              height={50}
              quality={100}
              className="h-12 w-12"
            />
          </div>
          <div className="ml-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">
              Doanh thu
            </p>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-800">
                <CountUp end={data.revenue} duration={2} separator="." />đ
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:translate-y-px hover:shadow-md">
        <div className="flex items-center p-6">
          <div className="bg-green-50 flex-shrink-0 rounded-lg p-3">
            <Image
              src={Revenue}
              alt="Orders icon"
              width={50}
              height={50}
              quality={100}
              className="h-12 w-12"
            />
          </div>
          <div className="ml-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">
              Giao dịch
            </p>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-800">
                <CountUp end={data.numOfOrders ?? 0} duration={2} />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:translate-y-px hover:shadow-md">
        <div className="flex items-center p-6">
          <div className="flex-shrink-0 rounded-lg bg-purple-50 p-3">
            <Image
              src={Bag}
              alt="Models icon"
              width={50}
              height={50}
              quality={100}
              className="h-12 w-12"
            />
          </div>
          <div className="ml-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">
              Mô hình
            </p>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-800">
                <CountUp end={data.numOfStores} duration={2} />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:translate-y-px hover:shadow-md">
        <div className="flex items-center p-6">
          <div className="flex-shrink-0 rounded-lg bg-amber-50 p-3">
            <Image
              src={User}
              alt="Users icon"
              width={50}
              height={50}
              quality={100}
              className="h-12 w-12"
            />
          </div>
          <div className="ml-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">
              Người dùng
            </p>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-800">
                <CountUp end={data.numOfUsers} duration={2} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { TotalField };
