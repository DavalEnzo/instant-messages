import {Sidebar} from "flowbite-react";
import Firebase from "../firebase";
import { onValue, ref } from "firebase/database";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faCircle, faSearch, faXmark} from "@fortawesome/free-solid-svg-icons";
import Capitalize from "../Tools/capitalize";
import {Chat} from "./Chat";
import {SearchFriends} from "./SearchFriends";

export const SideBar = () => {

    const [userList, setUserList] = useState([]);

    const connectedUser = JSON.parse(sessionStorage.getItem('user'));

    const [idDestinataire, setIdDestinataire] = useState(0);

    const [searchAmis, setSearchAmis] = useState(false);
    function listeAmisStatus() {
        if(searchAmis) {
            setSearchAmis(false);
        }
    }

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const userRef = ref(Firebase(), `users/${user.id}/friends`);
        const userRef2 = ref(Firebase(), `conversations`);
        onValue(userRef, (snapshot) => {
            const friends = snapshot.val();
            if(snapshot.exists()) {
                setUserList([]);
                Object.keys(friends).forEach((key) => {
                    const friendRef = ref(Firebase(), `users/${key}`);
                    onValue(friendRef, (snapshot) => {
                        const friend = snapshot.val();
                        friend.id = snapshot.key;
                        setUserList((userList) => [...userList, friend]);
                    });
                });
            } else {
                onValue(userRef2, (snapshot) => {
                    const conversations = snapshot.val();
                    if(snapshot.exists()) {
                        setUserList([]);
                        Object.keys(conversations).forEach((key) => {
                            if(conversations[key].participants.includes(user.id)) {
                                conversations[key].participants.forEach((participant) => {
                                    if(participant !== user.id) {
                                        const friendRef = ref(Firebase(), `users/${participant}`);
                                        onValue(friendRef, (snapshot) => {
                                            const friend = snapshot.val();
                                            friend.id = snapshot.key;
                                            setUserList((userList) => [...userList, friend]);
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        setUserList([]);
                    }
                });
            }
        });
    }, [connectedUser.email]);

    return (
        <>
            <Sidebar className="fixed rounded-r-lg" aria-label="Default sidebar example">
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        <Sidebar.Item className="text-xl flex justify-center items-center text-gray-200 hover:bg-gray-600" href="#">
                            <FontAwesomeIcon icon={faUser} className="mr-2"/>
                            {Capitalize(connectedUser.prenom) + ' ' + Capitalize(connectedUser.nom)}
                            <FontAwesomeIcon icon={faCircle} className="ml-2 text-sm text-green-500"/>
                        </Sidebar.Item>
                        <Sidebar.Item onClick={() => setSearchAmis(true)} className="text-xl flex justify-center items-center text-gray-200 hover:bg-gray-600" href="#">
                            <FontAwesomeIcon icon={faSearch} className="mr-2"/>
                            Ajouter des amis
                        </Sidebar.Item>
                    </Sidebar.ItemGroup>

                    <Sidebar.ItemGroup>
                        {idDestinataire === 0 ? <></> :
                            <Sidebar.Item className="text-xl p-2 text-white hover:bg-gray-600" href="#">
                                <button onClick={() => setIdDestinataire(0)}
                                        className="ml-4 text-gray-400 hover:visible">
                                    Fermer la conversation
                                    <FontAwesomeIcon className="mx-2" icon={faXmark}/>
                                </button>
                            </Sidebar.Item>
                        }
                        {userList.map(
                            (user, index) => (
                                <Sidebar.Item key={index} className="text-xl text-gray-200 hover:bg-gray-600"
                                              onClick={() => setIdDestinataire(user.id)} href="#">
                                    <FontAwesomeIcon icon={faUser} className="mr-2"/>
                                    {Capitalize(user.prenom) + ' ' + Capitalize(user.nom)}
                                    <FontAwesomeIcon icon={faCircle}
                                                     className={user.status === "online" ? "ml-2 text-sm text-green-500" : "ml-2 text-sm text-gray-500"}/>
                                </Sidebar.Item>
                            )
                        )}
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
            <Chat idDestinataire={idDestinataire}></Chat>
            {searchAmis ?
                <SearchFriends activeComponent={listeAmisStatus}/>
                :
                <></>
            }
        </>
    );
}

export default SideBar;
