const repositoriesToShow = 10; // or any other initial value
const gitHubForm = document.getElementById("gitHubForm");
const loader = document.getElementById("loader");
const filterInput = document.getElementById("filterInput");

gitHubForm.addEventListener("submit", (e) => {
  e.preventDefault();

  loader.style.display = "block"; // Show the loader

  const usernameInput = document.getElementById("usernameInput");
  const gitHubUsername = usernameInput.value;

  requestUserRepos(gitHubUsername)
    .then((response) => {
      if (response.status === 404) {
        // User not found, show error message below the form
        showError();
      } else {
        return response.json();
      }
    })
    .then((data) => {
      loader.style.display = "none"; // Hide the loader after fetching data

      if (data) {
        // User found, proceed with displaying data
        hideError();
        allRepos = data;

        const user = data[0].owner.login;
        const userGithubID = data[0].owner.html_url;
        const userAvatar = data[0].owner.avatar_url;

        const username = document.getElementById("username");
        username.innerHTML = user;

        const userAvatarElement = document.getElementById("useravatar");
        const container = document.querySelector(".container");
        const card = document.querySelector(".card");
        const loadMoreButton = document.getElementById("loadMoreButton");
        userAvatarElement.src = userAvatar;
        userAvatarElement.style.display = "block";
        card.style.display = "block";
        container.style.display = "none";
        loadMoreButton.style.display = "block";

        const userlink = document.getElementById("userlink");
        userlink.href = userGithubID;

        displayUserRepos(repositoriesToShow);
      }
    })
    .catch((error) => {
      loader.style.display = "none"; // Hide the loader in case of an error
      showError();
      console.error("Error fetching data:", error);
    });
});

function showError() {
  const errorSection = document.getElementById("errorSection");
  errorSection.style.display = "block";
}

function hideError() {
  const errorSection = document.getElementById("errorSection");
  errorSection.style.display = "none";
}

const loadMoreButton = document.getElementById("loadMoreButton");
loadMoreButton.addEventListener("click", () => {
  repositoriesToShow += 10;
  displayUserRepos(repositoriesToShow);
});

// Add an event listener to the filter input
filterInput.addEventListener("input", () => {
  const filterValue = filterInput.value.toLowerCase();
  highlightRepos(filterValue);
});

function displayUserRepos(reposToShow) {
  const userReposElement = document.getElementById("userRepos");
  userReposElement.innerHTML = ""; // Clear existing content

  for (let i = 0; i < Math.min(reposToShow, allRepos.length); i++) {
    let row = document.createElement("div");
    row.classList.add("row");

    let col = document.createElement("div");
    col.classList.add("col");
    col.innerHTML = createRepoHTML(allRepos[i]);

    row.appendChild(col);
    userReposElement.appendChild(row);
  }

  if (reposToShow >= allRepos.length) {
    loadMoreButton.style.display = "none";
  } else {
    loadMoreButton.style.display = "block";
  }

  // Apply highlighting after displaying repositories
  const filterValue = filterInput.value.toLowerCase();
  highlightRepos(filterValue);
}

function createRepoHTML(repo) {
  return `
    <p><strong>Name:</strong> ${repo.name}</p>
    <p><strong>Description:</strong> ${repo.description}</p>
    <p><strong>URL:</strong> <a  href="${repo.html_url}">${repo.html_url}</a></p>
    <p><strong>Language:</strong><span class="language">${repo.language}</span> </p>
  `;
}
function highlightRepos(filterValue) {
  const repoNames = document.querySelectorAll(".row p:first-child");
  repoNames.forEach((repoName) => {
    const name = repoName.textContent.toLowerCase();
    if (filterValue && name.includes(filterValue)) {
      repoName.style.backgroundColor = "#ffff66"; // Highlight color
    } else {
      repoName.style.backgroundColor = ""; // Remove highlight
    }
  });
}

function requestUserRepos(username) {
  return Promise.resolve(
    fetch(`https://api.github.com/users/${username}/repos`)
  );
}
