import Topbar from "@/page/homePages/Topbar/Topbar.tsx";
import Footer from "@/page/homePages/Footer/Footer.tsx";
import {Outlet} from "react-router-dom";


/**
 * topbar 和  footer 都需要的页面
 * */
const MainLayout = () => {

    return (
        <>
            <Topbar/>
            <main className="main-content">
               <Outlet />
            </main>
            <Footer/>
        </>
    );
}

export default MainLayout;