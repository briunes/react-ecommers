import { Footer, Main, Navbar } from "../components";
import Products from "./Products";

function Home() {
  return (
    <>
      <Navbar />
      <Main />
      <Products ignoreNavbar={true} />
      <Footer />
    </>
  )
}

export default Home;