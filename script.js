document.documentElement.classList.add("js");

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      siteNav.classList.remove("is-open");
    }
  });
}

const moreToggle = document.querySelector(".more-toggle");
const moreMenu = document.querySelector("#more-menu");
const appearanceToggle = document.querySelector(".appearance-toggle");
const appearanceValue = document.querySelector(".appearance-value");
const creditsToggle = document.querySelector(".credits-toggle");
const creditsDialog = document.querySelector(".credits-dialog");
const creditsClose = document.querySelector(".credits-close");
const themeStorageKey = "shubham-veltrix-theme";

function setMoreMenuOpen(isOpen) {
  if (!moreToggle || !(moreMenu instanceof HTMLElement)) {
    return;
  }

  moreToggle.setAttribute("aria-expanded", String(isOpen));
  moreToggle.setAttribute("aria-label", isOpen ? "Close quick links" : "Open quick links");
  moreMenu.hidden = !isOpen;
}

if (moreToggle && moreMenu instanceof HTMLElement) {
  moreToggle.addEventListener("click", () => {
    const isOpen = moreToggle.getAttribute("aria-expanded") === "true";
    setMoreMenuOpen(!isOpen);
  });

  moreMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      setMoreMenuOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (
      event.target instanceof Node &&
      !moreToggle.contains(event.target) &&
      !moreMenu.contains(event.target)
    ) {
      setMoreMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && moreToggle.getAttribute("aria-expanded") === "true") {
      setMoreMenuOpen(false);
      moreToggle.focus();
    }
  });
}

function setTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";

  if (appearanceToggle instanceof HTMLButtonElement && appearanceValue instanceof HTMLElement) {
    appearanceToggle.setAttribute("aria-pressed", String(isDark));
    appearanceValue.textContent = isDark ? "Dark" : "Light";
    appearanceToggle.setAttribute("aria-label", `Appearance: ${isDark ? "dark" : "light"} theme`);
  }
}

if (appearanceToggle instanceof HTMLButtonElement) {
  try {
    const savedTheme = localStorage.getItem(themeStorageKey);
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  } catch {
    setTheme("light");
  }

}

function toggleTheme() {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);

  try {
    localStorage.setItem(themeStorageKey, nextTheme);
  } catch {
    // The selected theme remains active for this page even if storage is unavailable.
  }
}

if (appearanceToggle instanceof HTMLButtonElement) {
  appearanceToggle.addEventListener("click", toggleTheme);
}

if (
  moreToggle instanceof HTMLButtonElement &&
  creditsToggle instanceof HTMLButtonElement &&
  creditsDialog instanceof HTMLDialogElement &&
  creditsClose instanceof HTMLButtonElement
) {
  creditsToggle.addEventListener("click", () => {
    setMoreMenuOpen(false);
    creditsDialog.showModal();
  });

  creditsClose.addEventListener("click", () => {
    creditsDialog.close();
  });

  creditsDialog.addEventListener("click", (event) => {
    if (event.target === creditsDialog) {
      creditsDialog.close();
    }
  });

  creditsDialog.addEventListener("close", () => {
    moreToggle.focus();
  });
}

const commandToggle = document.querySelector(".command-toggle");
const commandDialog = document.querySelector(".command-dialog");
const commandClose = document.querySelector(".command-close");
const commandSearch = document.querySelector(".command-search");
const commandList = document.querySelector(".command-list");
const commandEmpty = document.querySelector(".command-empty");
const commandAppearance = document.querySelector(".command-appearance");

if (
  commandToggle instanceof HTMLButtonElement &&
  commandDialog instanceof HTMLDialogElement &&
  commandClose instanceof HTMLButtonElement &&
  commandSearch instanceof HTMLInputElement &&
  commandList instanceof HTMLElement &&
  commandEmpty instanceof HTMLElement
) {
  const commandItems = [...commandList.querySelectorAll(".command-item")];
  let selectedCommand = 0;

  function visibleCommands() {
    return commandItems.filter((item) => !item.hidden);
  }

  function selectCommand(index) {
    const visibleItems = visibleCommands();
    if (visibleItems.length === 0) {
      selectedCommand = 0;
      return;
    }

    selectedCommand = (index + visibleItems.length) % visibleItems.length;
    for (const [itemIndex, item] of visibleItems.entries()) {
      const isSelected = itemIndex === selectedCommand;
      item.classList.toggle("is-active", isSelected);
      item.setAttribute("aria-selected", String(isSelected));
    }
    visibleItems[selectedCommand].scrollIntoView({ block: "nearest" });
  }

  function filterCommands() {
    const query = commandSearch.value.trim().toLowerCase();
    for (const item of commandItems) {
      const searchText = `${item.dataset.search ?? ""} ${item.textContent ?? ""}`.toLowerCase();
      item.hidden = !searchText.includes(query);
      item.classList.remove("is-active");
      item.setAttribute("aria-selected", "false");
    }

    const hasMatches = visibleCommands().length > 0;
    commandEmpty.hidden = hasMatches;
    commandList.hidden = !hasMatches;
    selectCommand(0);
  }

  function openCommandDialog() {
    setMoreMenuOpen(false);
    if (menuToggle instanceof HTMLButtonElement && siteNav instanceof HTMLElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      siteNav.classList.remove("is-open");
    }
    commandSearch.value = "";
    filterCommands();
    commandDialog.showModal();
    commandSearch.focus();
  }

  function closeCommandDialog() {
    if (commandDialog.open) {
      commandDialog.close();
    }
  }

  commandToggle.addEventListener("click", openCommandDialog);
  commandClose.addEventListener("click", closeCommandDialog);

  commandDialog.addEventListener("click", (event) => {
    if (event.target === commandDialog) {
      closeCommandDialog();
    }
  });

  commandDialog.addEventListener("close", () => {
    commandToggle.focus();
  });

  commandSearch.addEventListener("input", filterCommands);

  commandSearch.addEventListener("keydown", (event) => {
    const visibleItems = visibleCommands();

    if (event.key === "ArrowDown" && visibleItems.length > 0) {
      event.preventDefault();
      selectCommand(selectedCommand + 1);
    } else if (event.key === "ArrowUp" && visibleItems.length > 0) {
      event.preventDefault();
      selectCommand(selectedCommand - 1);
    } else if (event.key === "Enter" && visibleItems.length > 0) {
      event.preventDefault();
      visibleItems[selectedCommand].click();
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeCommandDialog();
    }
  });

  for (const item of commandItems) {
    item.addEventListener("click", () => {
      if (item instanceof HTMLButtonElement && item === commandAppearance) {
        toggleTheme();
      }
      closeCommandDialog();
    });
  }

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (commandDialog.open) {
        closeCommandDialog();
      } else {
        openCommandDialog();
      }
    }
  });
}

