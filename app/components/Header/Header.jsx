import ProfileButton from "@UI/ProfileButton";
import MobileNavbar from "@components/MobileNavbar";
import Navbar from "@components/Header/Navbar";
import ThemeToggler from "./ThemeToggler";
import Filter from "@components/Filter";
const Header = () => {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <Navbar />
        <MobileNavbar />
        <div className="flex flex-1 items-center justify-end  space-x-2 ">
          <nav className="flex items-center">
            <Filter />
            <ThemeToggler />
            <ProfileButton />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
