// Configuración de EmailJS
// IMPORTANTE: Reemplaza estos valores con los de tu cuenta de EmailJS
const EMAILJS_CONFIG = {
	PUBLIC_KEY: "Ths1YZF5uK0KvOqFQ", // Obtén esto de https://dashboard.emailjs.com/admin/account
	SERVICE_ID: "service_de672v7", // ID del servicio de email
	TEMPLATE_ID: "template_eb20cqc", // ID de la plantilla
};

// Inicializar EmailJS
(function () {
	if (typeof emailjs !== "undefined") {
		emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
	}
})();

// Manejar envío del formulario
document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("contactForm");
	const submitBtn = document.getElementById("submitBtn");
	const formStatus = document.getElementById("formStatus");

	if (form) {
		form.addEventListener("submit", async (e) => {
			e.preventDefault();

			// Deshabilitar botón y mostrar loading
			submitBtn.disabled = true;
			submitBtn.innerHTML = '<span data-i18n="form-sending">Enviando...</span>';
			formStatus.textContent = "";
			formStatus.className = "form-status";

			// Recoger datos del formulario
			const formData = {
				name: document.getElementById("name").value,
				email: document.getElementById("email").value,
				company: document.getElementById("company").value || "No especificada",
				phone: document.getElementById("phone").value || "No especificado",
				sector: document.getElementById("sector").value || "No especificado",
				message: document.getElementById("message").value,
			};

			try {
				// Enviar con EmailJS
				const response = await emailjs.send(
					EMAILJS_CONFIG.SERVICE_ID,
					EMAILJS_CONFIG.TEMPLATE_ID,
					formData
				);

				console.log("Enviado exitosamente!", response.status, response.text);

				// Mostrar mensaje de éxito
				formStatus.textContent =
					getTranslation("form-success") ||
					"¡Mensaje enviado con éxito! Te responderemos pronto.";
				formStatus.className = "form-status success";

				// Limpiar formulario
				form.reset();
			} catch (error) {
				console.error("Error al enviar:", error);

				// Mostrar mensaje de error
				formStatus.textContent =
					getTranslation("form-error") ||
					"Hubo un error al enviar el mensaje. Por favor, intenta de nuevo o escríbenos directamente a contacto@rebollootion.com";
				formStatus.className = "form-status error";
			} finally {
				// Reactivar botón
				submitBtn.disabled = false;
				submitBtn.innerHTML =
					'<span data-i18n="form-submit">Enviar mensaje</span>';
			}
		});
	}
});

// Función auxiliar para obtener traducciones
function getTranslation(key) {
	if (typeof currentTranslations !== "undefined" && currentTranslations[key]) {
		return currentTranslations[key];
	}
	return null;
}