const photoInput = document.querySelector("#photo-upload");
const portrait = document.querySelector(".portrait");
const portraitFrame = document.querySelector(".portrait-frame");
const portraitPlaceholder = document.querySelector("#portrait-placeholder");
const photoControls = document.querySelector("#photo-controls");
const photoRemove = document.querySelector("#photo-remove");
const photoStatus = document.querySelector("#photo-status");
const photoCaption = document.querySelector("#photo-caption");
const storedPhotoKey = "shubham-portfolio-photo";

function showPortrait(source, statusMessage) {
  portrait.src = source;
  portrait.hidden = false;
  portraitPlaceholder.hidden = true;
  portraitFrame.classList.add("has-photo");
  photoControls.hidden = false;
  photoCaption.textContent = "A little curiosity goes a long way.";
  portraitPlaceholder.querySelector(".portrait-index").textContent = "COMPUTER SCIENCE · AI/ML";
  photoStatus.textContent = statusMessage;
}

function resetPortrait(statusMessage) {
  portrait.removeAttribute("src");
  portrait.hidden = true;
  portraitPlaceholder.hidden = false;
  portraitFrame.classList.remove("has-photo");
  photoControls.hidden = true;
  photoCaption.textContent = "Learning, building, and staying curious.";
  portraitPlaceholder.querySelector(".portrait-index").textContent = "COMPUTER SCIENCE · AI/ML";
  photoStatus.textContent = statusMessage;
}

function readAsDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("The selected photo could not be read."));
      }
    }, { once: true });
    reader.addEventListener("error", () => {
      reject(new Error("The selected photo could not be read."));
    }, { once: true });
    reader.readAsDataURL(blob);
  });
}

function compressPhoto(file) {
  return createImageBitmap(file).then((bitmap) => {
    const scale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      throw new Error("Your browser couldn't prepare the photo. Try another image.");
    }

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Your browser couldn't prepare the photo. Try another image."));
        }
      }, "image/jpeg", 0.84);
    });
  });
}

if (
  photoInput instanceof HTMLInputElement &&
  portrait instanceof HTMLImageElement &&
  portraitFrame &&
  portraitPlaceholder &&
  photoControls &&
  photoRemove instanceof HTMLButtonElement &&
  photoStatus instanceof HTMLElement &&
  photoCaption instanceof HTMLElement
) {
  try {
    const savedPhoto = localStorage.getItem(storedPhotoKey);
    if (savedPhoto) {
      showPortrait(savedPhoto, "Your photo is saved on this device.");
    }
  } catch {
    photoStatus.textContent = "Choose your photo to preview it. This browser does not allow saving it here.";
  }

  photoInput.addEventListener("change", async () => {
    const [file] = photoInput.files ?? [];
    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      photoStatus.textContent = "Please choose a JPG, PNG, or WebP image.";
      photoInput.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      photoStatus.textContent = "That image is over 10 MB. Choose a smaller photo.";
      photoInput.value = "";
      return;
    }

    photoStatus.textContent = "Preparing your photo…";

    try {
      const compressedPhoto = await compressPhoto(file);
      const photoData = await readAsDataUrl(compressedPhoto);
      showPortrait(photoData, "Your photo is ready and saved on this device.");

      try {
        localStorage.setItem(storedPhotoKey, photoData);
      } catch {
        photoStatus.textContent = "Your photo is previewed, but this browser couldn't save it. It may disappear when you leave.";
      }
    } catch (error) {
      photoStatus.textContent = error instanceof Error
        ? `${error.message} Your previous photo has been kept.`
        : "Your photo couldn't be loaded. Try a JPG, PNG, or WebP image.";
    } finally {
      photoInput.value = "";
    }
  });

  photoRemove.addEventListener("click", () => {
    try {
      localStorage.removeItem(storedPhotoKey);
      resetPortrait("Your photo was removed from this device. Add one whenever you're ready.");
    } catch {
      photoStatus.textContent = "This browser couldn't remove the saved photo. Try clearing this site's browser data.";
    }
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 },
  );

  for (const item of revealItems) {
    revealObserver.observe(item);
  }
} else {
  for (const item of revealItems) {
    item.classList.add("is-visible");
  }
}
