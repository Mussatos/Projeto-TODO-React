import './admin.css';
import { useState, useEffect } from 'react';
import { addDoc, collection, onSnapshot, query, orderBy, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConnection';
import { signOut } from 'firebase/auth';

export default function Admin() {

    const [tarefaInput, setTarefaInput] = useState('');
    const [tarefasConcluidas, setTarefaConcluida] = useState([]);

    const [user, setUser] = useState({});
    const [edit, setEdit] = useState({});

    const [open, setOpen] = useState(false);

    const [tarefas, setTarefas] = useState([]);

    useEffect(() => {
        async function loadTarefas() {
            const userDetail = localStorage.getItem('@detailUser');
            setUser(JSON.parse(userDetail));

            if (userDetail) {
                const data = JSON.parse(userDetail);

                const tarefaRef = collection(db, 'tarefas')
                const q = query(tarefaRef, orderBy("created", 'desc'), where("userUid", "==", data?.uid))

                const onsub = onSnapshot(q, (snapshot) => {
                    let lista = [];

                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            tarefa: doc.data().tarefa,
                            userUid: doc.data().userUid,
                            created: doc.data().created.toDate(),
                        })
                    })
                    setTarefas(lista);
                })
            }
        }
        loadTarefas();
    }, [])

    async function salvarTarefa(e) {
        e.preventDefault(); //nao atualizar a pagina para evitar o comportamento padrao do submit

        if (tarefaInput === '') {
            alert('Digite sua tarefa...')
            return;
        }

        if (edit?.id) {
            updateTarefa();
            return;
        }

        await addDoc(collection(db, "tarefas"), {
            tarefa: tarefaInput,
            created: new Date(),
            userUid: user?.uid //"?" caso venha vazio ele nao vai crashar a aplicaçao
        })
            .then(() => {
                setTarefaInput('');
            })
            .catch((err) => {
                alert(err);
            })
    }

    async function logoutUser() {
        await signOut(auth);
    }

    async function deletarTarefa(id, tarefa, created, uid) {
        try {
            await addDoc(collection(db, 'tarefasConcluidas'), {
                dataFinalizada: new Date(),
                userUid: uid,
                tarefaConcluida: tarefa,
                created: created,
            });
            const docRef = doc(db, "tarefas", id);
            await deleteDoc(docRef);
        } catch (error) {
        }
    }

    async function editTarefa(item) {
        setTarefaInput(item.tarefa)
        setEdit(item);
    }

    async function updateTarefa() {
        const docRef = doc(db, 'tarefas', edit?.id)
        await updateDoc(docRef, {
            tarefa: tarefaInput,
        })
            .then(() => {
                setTarefaInput('')
                setEdit({})
            })
            .catch((err) => {
                alert(err)
                setTarefaInput('')
                setEdit({})
            })
    }

    function openButton(e) {
        if (open === false) {
            setOpen(true)
            async function loadTarefas() {
                const userDetail = localStorage.getItem('@detailUser');
                setUser(JSON.parse(userDetail));

                if (userDetail) {
                    const data = JSON.parse(userDetail);
                    e.preventDefault();

                    const tarefaRef = collection(db, 'tarefasConcluidas')
                    const q = query(tarefaRef, orderBy("dataFinalizada", 'desc'), where("userUid", "==", data?.uid))

                    const onsub = onSnapshot(q, (snapshot) => {
                        let lista = [];

                        snapshot.forEach((doc) => {
                            lista.push({
                                id: doc.id,
                                tarefaConcluida: doc.data().tarefaConcluida,
                                userUid: doc.data().userUid,
                                dataFinalizada: doc.data().dataFinalizada.toDate(),
                                created: doc.data().created.toDate(),
                            })
                        })
                        setTarefaConcluida(lista);
                    })
                }
            }

            return loadTarefas();
        }
        else {
            setOpen(false)
            e.preventDefault();
            return;
        }
    }

    return (
        <div className='admin-container'>
            <h1>Minhas tarefas</h1>

            <form className='form' onSubmit={salvarTarefa}>

                <textarea placeholder='Digite sua tarefa...'
                    value={tarefaInput}
                    onChange={(e) => setTarefaInput(e.target.value)} />

                {
                    //Usamos isso para saber se o objeto está vazio ou se tem uma propriedade la dentro
                    Object.keys(edit).length > 0 ? (
                        <button className='btn-register' type='submit'>Atualizar tarefa</button>
                    ) : (
                        <button className='btn-register' type='submit'>Registrar tarefa</button>
                    )
                }

            </form>

            {
                tarefas.map((item) => {
                    return (
                        <article className='list' key={item.id}>
                            <p>
                                {item.tarefa}
                            </p>

                            <br />

                            <div className='organizando-botoes'>
                                <div>
                                    <button onClick={() => editTarefa(item)}>Editar</button>
                                    <button className='btn-delete' onClick={() => deletarTarefa(item.id, item.tarefa, item.created, item.userUid)}>Concluir</button>
                                </div>
                                <div>
                                    Criação: {` `}
                                    <span>
                                        {item.created.toLocaleDateString()}
                                    </span>
                                    {` `}
                                    <span>
                                        {item.created.toLocaleTimeString('pt-BR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>

                        </article>
                    );
                })
            }
            <form className='form' onSubmit={openButton}>
                <button className='btn-register' type='submit'>
                    Histórico
                </button>
            </form>
            {
                open && tarefasConcluidas.map((item) => {
                    return (
                        <div className='list'>
                            <article key={item.id}>
                                {
                                    <div>
                                        <p>
                                            {item.tarefaConcluida}
                                        </p>
                                        <br/>
                                        <div className='data-conclusao'>
                                        <span>
                                            Criação: {` `}
                                            {item.created.toLocaleDateString()}
                                            {` `}
                                            {item.created.toLocaleTimeString()}
                                        </span>
                                        <span>
                                            Finalização: {` `}
                                            {item.dataFinalizada.toLocaleDateString()}
                                            {` `}
                                            {item.dataFinalizada.toLocaleTimeString()}
                                        </span>

                                        </div>
                                    </div>
                                }
                            </article>
                        </div>
                    );
                })
            }

            <button className='btn-logout' onClick={logoutUser}>Sair</button>

        </div>
    );
};