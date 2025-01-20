import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConnection';

export default function Register(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    async function registerUser(e) {
        e.preventDefault();

        if(email !== '' && password !== ''){
            await createUserWithEmailAndPassword(auth, email, password)
        .then(()=>{
            navigate('/', { replace: true })
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
            <h1>Cadastre-se</h1>
            <span>Vamos criar sua conta!</span>
            <form className='form' onSubmit={registerUser}>
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

                <button type='submit'>Cadastrar</button>

            </form>

            
            <Link className='button-link' to='/'>
            Já possui uma conta? Faça o login!
            </Link>

        </div>
    );
}



