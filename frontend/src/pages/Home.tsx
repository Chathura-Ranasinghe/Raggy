import HomeLayout from "@/layouts/HomeLayout";
import NavBar from "../components/NavBar";

const Home = () => {
    return (
        <section className="flex flex-col h-screen">
            <NavBar/>
            <HomeLayout/>
        </section>
      )
}

export default Home
