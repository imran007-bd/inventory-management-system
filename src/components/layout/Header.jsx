import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Layers,
  Package,
  Truck,
  ClipboardList,
  User,
  LogOut,
} from "lucide-react";
import Images from "../Images";
import Headlogo from "/src/assets/header logo.png";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const baseItem =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition text-gray-300 hover:bg-[#3CA07E] hover:text-white";

  const handleLink = () => {
    if (user.role === "admin") {
      navigate("/admindashboard");
    } else if (user.role === "manager") {
      navigate("/managerdashboard");
    } else if (user.role === "inventory_staff") {
      navigate("/staffdashboard");
    } else {
      navigate("/unauthorized");
    }
  };

  const canManageCatalog = user.role === "admin" || user.role === "manager";

  return (
    <aside className="w-64 h-screen bg-[#0C2B4E] fixed left-0 top-0 flex flex-col">
      
      {/* Logo */}
      <div className="px-6 py-8 border-b border-gray-800 flex justify-center">
        <Images className="w-16" imgSrc={Headlogo} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 text-sm" 
      onChange={handleLink}>
        <div onClick={handleLink} className={baseItem}>
          <Home size={25} /> Dashboard
        </div>

        {canManageCatalog && (
          <Link to="/categories" className={baseItem}>
            <Layers size={25} /> Categories
          </Link>
        )}

        <Link to="/products" className={baseItem}>
          <Package size={25} /> Products
        </Link>

        {canManageCatalog && (
          <Link to="/suppliers" className={baseItem}>
            <Truck size={25} /> Suppliers
          </Link>
        )}

        {canManageCatalog && (
          <Link to="/purchase" className={baseItem}>
            <ClipboardList size={25} /> Purchase
          </Link>
        )}

        <Link to="/profile" className={baseItem}>
          <User size={25} /> Profile
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg
          text-gray-300 hover:bg-[#3CA07E] hover:text-white transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Header;
