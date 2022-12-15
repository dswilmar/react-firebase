import { useState } from "react";
import { db } from "./firebaseConnection";
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc } from "firebase/firestore";

function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState();
  const [posts, setPosts] = useState([]);  

  async function handleAdd() {
    await addDoc(collection(db, "posts"), {
      titulo,
      autor
    }).then(() => {
      alert('Post registrado com sucesso!');
      setTitulo('');
      setAutor('');
    }).catch((error) => {
      console.log(error);
    });    
  }

  async function buscarPost() {
    const postRef = doc(db, "posts", "9A7GCxrgBRJxqijLLMgy")
    await getDoc(postRef).then((snapshot) => {
      setAutor(snapshot.data().autor);
      setTitulo(snapshot.data().titulo);
    }).catch((error) => {
      console.log(error);
    });
  }

  async function buscarPosts() {
    const postsRef = collection(db, "posts");
    await getDocs(postsRef).then((snapshot) => {
      let lista = [];
      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor
        });
        setPosts(lista);
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  async function editarPost() {
    if (idPost == '') {
      alert('Id do post é obrigatório!');
      return;
    }
    const docRef = doc(db, "posts", idPost);
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    }).then(() => {
      alert('Post atualizado com sucesso!');
      setIdPost('');
      setTitulo('');
      setAutor('');
    }).catch((error) => {
      console.log(error);
    })
  }

  return (
    <div>      
      <h1>ReactJS + Firebase</h1>
      <div className="container">
        <label>Id do Post</label>
        <input type="text" placeholder="Digite o id do post" value={idPost} onChange={(e) => setIdPost(e.target.value)} /><br />
        <label>Título</label>
        <input type="text" placeholder="Digite o título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        <label>Autor</label>
        <input type="text" placeholder="Digite o autor do post" value={autor} onChange={(e) => setAutor(e.target.value)} />
        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPosts}>Buscar posts</button>
        <button onClick={editarPost}>Atualizar post</button>

        <ul>
          { posts.map((post) => {
            return (
              <li key={post.id}>
                <strong>{post.id}</strong><br/>
                <span>Título: {post.titulo}</span><br />
                <span>Autor: {post.autor}</span><br />
                <hr />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
