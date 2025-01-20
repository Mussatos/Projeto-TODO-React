import { use, useState } from 'react';
import './home.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConnection';


export default function Home(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    async function loginUser(e) {
        e.preventDefault();

        if(email !== '' && password !== ''){
            await signInWithEmailAndPassword(auth, email, password)
        .then(()=>{
            // Navegar para /admin
            navigate('/admin', { replace: true })
        })
        .catch((err)=>{
            alert(err);
        })
        }else{
            alert('Preencha todos os campos!')
        }


        
    }


    return(
        <div className='home-container'>
            <h1>Lista de Tarefas</h1>
            <span>Gerencie sua agenda de forma fácil.</span>
            <form className='form' onSubmit={loginUser}>
                <input 
                type='text' 
                placeholder='Digite seu email...' 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}/>

                <input 
                type='password' 
                placeholder='******' 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}/>

                <button type='submit'>Acessar</button>

            </form>

            
            <Link className='button-link' to='/register'>
            Não possui uma conta? Cadastre-se
            </Link>

        </div>
    );
}



