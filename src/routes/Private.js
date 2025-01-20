import { useState, useEffect } from 'react'
import { auth } from '../firebaseConnection';
import { onAuthStateChanged } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
  
export default function Private( { children } ){

    const [loading, setLoading] = useState(true);
    const [signed, setSigned] = useState(false);

    useEffect(()=>{
        async function checkLogin() {

            const onsub = onAuthStateChanged(auth, (user) => {
                //se tem user logado
                if(user){
                    const userData = {
                        uid: user.uid,
                        email: user.email,
                    }

                    localStorage.setItem("@detailUser",JSON.stringify(userData));

                    setLoading(false);
                    setSigned(true);
                }else {
                    //nao possui logado 
                    setLoading(false);
                    setSigned(false);
                }
            })
        }
        checkLogin()
    }, [])

    if(loading){
        return(
            <div></div>
        );
    }

    if(!signed){
        //Navigate envia o usuário para a rota em forma de componente 
        return <Navigate to='/'/>
    }

    return children;  //Children é o que tem dentro da tag (la em routes)
}


