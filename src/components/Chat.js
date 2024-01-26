import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {getDatabase, onValue, ref, set, update, get} from "firebase/database";
import Firebase from "../firebase";
import {useEffect, useRef, useState} from "react";
import {format} from "date-fns";
import Capitalize from "../Tools/capitalize";

export const Chat = ({idDestinataire}) => {

    const [inputValue, setInputValue] = useState("")
    const [conversation, setConversation] = useState([]);
    const refDiv = useRef(null);

    useEffect(() => {
        refDiv.current?.scrollIntoView();

    });

    const envoi = () => {
        setConversation([]);
        setInputValue("");
        const database = ref(getDatabase())
        let idConversation = "0";
        const user = JSON.parse(sessionStorage.getItem('user'));

        const refConversation = ref(Firebase(), 'conversations/');

        get(database, refConversation).then((snapshot) => {
            if (snapshot.hasChild("conversations")) {
                const conversations = snapshot.val().conversations;
                Object.keys(conversations).forEach((key) => {
                    if (conversations[key].participants.includes(idDestinataire) && conversations[key].participants.includes(user.id)) {
                        idConversation = key;
                        update(ref(Firebase(), 'conversations/' + idConversation), {
                            messages: [
                                ...conversations[key].messages,
                                {
                                    idEnvoyeur: user.id,
                                    idDestinataire: idDestinataire,
                                    message: inputValue,
                                    date: Date.now()
                                }
                            ]
                        }).then(r => {
                            console.log(r)
                        });
                    } else {
                        idConversation = Math.floor(Math.random() * 100000000000000000);
                        set(ref(Firebase(), 'conversations/' + idConversation), {
                            participants: [user.id, idDestinataire],
                            messages: [
                                {
                                    idEnvoyeur: user.id,
                                    idDestinataire: idDestinataire,
                                    message: inputValue,
                                    date: Date.now()
                                }
                            ]
                        }).then(r => {
                            console.log(r)
                        });
                    }
                });
            } else {
                idConversation = Math.floor(Math.random() * 100000000000000000);
                set(ref(Firebase(), 'conversations/' + idConversation), {
                    participants: [user.id, idDestinataire],
                    messages: [
                        {
                            idEnvoyeur: user.id,
                            idDestinataire: idDestinataire,
                            message: inputValue,
                            date: Date.now()
                        }
                    ]
                }).then(r => {
                    console.log(r)
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    useEffect(() => {
        const refConversation = ref(Firebase(), 'conversations/');
        setConversation([]);

        onValue(refConversation, (snapshot) => {
            const conversations = snapshot.val();
            if(snapshot.exists()) {
                Object.keys(conversations).forEach((key) => {
                    if (conversations[key].participants.includes(idDestinataire) || conversations[key].participants.includes(JSON.parse(sessionStorage.getItem('user')).id)) {
                        setConversation(() => [conversations[key]]);
                    }
                });
            }
        });
    }, [idDestinataire]);

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
                        console.log(r)
                    });
                });
            } else {
                update(ref(getDatabase(), `users/${user.id}/friends`), {
                    [id]: {
                        id: id
                    }
                }).then(r => {
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
                        return check = true;
                    }
                });
            }
        });
        return check;
    }

    const userDestinataire = () => {
        const userDestinataireRef = ref(Firebase(), `users/${idDestinataire}`);
        let userDestinataire = {};
        onValue(userDestinataireRef, (snapshot) => {
            userDestinataire = snapshot.val();
            console.log(userDestinataire);
        });
        return userDestinataire;
    }

    if(!idDestinataire) return(<></>);

    const conversationAffiche = () => {
        const userD = userDestinataire();
        return(
            <div className="flex flex-col gap-5 overflow-y-scroll">
                {conversation.map(
                    (conversation, index) => (
                        <div key={index} className="flex flex-col mb-10 gap-4 justify-center items-start">
                            {conversation.messages.map(
                                (message) => (
                                    idDestinataire === message.idDestinataire ?
                                    <div className="px-4 flex-col items-center place-self-end">
                                        <div className="flex justify-end">
                                            <div key={message.id}
                                                 className={"bg-gray-50 bg-opacity-50 mx-4 px-4 py-2 border border-black rounded-lg"}>
                                                <span className="text-gray-200">{message.message}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-end break-all text-xs text-gray-400 mr-3">
                                            <p>Envoyé
                                                le {format(new Date(message.date), "dd/MM/yyyy à HH:mm:ss")}</p>
                                        </div>
                                    </div>
                                        :
                                        <div className={"px-4 w-1/2 flex-col"}>
                                            <div className="flex-col">
                                                <div className="my-2">
                                                    <span
                                                        className="text-gray-200">{Capitalize(userD.prenom)} {Capitalize(userD.nom)}</span>
                                                </div>
                                                <div className="flex">
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/510px-Default_pfp.svg.png?20220226140232"
                                                    alt="utilisateur" className="w-10 h-10 rounded-full"/>
                                                <div key={message.id}
                                                     className={"px-4 flex items-center break-all mx-4 py-1 bg-green-500 bg-opacity-50 border-black border rounded-lg"}>
                                                    <span className="text-gray-200">{message.message}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-start text-xs text-gray-400 my-2">
                                            <p>Envoyé le {format(new Date(message.date), "dd/MM/yyyy à HH:mm:ss")}</p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )
                )}
                <div ref={refDiv}></div>
            </div>
        )
    }

    return (
        <div className="rounded-l-lg bg-[#1c1313] justify-center max-h-screen overflow-auto items-end py-7 w-1/2 mx-auto mr-0">
            {conversationAffiche()}
            {checkIfFriend(idDestinataire) ? <></> :
                <div
                    className="flex justify-center items-center mx-auto rounded-lg bg-gray-50 bg-opacity-25 text-opacity-70 w-10/12 px-4 mb-10 text-white">
                    <p>Cette personne ne fait pas partie de vos contacts, vous pouvez l'ajouter <button type="button"
                                                                                                        onClick={() => addFriend(idDestinataire)} className="font-bold text-blue-500">ici</button></p>
                </div>
            }
            <form
                onSubmit={(e) => {envoi(); e.preventDefault();}}
                className="absolute flex gap-4 w-full bottom-0 bg-[#1c1313] h-10 px-4 border-black">
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ecrivez votre message 😊" className="place-self-end border-gray-300 bg-[#1c1313] px-3 py-1 my-4 border-2 mx-4 w-5/12 rounded-full text-white">
                </input>
                <button type="submit" className="place-self-end border-gray-300 bg-[#1c1313] px-3 py-1 my-4 border-2 min-w-1/12 rounded-full text-white">
                    <FontAwesomeIcon icon={faPaperPlane} className="text-2xl"/>
                </button>
            </form>
        </div>
    )
}
