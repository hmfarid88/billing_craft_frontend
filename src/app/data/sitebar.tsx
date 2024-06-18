

import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { RiSecurePaymentLine } from "react-icons/ri";
import { GoDatabase } from "react-icons/go";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlinePayments } from "react-icons/md";
import { PiNotebook } from "react-icons/pi";
import { VscRepo } from "react-icons/vsc";
import { MdOutlineInterests } from "react-icons/md";
import { GrUserAdmin } from "react-icons/gr";
export const sitebarData = [
    {
        id: 1,
        icon: <IoHomeOutline size={20} />,
        name: "HOME",
        link: "/dashboard"
    },
    {
        id: 2,
        icon: <MdOutlineShoppingCartCheckout size={20} />,
        name: "PRODUCT ENTRY",
        link: "/purchase"
    },
    {
        id: 3,
        icon: <HiOutlineShoppingBag size={20} />,
        name: "PRODUCT SALE",
        link: "/sale"
    },
    {
        id: 4,
        icon: <RiSecurePaymentLine size={20} />,
        name: "PAYMENT ENTRY",
        link: "/pages/payment"
    },
    {
        id: 6,
        icon: <GoDatabase size={20} />,
        name: "STOCK REPORT",
        link: "/stockreport"
    },
    {
        id: 7,
        icon: <TbReportSearch size={20} />,
        name: "SALE REPORT",
        link: "/salereport"
    },
    {
        id: 8,
        icon: <MdOutlinePayments size={20} />,
        name: "PAYMENT REPORT",
        link: "/pages/paymentreport"
    },
    {
        id: 9,
        icon: <PiNotebook size={20} />,
        name: "LEDGER BOOK",
        link: "/pages/ledgerbook"
    },
    {
        id: 10,
        icon: <VscRepo size={20} />,
        name: "CASH BOOK",
        link: "/pages/cashbook"
    },
    {
        id: 11,
        icon: <MdOutlineInterests size={20} />,
        name: "PROFIT / LOSS",
        link: "/pages/profitloss"
    },
    {
        id: 12,
        icon: <GrUserAdmin size={20} />,
        name: "ADMINSTRATION",
        link: "/pages/adminstration"
    }

]