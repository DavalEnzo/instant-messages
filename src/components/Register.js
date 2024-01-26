import {useState} from "react";
import {
    Button,
    Label,
    TextInput,
} from 'flowbite-react';
import Firebase from "../firebase";
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import { ref, set } from "firebase/database";
import {Link, useNavigate} from "react-router-dom";

export default function Register() {
    const [data, setData] = useState({})

    const navigate = useNavigate()

    const updateData = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const submithandler = (e) => {
        e.preventDefault()
        createUserWithEmailAndPassword(getAuth(), data.email, data.password)
            .then((userCredential) => {
                set(ref(Firebase(), 'users/' + userCredential.user.uid), {
                    nom: data.nom,
                    prenom: data.prenom,
                    email: data.email,
                });
                navigate('/login')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
                // ..
            });
    }

    return(
        <div className="w-1/3">
            <form className="bg-slate-200 flex flex-col p-4 gap-2 rounded-2xl w-full" onSubmit={submithandler}>
                <div className="p-5 flex flex-col gap-4">
                    <h1 className="text-center text-5xl py-5">Bienvenue, veuillez vous inscrire</h1>
                    <div>
                        <Label className="text-xl" placeholder="Entrez votre adresse mail" htmlFor="email">Email</Label>
                        <TextInput onChange={updateData} placeholder="Entrez votre adresse mail" name="email" type= "email" required />
                    </div>
                    <div>
                        <Label className="text-xl" htmlFor="email">Nom</Label>
                        <TextInput onChange={updateData} placeholder="Entrez votre nom" name="nom" type= "text" required />
                    </div>
                    <div>
                        <Label className="text-xl" htmlFor="email">Prénom</Label>
                        <TextInput onChange={updateData} placeholder="Entrez votre prénom" name="prenom" type= "text" required />
                    </div>
                    <div>
                        <Label className="text-xl" htmlFor="email">Mot de passe</Label>
                        <TextInput onChange={updateData} placeholder="Entrez votre mot de passe" name="password" type= "password" required />
                    </div>
                </div>

                <Button className="w-1/2 place-self-center" type = "submit">Inscription</Button>
                <Link to={"/login"} className="text-center">Déjà inscrit ? <span className="font-bold text-blue-500">Connectez-vous</span></Link>
            </form>
        </div>
    );
}
