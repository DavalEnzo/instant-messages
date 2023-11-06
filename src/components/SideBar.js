import {Sidebar} from "flowbite-react";
import Firebase from "../firebase";
import { onValue, ref } from "firebase/database";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faCircle} from "@fortawesome/free-solid-svg-icons";
import Capitalize from "../Tools/capitalize";

export const SideBar = () => {

    const [userList, setUserList] = useState([]);

    const connectedUser = JSON.parse(sessionStorage.getItem('user'));

    useEffect(() => {
        const userRef = ref(Firebase(), 'users');
        onValue(userRef, (snapshot) => {
            const users = snapshot.val();
            if(snapshot.exists()) {
                setUserList([]);
                Object.keys(users).forEach((key) => {
                    if (users[key].id !== connectedUser.id) {
                        setUserList((userList) => [...userList, users[key]]);
                    }
                });
            }
        });
    }, [connectedUser.id]);

    return (
        <Sidebar className="fixed rounded-r-lg" aria-label="Default sidebar example">
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item className="text-xl flex justify-center items-center text-gray-200 hover:bg-gray-600" href="#">
                        <FontAwesomeIcon icon={faUser} className="mr-2"/>
                        {Capitalize(connectedUser.prenom) + ' ' + Capitalize(connectedUser.nom)}
                        <FontAwesomeIcon icon={faCircle} className="ml-2 text-sm text-green-500"/>
                    </Sidebar.Item>
                </Sidebar.ItemGroup>

                <Sidebar.ItemGroup>
                    {userList.map(
                        (user) => (
                            <Sidebar.Item className="text-xl text-gray-200 hover:bg-gray-600" href="#">
                                <FontAwesomeIcon icon={faUser} className="mr-2"/>
                                {Capitalize(user.prenom) + ' ' + Capitalize(user.nom)}
                            </Sidebar.Item>
                        )

                    )}
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}

export default SideBar;
