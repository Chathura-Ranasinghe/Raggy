import { ModeToggle } from "../components/mode-toggle";

const NavBar = () => {
  return (
    <div className="h-24 flex items-center justify-center p-4 relative">
      <div className="bg-green-900 border-1 w-full flex items-center justify-center h-full">
        <h1 className="text-4xl font-black">Prescription Reader</h1>
      </div>
      <div className="absolute right-48">
        <ModeToggle />
      </div>
    </div>
  );
};

export default NavBar;
