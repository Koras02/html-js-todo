// Firebase 설정 파일 (firebase-config.js)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 로그인 및 회원가입 기능
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");

loginBtn.addEventListener("click", function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("로그인 성공!");
      window.location.href = "todolist.html";
    })
    .catch((error) => {
      alert("로그인 실패: " + error.message);
    });
});

signupBtn.addEventListener("click", function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("회원가입 성공!");
    })
    .catch((error) => {
      alert("회원가입 실패: " + error.message);
    });
});

// TodoList 기능
function addTodoItem(anime) {
  const user = auth.currentUser;
  if (!user) {
    alert("로그인 후 이용해 주세요!");
    return;
  }

  const todoListRef = db
    .collection("users")
    .doc(user.uid)
    .collection("todolist");
  todoListRef
    .add({
      title: anime.attributes.canonicalTitle,
      image:
        anime.attributes.posterImage?.small ||
        "https://via.placeholder.com/50x50",
      description: anime.attributes.synopsis?.substring(0, 50) + "...",
    })
    .then(() => {
      alert("TodoList에 추가 완료!");
      loadTodoList();
    });
}

function loadTodoList() {
  const user = auth.currentUser;
  if (!user) return;

  const todoListRef = db
    .collection("users")
    .doc(user.uid)
    .collection("todolist");
  todoListRef.get().then((querySnapshot) => {
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const item = doc.data();
      const li = document.createElement("li");
      li.innerHTML = `<img src="${item.image}" alt="${item.title}"> <h3>${item.title}</h3> <p>${item.description}</p>`;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "삭제";
      deleteBtn.addEventListener("click", () => {
        todoListRef
          .doc(doc.id)
          .delete()
          .then(() => {
            alert("삭제 완료!");
            loadTodoList();
          });
      });

      li.appendChild(deleteBtn);
      todoList.appendChild(li);
    });
  });
}

auth.onAuthStateChanged((user) => {
  if (user) {
    loadTodoList();
  }
});
