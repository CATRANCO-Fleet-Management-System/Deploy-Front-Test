import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FaUser,
    FaBus,
    FaChartBar,
    FaTruck,
    FaGasPump,
    FaCommentDots,
    FaWrench,
    FaMicrochip,
} from "react-icons/fa";

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { href: "/dashboard", icon: <FaChartBar />, label: "Dashboard" },
        { href: "/personnel", icon: <FaUser />, label: "Bus Personnel Management" },
        { href: "/bus-profiles", icon: <FaBus />, label: "Bus Profiles" },
        { href: "/devices", icon: <FaMicrochip />, label: "Device Management" },
        { href: "/bus-maintenance", icon: <FaWrench />, label: "Bus Maintenance Management" },
        { href: "/dispatch-monitoring", icon: <FaTruck />, label: "Dispatch Monitoring" },
        { href: "/fuel-monitoring", icon: <FaGasPump />, label: "Fuel Monitoring" },
        { href: "/feedback", icon: <FaCommentDots />, label: "Feedback" },
    ];

    const isActive = (href) => pathname.startsWith(href);

    return (
        <aside className="h-screen bg-gray-100 md:w-64 w-16 transition-width duration-300" aria-label="Sidebar">
            <div className="py-4 px-2 md:px-6">
    <Link href="/dashboard">
        <img
            src="/logo1.png"
            alt="Image Logo"
            className="mx-auto md:mx-0 object-contain h-16 md:mb-0 mb-4 cursor-pointer hidden sm:block"
        />
    </Link>
</div>

            <nav className="flex flex-col space-y-2 md:space-y-4 p-2 md:p-4">
                <ul className="space-y-3">
                    {menuItems.map(({ href, icon, label }) => (
                        <li key={href} className="relative">
                            <Link
                                href={href}
                                className={`flex items-center space-x-2 md:space-x-4 p-2 rounded-md transition-colors duration-200
                                    ${isActive(href) ? "text-violet-700 bg-gray-200" : "hover:text-violet-700"}`}
                            >
                                <span
                                    className={`text-2xl ${
                                        isActive(href) ? "text-violet-700" : "text-gray-500 group-hover:text-violet-700"
                                    }`}
                                >
                                    {icon}
                                </span>
                                <span
                                    className={`md:inline hidden text-sm md:text-base ${
                                        isActive(href) ? "text-violet-700" : "text-gray-500 group-hover:text-violet-700"
                                    }`}
                                >
                                    {label}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
