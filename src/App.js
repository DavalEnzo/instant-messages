import './App.css';
import Routeur from "./router/Routeur";
import {getDatabase, ref, update} from "firebase/database";

function App() {
  window.addEventListener('beforeunload', function () {
    const user = JSON.parse(sessionStorage.getItem('user'));

    if(user !== null){
      const userRef = ref(getDatabase(), `users/${user.id}`);
      update(userRef, {
        status: "offline"
      }).then(r => {
        console.log(r)
      });
    }

    sessionStorage.removeItem('user');
  });

  return (
    <Routeur></Routeur>
  );
}

export default App;
