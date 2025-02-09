// 페이지 로드 시 저장된 데이터 불러오기
document.addEventListener("DOMContentLoaded", function () {
  loadTodoList();
  loadSearchResults();
});

// 검색 버튼 클릭 이벤트
document.getElementById("search-btn").addEventListener("click", function () {
  const searchInput = document.getElementById("search-input").value;
  if (searchInput.trim() !== "") {
    searchAnime(searchInput);
  }
});

// 검색 페이지 에서만
if (
  window.location.pathname.endsWith("index.html") ||
  window.location.pathname === "/"
) {
  document.getElementById("search-btn").addEventListener("click", function () {
    const searchInput = document.getElementById("search-input").value;
    if (searchInput.trim() !== "") {
      searchAnime(searchInput);
    }
  });
}

// 애니메이션 검색 함수
async function searchAnime(query) {
  try {
    const response = await fetch(
      `https://kitsu.io/api/edge/anime?filter[text]=${query}`
    );
    const data = await response.json();
    displaySearchResults(data.data);
    saveSearchResults(data.data); // 검색 결과 저장
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// 검색 결과 표시 함수
function displaySearchResults(results) {
  const searchResults = document.getElementById("search-results");
  searchResults.innerHTML = ""; // 기존 검색 결과 초기화

  results.forEach((anime) => {
    const animeCard = document.createElement("div");
    animeCard.classList.add("anime-card");

    const image = document.createElement("img");
    image.src =
      anime.attributes.posterImage?.medium ||
      "https://via.placeholder.com/200x200";
    image.alt =
      anime.attributes.titles?.ko_kr || anime.attributes.canonicalTitle;

    const info = document.createElement("div");
    info.classList.add("info");

    const title = document.createElement("h3");
    title.textContent = anime.attributes.canonicalTitle;

    const description = document.createElement("p");
    description.textContent =
      anime.attributes.synopsis?.substring(0, 100) + "...";

    info.appendChild(title);
    info.appendChild(description);
    animeCard.appendChild(image);
    animeCard.appendChild(info);

    animeCard.addEventListener("click", () => addTodoItem(anime));
    searchResults.appendChild(animeCard);
  });
}

// TodoList에 항목 추가 함수
function addTodoItem(anime) {
  let todoList = JSON.parse(localStorage.getItem("todoList")) || []; // 기존 목록 가져오기

  const newItem = {
    title: anime.attributes.canonicalTitle,
    image:
      anime.attributes.posterImage?.small ||
      "https://via.placeholder.com/50x50",
    description: anime.attributes.synopsis?.substring(0, 50) + "...",
  };

  // 중복 항목 확인 (이미 추가된 항목인지 검사)
  if (!todoList.some((item) => item.title === newItem.title)) {
    todoList.push(newItem);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    alert("List 추가 완료!");
  } else {
    alert("이미 추가된 애니메이션입니다.");
  }
}

if (window.location.pathname.endsWith("todo.html")) {
  loadTodoList();
}

// TodoList를 로컬 스토리지에서 불러오기
function loadTodoList() {
  const todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";

  const savedItems = JSON.parse(localStorage.getItem("todoList")) || [];

  savedItems.forEach((item) => {
    const li = document.createElement("li");

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.title;

    const todoInfo = document.createElement("div");
    todoInfo.classList.add("todo-info");

    const title = document.createElement("h3");
    title.textContent = item.title;

    const description = document.createElement("p");
    description.textContent = item.description;

    todoInfo.appendChild(title);
    todoInfo.appendChild(description);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "삭제";
    deleteBtn.addEventListener("click", function () {
      deleteTodoItem(item.title);
      todoList.removeChild(li);
      saveTodoList(); // 항목 삭제 후 저장
    });

    li.appendChild(image);
    li.appendChild(todoInfo);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

// TodoList를 로컬 스토리지에 저장
function saveTodoList(todoList) {
  const items = [];
  todoList.querySelectorAll("li").forEach((li) => {
    const title = li.querySelector("h3").textContent;
    const image = li.querySelector("img").src;
    const description = li.querySelector("p").textContent;
    items.push({ title, image, description });
  });
  localStorage.setItem("todoList", JSON.stringify(items));
}
// 검색 결과를 로컬 스토리지에 저장
function saveSearchResults(results) {
  const simplifiedResults = results.map((anime) => ({
    title: anime.attributes.canonicalTitle,
    image:
      anime.attributes.posterImage?.medium ||
      "https://via.placeholder.com/200x200",
    description: anime.attributes.synopsis?.substring(0, 100) + "...",
  }));
  localStorage.setItem("searchResults", JSON.stringify(simplifiedResults));
}

// 검색 결과를 로컬 스토리지에서 불러오기
function loadSearchResults() {
  const savedResults = JSON.parse(localStorage.getItem("searchResults")) || [];
  displaySearchResults(savedResults);
}

function deleteTodoItem(itemTitle) {
  let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

  todoList = todoList.filter((item) => item.title !== itemTitle);

  localStorage.setItem("todoList", JSON.stringify(todoList));

  loadTodoList();
}
