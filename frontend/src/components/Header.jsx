import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { LogOut } from "lucide-react";

const Header = () => {
  const { authUser, logout } = useAuthStore(); // get logout function
  const navigate = useNavigate();

  const profileImage = authUser?.profilePic || "/avatar.png";

  const handleAvatarClick = () => {
    if (authUser) navigate("/profile");
    else navigate("/login");
  };

  const handleLogout = async () => {
    await logout(); // clear auth state + call backend if implemented in store
    navigate("/"); // redirect to login
  };

  return (
    <header className="flex items-center justify-between border-b border-b-[#283039] px-10 py-3 bg-[#111418]">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-white">
          <svg className="size-6" fill="none" viewBox="0 0 48 48">
            {/* Logo paths */}
          </svg>
          <h1 className="text-white text-xl font-bold tracking-tight">CineVerse</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-gray-300">
          <a href="#">Home</a>
          <a href="#">Movies</a>
          <a className="text-white" href="#">Reviews</a>
          <a href="#">Community</a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {authUser && (
          <button onClick={handleLogout} className="text-gray-300 hover:text-white">
            <LogOut className="w-6 h-6" />
          </button>
        )}
        <div
          className="bg-center bg-no-repeat bg-cover rounded-full size-10 h-10 w-10 cursor-pointer"
          style={{ backgroundImage: `url(${profileImage})` }}
          onClick={handleAvatarClick}
        ></div>
      </div>
    </header>
  );
};

export default Header;
