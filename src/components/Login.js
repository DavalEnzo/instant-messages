import {useState} from "react";
import {Button, Label, TextInput} from "flowbite-react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Firebase from "../firebase";
import { ref, get } from "firebase/database";
import initializeApp from "../firebase";
import {useNavigate} from "react-router-dom";

initializeApp();

export default function Login() {
    const [data, setData] = useState({});

    const navigate = useNavigate();

    const updateData = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const submithandler = (e) => {
        e.preventDefault();
        const auth = getAuth();
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            try {
                const userRef = ref(Firebase(), `users/${userCredential.user.uid}`);
                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        const user = snapshot.val();
                        sessionStorage.setItem("user", JSON.stringify(user));
                        navigate("/");
                    } else {
                        console.log("No data available");
                    }
                }).catch((error) => {
                    console.error(error);
                });
                navigate("/login");
            } catch (error) {
                console.log(error);
            }
        })
    }

    return(
        <div className="w-1/4">
            <form className="bg-slate-200 flex flex-col p-4 gap-2 rounded-2xl w-full" onSubmit={submithandler}>
                <div className="p-5 flex flex-col gap-4">
                    <h1 className="text-center text-5xl py-5">Bienvenue</h1>
                    <div>
                        <Label className="text-xl" placeholder="Entrez votre adresse mail" htmlFor="email">Email</Label>
                        <TextInput onChange={updateData} placeholder="Entrez votre adresse mail" name="email" type= "email" required />
                    </div>
                    <div>
                        <Label className="text-xl" htmlFor="password">Mot de passe</Label>
                        <TextInput onChange={updateData} placeholder="Entrez votre mot de passe" name="password" type= "password" required />
                    </div>
                </div>

                <Button className="w-1/2 place-self-center" type = "submit">Connexion</Button>
            </form>
        </div>
    );
}
