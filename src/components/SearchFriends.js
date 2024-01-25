import {useEffect, useState} from "react";
import {getDatabase, onValue, ref, update} from "firebase/database";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import Capitalize from "../Tools/capitalize";

export const SearchFriends = ({ activeComponent }) => {

    const [inputValue, setInputValue] = useState("");
    const [friendList, setFriendList] = useState([]);

    useEffect(() => {
        const searchRef = ref(getDatabase(), "users"); // Replace "your_database_path" with the actual path in your database

        onValue(searchRef, (snapshot) => {
            const users = snapshot.val();
            if(snapshot.exists() && inputValue !== "") {
                setFriendList([]);
                Object.keys(users).forEach((key) => {
                    if (users[key].email !== JSON.parse(sessionStorage.getItem("user")).email && users[key].prenom.includes(inputValue)) {
                        users[key].id = key;
                        setFriendList((friendList) => [...friendList, users[key]]);
                    }
                });
            } else {
                setFriendList([]);
            }
        });
    }, [inputValue]);

    const addFriend = (id) => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const friendRef = ref(getDatabase(), `users/${user.id}/friends`);
        onValue(friendRef, (snapshot) => {
            const friends = snapshot.val();
            if(snapshot.exists()) {
                Object.keys(friends).forEach(() => {
                    update(ref(getDatabase(), `users/${user.id}/friends`), {
                        ...friends,
                        [id]: {
                            id: id
                        }
                    }).then(r => {
                        toast.success("Vous êtes maintenant ami avec cette personne", {
                            autoClose: 3000,
                            theme: "colored",
                            closeOnClick: true,
                        });
                        console.log(r)
                    });
                });
            } else {
                update(ref(getDatabase(), `users/${user.id}/friends`), {
                    [id]: {
                        id: id
                    }
                }).then(r => {
                    toast.success("Vous êtes maintenant ami avec cette personne", {
                        autoClose: 3000,
                        theme: "colored",
                        closeOnClick: true,
                    })
                    console.log(r)
                });
            }
        });
    }

    const checkIfFriend = (id) => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const friendRef = ref(getDatabase(), `users/${user.id}/friends`);
        let check = false;
        onValue(friendRef, (snapshot) => {
            const friends = snapshot.val();
            if(snapshot.exists()) {
                Object.keys(friends).forEach((key) => {
                    if (friends[key].id === id) {
                        check = true;
                    }
                });
            } else {
                check = false;
            }
        });
        return check;
    }

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-start">
            <ToastContainer />
            <div className="flex flex-col gap-4 w-full justify-center items-center">
                <input type="text"
                       autoFocus={true}
                       onChange={(e) => setInputValue(e.target.value)}
                       className="rounded-lg w-1/2 h-10 px-4 my-10 ml-32 text-gray-200 bg-gray-700 bg-opacity-50"
                       placeholder="Rechercher un ami"/>
                <button type="button" onClick={() => activeComponent()} className="ml-32 text-gray-200 bg-gray-700 bg-opacity-50 rounded-lg px-4 py-2">Retour</button>
                <div className="flex flex-col w-1/3 ml-32 gap-5 overflow-y-scroll">
                    {friendList.map(
                        (user, index) => (
                            <div key={index} className="flex gap-8 bg-gray-50 bg-opacity-50 p-6 rounded-lg justify-center items-center">
                                <div className="flex justify-center items-center gap-4">
                                    <img src={user.photo} alt="user" className="rounded-full w-20 h-20"/>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-gray-200">{Capitalize(user.prenom) + ' ' + Capitalize(user.nom)}</span>
                                        <span className="text-gray-200">{user.email}</span>
                                    </div>
                                </div>
                                    {checkIfFriend(user.id) ?
                                        <FontAwesomeIcon icon={faCheck} size="3x" className="ml-2 text-green-600"/>
                                        :
                                        <button type="button" onClick={() => addFriend(user.id)}>
                                            <FontAwesomeIcon href="#" icon={faUserPlus} size="3x" className="ml-2 text-green-600"/>
                                        </button>
                                    }
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}
