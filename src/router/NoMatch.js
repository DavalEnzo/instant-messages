import { Link, useLocation as Location } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";

const removeSlash = () => {
    const path = Location().pathname
    return path.replace('/', '')
}
export default function NoMatch() {
    return (
        <center>
            <div className={"flex flex-col justify-center items-center h-screen"}>
                <div className={"rounded-2xl border-2 w-1/3 p-4 gap-12 bg-amber-50 text-2xl shadow-xl flex items-center justify-center"}>
                    <FontAwesomeIcon className={"text-8xl text-yellow-500 items-start"} icon={faTriangleExclamation} />
                    <div className={"flex justify-center items-center flex-col"}>
                        <b className={"text-4xl"}>Erreur 404</b>
                        <p>
                            La page <strong>{removeSlash()}</strong> n'existe pas
                        </p>
                        <Link className={"text-blue-700 underline"} to='/'>Retour à l'accueil</Link>
                    </div>
                </div>
            </div>
        </center>
    )
}
