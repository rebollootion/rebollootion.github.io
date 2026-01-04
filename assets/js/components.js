// ============================================
// COMPONENTS.JS - Carga Header/Footer + UI
// ============================================

// Función para obtener la ruta correcta según dónde estemos
function getComponentPath() {
	const path = window.location.pathname;
	if (path.includes("/pages/")) {
		return "../components/";
	}
	return "./components/";
}

// ============================================
// Cargar Header
// ============================================
async function loadHeader() {
	try {
		const basePath = getComponentPath();
		const response = await fetch(`${basePath}header.html`);

		if (response.ok) {
			const html = await response.text();
			document.getElementById("header-placeholder").innerHTML = html;

			// ✅ Inicializar todo en orden
			initDropdowns();
			initTheme();
			initLanguageUI();
			initMobileMenu(); // ← AGREGAR ESTA LÍNEA
		}
	} catch (error) {
		console.error("Error loading header:", error);
	}
}

// ============================================
// Cargar Footer
// ============================================
async function loadFooter() {
	try {
		const basePath = getComponentPath();
		const response = await fetch(`${basePath}footer.html`);

		if (response.ok) {
			const html = await response.text();
			document.getElementById("footer-placeholder").innerHTML = html;
		}
	} catch (error) {
		console.error("Error loading footer:", error);
	}
}

// ============================================
// Inicializar Dropdowns (Proyectos + Idiomas)
// ============================================
function initDropdowns() {
	// Dropdown de Proyectos
	const dropdown = document.querySelector(".dropdown");
	if (dropdown) {
		const dropdownBtn = dropdown.querySelector(".nav-link");
		const dropdownContent = dropdown.querySelector(".dropdown-content");

		dropdownBtn.addEventListener("click", (e) => {
			e.preventDefault();
			dropdownContent.classList.toggle("show");
		});

		// Cerrar al hacer clic fuera
		document.addEventListener("click", (e) => {
			if (!dropdown.contains(e.target)) {
				dropdownContent.classList.remove("show");
			}
		});
	}

	// Dropdown de idiomas
	const langDropdown = document.querySelector(".lang-dropdown");
	if (langDropdown) {
		const langBtn = document.getElementById("currentLang");
		const langContent = langDropdown.querySelector(".lang-dropdown-content");

		langBtn.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			langContent.classList.toggle("show");
		});

		// Cerrar al hacer clic fuera
		document.addEventListener("click", (e) => {
			if (!langDropdown.contains(e.target)) {
				langContent.classList.remove("show");
			}
		});

		// ✅ Manejar selección de idioma
		const langOptions = langDropdown.querySelectorAll(".lang-option");
		langOptions.forEach((option) => {
			option.addEventListener("click", () => {
				const lang = option.getAttribute("data-lang");

				// Actualizar botón actual
				document.getElementById("currentLangText").textContent =
					lang.toUpperCase();

				// Actualizar clases active
				langOptions.forEach((opt) => opt.classList.remove("active"));
				option.classList.add("active");

				// Cerrar dropdown
				langContent.classList.remove("show");

				// ✅ Cambiar idioma (función de script.js)
				if (typeof changeLanguage === "function") {
					changeLanguage(lang);
				} else {
					console.error("changeLanguage() no está definida");
				}
			});
		});
	}
}

// ============================================
// Theme Toggle (Dark/Light Mode) - MEJORADO
// ============================================
function initTheme() {
	const themeToggle = document.querySelector(".theme-toggle");
	const body = document.body;

	if (!themeToggle) {
		console.warn("Theme toggle button not found");
		return;
	}

	const sunIcon = themeToggle.querySelector(".sun-icon");
	const moonIcon = themeToggle.querySelector(".moon-icon");

	if (!sunIcon || !moonIcon) {
		console.warn("Sun or Moon icon not found");
		return;
	}

	// Cargar tema guardado (por defecto 'dark')
	const savedTheme = localStorage.getItem("theme") || "dark";

	// Aplicar tema guardado al cargar
	function applyTheme(theme) {
		if (theme === "light") {
			body.classList.add("light-mode");
			moonIcon.style.display = "block";
			sunIcon.style.display = "none";
		} else {
			body.classList.remove("light-mode");
			sunIcon.style.display = "block";
			moonIcon.style.display = "none";
		}
	}

	// Aplicar tema inicial
	applyTheme(savedTheme);

	// Event listener para cambiar tema
	themeToggle.addEventListener("click", (e) => {
		e.preventDefault();
		body.classList.toggle("light-mode");
		const newTheme = body.classList.contains("light-mode") ? "light" : "dark";
		localStorage.setItem("theme", newTheme);
		applyTheme(newTheme);
		console.log(`🌓 Theme changed to: ${newTheme}`);
	});

	console.log("✅ Theme toggle initialized with theme:", savedTheme);
}

// ============================================
// Inicializar UI de idioma (después de cargar header)
// ============================================
function initLanguageUI() {
	const savedLang = localStorage.getItem("language") || "en";

	// Actualizar el botón visual del idioma
	const currentLangText = document.getElementById("currentLangText");
	if (currentLangText) {
		currentLangText.textContent = savedLang.toUpperCase();
	}

	// Actualizar opciones activas
	document.querySelectorAll(".lang-option").forEach((option) => {
		option.classList.toggle(
			"active",
			option.getAttribute("data-lang") === savedLang
		);
	});

	// ✅ Cargar traducciones (función de script.js)
	if (typeof changeLanguage === "function") {
		changeLanguage(savedLang);
	}

	console.log("✅ Language UI initialized:", savedLang);
}

// ============================================
// Cargar componentes cuando el DOM esté listo
// ============================================
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => {
		loadHeader();
		loadFooter();
	});
} else {
	loadHeader();
	loadFooter();
}

// ============================================
// Mobile Menu Toggle
// ============================================
function initMobileMenu() {
	const hamburger = document.querySelector(".hamburger");
	const navMenu = document.querySelector(".nav-menu");
	const overlay = document.querySelector(".mobile-overlay");
	const body = document.body;

	if (!hamburger) return;

	// Toggle menú móvil
	hamburger.addEventListener("click", () => {
		hamburger.classList.toggle("active");
		navMenu.classList.toggle("active");
		overlay.classList.toggle("active");
		body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "";
	});

	// Cerrar con overlay
	overlay.addEventListener("click", () => {
		hamburger.classList.remove("active");
		navMenu.classList.remove("active");
		overlay.classList.remove("active");
		body.style.overflow = "";
	});

	// ✅ EN MÓVIL: Expandir todo por defecto
	if (window.innerWidth < 992) {
		const dropdown = document.querySelector(".dropdown");
		const dropdownContent = document.querySelector(".dropdown-content");
		const submenus = document.querySelectorAll(".submenu");

		if (dropdown && dropdownContent) {
			dropdown.classList.add("active");
			dropdownContent.classList.add("show");
		}

		submenus.forEach((submenu) => {
			submenu.style.maxHeight = "none";
		});
	}

	// Cerrar menú al hacer clic en un enlace
	const navLinks = navMenu.querySelectorAll("a");
	navLinks.forEach((link) => {
		link.addEventListener("click", () => {
			if (window.innerWidth < 992) {
				hamburger.classList.remove("active");
				navMenu.classList.remove("active");
				overlay.classList.remove("active");
				body.style.overflow = "";
			}
		});
	});

	console.log("✅ Mobile menu initialized");
}
