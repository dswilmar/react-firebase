import { useEffect, useState } from "react";
import { auth, db } from "./firebaseConnection";
import { doc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState();
  const [posts, setPosts] = useState([]);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  
  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPosts = [];
        snapshot.forEach((doc) => {
          listaPosts.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          });
          setPosts(listaPosts);
        });
      });
    }

    loadPosts();
  }, [])

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email
          });
        } else {
          setUser(false);
          setUserDetail({});
        }
      })
    }

    checkLogin();
  }, []);

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

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef).then(() => {
      alert('Post excluído com sucesso!');
    }).catch((error) => {
      console.log(error);
    });
  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha).then(() => {      
      alert("Usuário cadastrado com sucesso!");
      setEmail('');
      setSenha('');
    }).catch((error) => {      
      if (error.code === 'auth/email-already-in-use') {
        alert('E-mail já cadastrado!');
      } else if (error.code === 'auth/weak-password') {
        alert('A senha deve possuir pelo menos 6 caracteres!');
      }
    });
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha).then((value) => {
      alert('Usuário logado com sucesso!');
      setUserDetail({
        uid: value.user.id,
        email: value.user.email
      });
      setUser(true);
      setEmail('');
      setSenha('');
      console.log(value.user);
    }).catch((error) => {
      alert('Ocorreu um erro ao efetuar o login!');
      console.log(error);
    })
  }

  async function fazerLogout() {
    await signOut(auth).then(() => {
      alert('Logout feito com sucesso!');
      setUser(false);
      setUserDetail({});
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <div>      
      <h1>ReactJS + Firebase</h1>
      { user && (
        <div>
          <strong>Seja bem vindo! Você está logado!</strong><br />
          <span>Email: {userDetail.email}</span>
          <button onClick={fazerLogout}>Sair da conta</button>
          <br />
          <br />
        </div>
      )}
      <div className="container">
        <label>E-mail</label>
        <input type="email" value={email} placeholder="Digite o e-mail" onChange={(e) => setEmail(e.target.value)} />
        <label>Senha</label>
        <input type="password" value={senha} placeholder="Digite a senha" onChange={(e) => setSenha(e.target.value)} />
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Fazer login</button>
      </div>
      <hr />
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
                <button onClick={() => excluirPost(post.id)}>Excluir post</button>
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
