import { ModeToggle } from "../components/mode-toggle";

const NavBar = () => {
  return (
    <div className="h-20 flex items-end justify-between relative px-4">
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-4xl font-black">Prescription Reader</h1>
      </div>
      <div className="absolute right-48">
        <ModeToggle />
      </div>
    </div>
  );
};

export default NavBar;
