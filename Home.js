function pop() {
  let popup = document.getElementById("add_shrt");

  if (popup.classList.contains("show")) {
    popup.classList.remove("show");
    popup.classList.add("hide");
  } else if (popup.classList.contains("hide")) {
    popup.classList.remove("hide");
    popup.classList.add("show");
  }
}

function searching() {
  var q = document.getElementById("insearch").value;
  var url = "https://google.com/search?q=" + q;
  if (q !== "") {
    window.open(url);
  }
}


addEventListener("load", (event) => {
  const cardElements = document.querySelectorAll(".card");

  cardElements.forEach((card) => {
    const opt = card.querySelector(".opt");
    const del = card.querySelector(".del_btn");
    const edit = card.querySelector(".edit_btn");

    opt.addEventListener("click", function (event) {
      event.preventDefault();
      if (
        del.style.visibility === "hidden" ||
        edit.style.visibility === "hidden"
      ) {
        edit.style.visibility = "visible";
        del.style.visibility = "visible";
      } else if (
        del.style.visibility === "visible" ||
        edit.style.visibility === "visible"
      ) {
        del.style.visibility = "hidden";
        edit.style.visibility = "hidden";
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const storedShortcuts = JSON.parse(localStorage.getItem("shortcuts")) || [];
  const cardsContainer = document.querySelector(".CardsContainer");

  function generateShortcutCard(shortcut) {
    const card = document.createElement("a");
    card.className = "card";

    if (
      shortcut.url.startsWith("https://") ||
      shortcut.url.startsWith("http://") ||
      shortcut.url.startsWith("file:///") ||
      shortcut.url.startsWith("chrome://")
    ) {
      card.href = shortcut.url;
      shortcut.url = shortcut.url.replace(/^(https:\/\/|http:\/\/)/, "");
    } else {
      card.href = "https://" + shortcut.url;
    }

    card.target = "_blank";

    const icon = document.createElement("img");
    icon.className = "card_icon";
    icon.src =
      shortcut.iconURL ||
      "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://" +
        shortcut.url +
        "/&size=32";
    icon.alt = shortcut.name + "'s icon";

    const cardName = document.createElement("h3");
    cardName.className = "card_name";
    cardName.textContent = shortcut.name;


    const opt = document.createElement("button");
    opt.className = "opt hide_opt fas fa-bars";
    opt.id = "opt";
    opt.tabIndex = 0;
    opt.title = "Options";


    const del_btn = document.createElement("button");
    del_btn.className = "del_btn fas fa-trash";
    del_btn.id = "del_btn";
    del_btn.tabIndex = 0;
    del_btn.title = "Delete";
    del_btn.style.visibility = "hidden";

    const edit_btn = document.createElement("button");
    edit_btn.className = "edit_btn fas fa-edit";
    edit_btn.id = "edit_btn";
    edit_btn.tabIndex = 0;
    edit_btn.title = "Edit";
    edit_btn.style.visibility = "hidden";

    const editForm = document.createElement("form");
    editForm.className = "edit_form";
    editForm.style.display = "none";
    editForm.innerHTML = `
      <div class="form_flex">
        <label for="editOrder">Order:</label>
        <input placeholder='Order' type="text" id="editOrder" name="editOrder" value="${
          shortcut.order
        }" required>
      </div>
      <div class="form_flex">
        <label for="editName">Name:</label>
        <input type="text" id="editName" name="editName" value="${
          shortcut.name
        }" required>
      </div>
      <div class="form_flex">
        <label for="editUrl">URL:</label>
        <input type="text" id="editUrl" name="editUrl" value="${
          shortcut.url
        }" required>
      </div>
      <div class="form_flex">
        <label for="editIconUrl">Icon URL:</label>
        <input type="text" id="editIconUrl" name="editIconUrl" value="${
          shortcut.iconURL || ""
        }">
      </div>
      <div class="form_flex">
        <button type="button" class="save_btn">Save</button>
      </div>
    `;

    editForm.addEventListener("click", function (event) {
      event.preventDefault();
    });

    edit_btn.addEventListener("click", function (event) {
      event.preventDefault();
      toggleEditForm();
    });

    const save_btn = editForm.querySelector(".save_btn");
    save_btn.addEventListener("click", function (event) {
      event.preventDefault();
      saveEditedShortcut(shortcut);
    });

    function toggleEditForm() {
      if (editForm.style.display === "none") {
        editForm.style.display = "block";
      } else {
        editForm.style.display = "none";
      }
    }

    function saveEditedShortcut(oldShortcut) {
      const editedOrder = editForm.querySelector("#editOrder").value;
      const editedName = editForm.querySelector("#editName").value;
      const editedUrl = editForm.querySelector("#editUrl").value;
      const editedIconUrl =
        editForm.querySelector("#editIconUrl").value || undefined;

      oldShortcut.order = editedOrder;
      oldShortcut.name = editedName;
      oldShortcut.url = editedUrl;
      oldShortcut.iconURL = editedIconUrl;

      cardName.textContent = editedName;
      icon.src =
        editedIconUrl ||
        "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://" +
          editedUrl +
          "/&size=32";

      localStorage.setItem("shortcuts", JSON.stringify(storedShortcuts));

      toggleEditForm();
    }

    card.appendChild(icon);
    card.appendChild(cardName);
    card.appendChild(opt);
    card.append(del_btn);
    card.appendChild(edit_btn);
    card.appendChild(editForm);

    del_btn.addEventListener("click", function (event) {
      event.preventDefault();

      const cardToDelete = del_btn.closest(".card");

      cardToDelete.remove();

      const indexToDelete = storedShortcuts.findIndex(
        (s) => s.name === shortcut.name
      );

      if (indexToDelete !== -1) {
        storedShortcuts.splice(indexToDelete, 1);

        localStorage.setItem("shortcuts", JSON.stringify(storedShortcuts));
      }
    });

    return card;
  }

  storedShortcuts.sort((a, b) => a.order - b.order);

  storedShortcuts.forEach((shortcut) => {
    const card = generateShortcutCard(shortcut);
    cardsContainer.appendChild(card);
  });

  const form = document.querySelector("#shortcutForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const order = parseInt(document.querySelector("#numInput").value);
    const name = document.querySelector("#nameInput").value;
    const url = document.querySelector("#urlInput").value;
    const iconURL = document.querySelector("#iconUrlInput").value;

    const newShortcut = {
      order,
      name,
      url,
      iconURL: iconURL || undefined,
    };

    storedShortcuts.push(newShortcut);

    storedShortcuts.sort((a, b) => a.order - b.order);

    localStorage.setItem("shortcuts", JSON.stringify(storedShortcuts));

    const card = generateShortcutCard(newShortcut);
    cardsContainer.appendChild(card);

    form.reset();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const cardsContainer = document.querySelector(".CardsContainer");

  shortcuts.forEach((shortcut) => {
    iconUrl =
      "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" +
      shortcut.url +
      "/&size=32";

    const card = document.createElement("a");
    card.className = "card";
    card.href = shortcut.url;
    card.target = "_blank";

    const icon = document.createElement("img");
    icon.className = "card_icon";
    icon.src = iconUrl;
    icon.alt = shortcut.name + "'s icon";

    const cardName = document.createElement("h3");
    cardName.className = "card_name";
    cardName.textContent = shortcut.name;

    card.appendChild(icon);
    card.appendChild(cardName);

    cardsContainer.appendChild(card);
  });
});
