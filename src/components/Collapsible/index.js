import { useState } from "react";
import './collapsible.css';
import { db } from '../../firebaseConnection';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { data } from "react-router-dom";

function Collapsible() {

    const [open, setOpen] = useState(false);
    const [user, setUser] = useState({});

    const [tarefasConcluidas, setTarefaConcluida] = useState([]);

    function openButton() {
        if (open === false) {
            setOpen(true)
            async function loadTarefas() {
                const userDetail = localStorage.getItem('@detailUser');
                setUser(JSON.parse(userDetail));

                if (userDetail) {
                    const data = JSON.parse(userDetail);

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
                            })
                        })
                        setTarefaConcluida(lista);
                        console.log(lista);
                    })
                }
            }

            return loadTarefas();
        }
        else {
            setOpen(false)
            return;
        }
    }

    return (
        <div className="container">
            <button onClick={openButton} className="btn-historico">
                Histórico
            </button>
            {
                open && tarefasConcluidas.map((item) => {
                    return (
                        <div className="list">

                            <article key={item.id}>
                                <p>
                                    {
                                        item.tarefaConcluida.map((doc) => {
                                            return (
                                                <span key={doc.id}>
                                                    {doc.tarefa} <br />
                                                    criação
                                                    {doc.created.toDate().toLocaleDateString()}
                                                    {doc.created.toDate().toLocaleTimeString('pt-BR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }
                                                    )}
                                                    <br /><br />

                                                </span>
                                            );
                                        })
                                    }

                                </p>
                                finalização
                                <span>
                                    {item.dataFinalizada.toLocaleDateString()}
                                </span>
                                <span>
                                    {item.dataFinalizada.toLocaleTimeString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </article>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default Collapsible;