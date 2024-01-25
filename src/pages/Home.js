import SideBar from "../components/SideBar";

export default function Home() {

    if(sessionStorage.getItem('user') == null){
        window.location.href = "/login"
    }
    return(
        <div className="bg-gray-700 h-screen">
            <SideBar></SideBar>
        </div>
    )
}
