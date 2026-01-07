// ============================================
// SCRIPT.JS - i18n + Utilidades
// ============================================

// Configuración de idiomas
const LANG_CONFIG = {
	defaultLang: "en",
	supportedLangs: ["es", "en", "eu", "fr", "cn", "hi"],
};

// Estado de la aplicación
let currentTranslations = {};

// ============================================
// Detectar ruta para JSON de idiomas
// ============================================
function getLangPath() {
	const path = window.location.pathname;
	if (path.includes("/pages/")) {
		return "../lang/";
	}
	return "./lang/";
}

// ============================================
// Cargar traducciones desde JSON
// ============================================
async function loadTranslations(lang) {
	try {
		const langPath = getLangPath();
		const response = await fetch(`${langPath}${lang}.json`);

		if (!response.ok) {
			throw new Error(`Error loading ${lang}.json`);
		}

		return await response.json();
	} catch (error) {
		console.error("Error loading translations:", error);

		// Fallback a español si falla
		if (lang !== LANG_CONFIG.defaultLang) {
			return loadTranslations(LANG_CONFIG.defaultLang);
		}
		return {};
	}
}

// ============================================
// Actualizar textos en la página (i18n)
// ============================================
function updateLanguage(lang) {
	document.querySelectorAll("[data-i18n]").forEach((element) => {
		const key = element.getAttribute("data-i18n");
		if (currentTranslations[key]) {
			element.textContent = currentTranslations[key];
		}
	});

	console.log(`✅ Language updated to: ${lang}`);
}

// ============================================
// Cambiar idioma (llamada desde components.js)
// ============================================
async function changeLanguage(lang) {
	if (!LANG_CONFIG.supportedLangs.includes(lang)) {
		console.error(`Idioma no soportado: ${lang}`);
		return;
	}

	// Cargar traducciones
	currentTranslations = await loadTranslations(lang);

	// Actualizar textos
	updateLanguage(lang);

	// Guardar preferencia
	localStorage.setItem("language", lang);

	// Actualizar opciones activas en el dropdown (si ya existen)
	document.querySelectorAll(".lang-option").forEach((option) => {
		option.classList.toggle(
			"active",
			option.getAttribute("data-lang") === lang
		);
	});

	document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
		const key = element.getAttribute("data-i18n-placeholder");
		if (currentTranslations[key]) {
			element.placeholder = currentTranslations[key];
		}
	});
}

// ============================================
// Smooth scroll para anclas
// ============================================
function initSmoothScroll() {
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			e.preventDefault();
			const target = document.querySelector(this.getAttribute("href"));
			if (target) {
				target.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}
		});
	});
}

// ============================================
// Inicialización cuando el DOM esté listo
// ============================================
document.addEventListener("DOMContentLoaded", () => {
	initSmoothScroll();
	console.log("📍 Lang path detected:", getLangPath());
});

// ============================================
// Initialize video on page load
// ============================================

function initHeroVideo() {
	const heroVideo = document.querySelector(".hero-video");

	if (!heroVideo) return;

	// Ensure video plays on mobile
	heroVideo.play().catch(() => {
		console.log("Video autoplay prevented by browser");
	});

	console.log("✅ Hero video initialized");
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
	initHeroVideo();
});
