import * as Localization from "expo-localization";
import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

export type AppLanguage = "es" | "en" | "ca" | "fr" | "de" | "it" | "pt";

export type TranslationKey =
	| "auth.logout"
	| "auth.loggingOut"
	| "auth.logoutError"
	| "common.accept"
	| "common.backToConfig"
	| "config.title"
	| "config.facturas"
	| "config.system"
	| "config.appPermissions"
	| "config.profile"
	| "config.preferences"
	| "config.notifications"
	| "config.categories"
	| "config.data"
	| "config.salary"
	| "config.information"
	| "data.import"
	| "data.sync"
	| "data.export"
	| "data.csvPending"
	| "notifications.reminders"
	| "notifications.weeklySummary"
	| "notifications.push"
	| "information.appName"
	| "information.softwareVersion"
	| "information.runtimeVersion"
	| "information.scheme"
	| "permissions.camera"
	| "permissions.storage"
	| "permissions.location"
	| "profile.title"
	| "profile.name"
	| "profile.email"
	| "profile.password"
	| "profile.repeatPassword"
	| "profile.saveAccessibility"
	| "preferences.title"
	| "preferences.darkTheme"
	| "tabs.home"
	| "tabs.products"
	| "tabs.scan"
	| "tabs.config";

const SUPPORTED_LANGUAGES: AppLanguage[] = ["es", "en", "ca", "fr", "de", "it", "pt"];

export const LANGUAGE_OPTIONS: { label: string; value: AppLanguage }[] = [
	{ label: "Español", value: "es" },
	{ label: "English", value: "en" },
	{ label: "Català", value: "ca" },
	{ label: "Français", value: "fr" },
	{ label: "Deutsch", value: "de" },
	{ label: "Italiano", value: "it" },
	{ label: "Português", value: "pt" },
];

const translations: Record<AppLanguage, Record<TranslationKey, string>> = {
	es: {
		"auth.logout": "Cerrar sesión",
		"auth.loggingOut": "Cerrando sesión...",
		"auth.logoutError": "No se pudo cerrar sesión. Inténtalo de nuevo.",
		"common.accept": "Aceptar",
		"common.backToConfig": "Volver a configuración",
		"config.title": "configuración",
		"config.system": "Sistema",
		"config.appPermissions": "Permisos de la app",
		"config.profile": "Perfil",
		"config.preferences": "Preferencias",
		"config.notifications": "Notificaciones",
		"config.categories": "Categorías",
		"config.facturas": "Facturas",
		"config.data": "Datos",
		"config.salary": "Sueldo",
		"config.information": "Información",
		"data.import": "Importar",
		"data.sync": "Sincronizar",
		"data.export": "Exportar",
		"data.csvPending": "La conexión CSV está pendiente de implementar.",
		"notifications.reminders": "Recordatorios",
		"notifications.weeklySummary": "Resumen semanales",
		"notifications.push": "Push",
		"information.appName": "Aplicación",
		"information.softwareVersion": "Versión de software",
		"information.runtimeVersion": "Versión runtime",
		"information.scheme": "Scheme",
		"permissions.camera": "Acceso a cámara",
		"permissions.storage": "Almacenamiento",
		"permissions.location": "Ubicación",
		"profile.title": "Perfil",
		"profile.name": "Nombre",
		"profile.email": "Email",
		"profile.password": "Contraseña",
		"profile.repeatPassword": "Repetir contraseña",
		"profile.saveAccessibility": "Aceptar cambios de perfil",
		"preferences.title": "Preferencias",
		"preferences.darkTheme": "Tema oscuro/claro",
		"tabs.home": "HOME",
		"tabs.products": "PRODUCTOS",
		"tabs.scan": "SCAN",
		"tabs.config": "CONFIG",
	},
	en: {
		"auth.logout": "Log out",
		"auth.loggingOut": "Logging out...",
		"auth.logoutError": "Could not log out. Try again.",
		"common.accept": "Save",
		"common.backToConfig": "Back to settings",
		"config.title": "settings",
		"config.system": "System",
		"config.appPermissions": "App permissions",
		"config.profile": "Profile",
		"config.preferences": "Preferences",
		"config.notifications": "Notifications",
		"config.categories": "Categories",
		"config.facturas": "Invoices",
		"config.data": "Data",
		"config.salary": "Salary",
		"config.information": "Information",
		"data.import": "Import",
		"data.sync": "Sync",
		"data.export": "Export",
		"data.csvPending": "CSV connection is pending implementation.",
		"notifications.reminders": "Reminders",
		"notifications.weeklySummary": "Weekly summaries",
		"notifications.push": "Push",
		"information.appName": "Application",
		"information.softwareVersion": "Software version",
		"information.runtimeVersion": "Runtime version",
		"information.scheme": "Scheme",
		"permissions.camera": "Camera access",
		"permissions.storage": "Storage",
		"permissions.location": "Location",
		"profile.title": "Profile",
		"profile.name": "Name",
		"profile.email": "Email",
		"profile.password": "Password",
		"profile.repeatPassword": "Repeat password",
		"profile.saveAccessibility": "Save profile changes",
		"preferences.title": "Preferences",
		"preferences.darkTheme": "Dark/light theme",
		"tabs.home": "HOME",
		"tabs.products": "PRODUCTS",
		"tabs.scan": "SCAN",
		"tabs.config": "SETTINGS",
	},
	ca: {
		"auth.logout": "Tancar sessió",
		"auth.loggingOut": "Tancant sessió...",
		"auth.logoutError": "No s'ha pogut tancar sessió. Torna-ho a intentar.",
		"common.accept": "Acceptar",
		"common.backToConfig": "Tornar a configuració",
		"config.title": "configuració",
		"config.system": "Sistema",
		"config.appPermissions": "Permisos de l'app",
		"config.profile": "Perfil",
		"config.preferences": "Preferències",
		"config.notifications": "Notificacions",
		"config.categories": "Categories",
		"config.facturas": "Factures",
		"config.data": "Dades",
		"config.salary": "Sou",
		"config.information": "Informació",
		"data.import": "Importar",
		"data.sync": "Sincronitzar",
		"data.export": "Exportar",
		"data.csvPending": "La connexió CSV està pendent d'implementar.",
		"notifications.reminders": "Recordatoris",
		"notifications.weeklySummary": "Resums setmanals",
		"notifications.push": "Push",
		"information.appName": "Aplicació",
		"information.softwareVersion": "Versió de software",
		"information.runtimeVersion": "Versió runtime",
		"information.scheme": "Scheme",
		"permissions.camera": "Accés a la càmera",
		"permissions.storage": "Emmagatzematge",
		"permissions.location": "Ubicació",
		"profile.title": "Perfil",
		"profile.name": "Nom",
		"profile.email": "Email",
		"profile.password": "Contrasenya",
		"profile.repeatPassword": "Repetir contrasenya",
		"profile.saveAccessibility": "Acceptar canvis del perfil",
		"preferences.title": "Preferències",
		"preferences.darkTheme": "Tema fosc/clar",
		"tabs.home": "INICI",
		"tabs.products": "PRODUCTES",
		"tabs.scan": "SCAN",
		"tabs.config": "CONFIG",
	},
	fr: {
		"auth.logout": "Se déconnecter",
		"auth.loggingOut": "Déconnexion...",
		"auth.logoutError": "Impossible de se déconnecter. Réessayez.",
		"common.accept": "Enregistrer",
		"common.backToConfig": "Retour aux paramètres",
		"config.title": "paramètres",
		"config.system": "Système",
		"config.appPermissions": "Autorisations de l'app",
		"config.profile": "Profil",
		"config.preferences": "Préférences",
		"config.notifications": "Notifications",
		"config.categories": "Catégories",
		"config.facturas": "Factures",
		"config.data": "Données",
		"config.salary": "Salaire",
		"config.information": "Information",
		"data.import": "Importer",
		"data.sync": "Synchroniser",
		"data.export": "Exporter",
		"data.csvPending": "La connexion CSV reste à implémenter.",
		"notifications.reminders": "Rappels",
		"notifications.weeklySummary": "Résumés hebdomadaires",
		"notifications.push": "Push",
		"information.appName": "Application",
		"information.softwareVersion": "Version logicielle",
		"information.runtimeVersion": "Version runtime",
		"information.scheme": "Scheme",
		"permissions.camera": "Accès caméra",
		"permissions.storage": "Stockage",
		"permissions.location": "Localisation",
		"profile.title": "Profil",
		"profile.name": "Nom",
		"profile.email": "Email",
		"profile.password": "Mot de passe",
		"profile.repeatPassword": "Répéter le mot de passe",
		"profile.saveAccessibility": "Enregistrer les changements du profil",
		"preferences.title": "Préférences",
		"preferences.darkTheme": "Thème sombre/clair",
		"tabs.home": "ACCUEIL",
		"tabs.products": "PRODUITS",
		"tabs.scan": "SCAN",
		"tabs.config": "CONFIG",
	},
	de: {
		"auth.logout": "Abmelden",
		"auth.loggingOut": "Abmeldung...",
		"auth.logoutError": "Abmeldung nicht möglich. Versuch es erneut.",
		"common.accept": "Speichern",
		"common.backToConfig": "Zurück zu Einstellungen",
		"config.title": "einstellungen",
		"config.system": "System",
		"config.appPermissions": "App-Berechtigungen",
		"config.profile": "Profil",
		"config.preferences": "Einstellungen",
		"config.notifications": "Benachrichtigungen",
		"config.categories": "Kategorien",
		"config.facturas": "Rechnungen",
		"config.data": "Daten",
		"config.salary": "Gehalt",
		"config.information": "Informationen",
		"data.import": "Importieren",
		"data.sync": "Synchronisieren",
		"data.export": "Exportieren",
		"data.csvPending": "Die CSV-Anbindung muss noch implementiert werden.",
		"notifications.reminders": "Erinnerungen",
		"notifications.weeklySummary": "Wochenübersichten",
		"notifications.push": "Push",
		"information.appName": "Anwendung",
		"information.softwareVersion": "Softwareversion",
		"information.runtimeVersion": "Runtime-Version",
		"information.scheme": "Scheme",
		"permissions.camera": "Kamerazugriff",
		"permissions.storage": "Speicher",
		"permissions.location": "Standort",
		"profile.title": "Profil",
		"profile.name": "Name",
		"profile.email": "E-Mail",
		"profile.password": "Passwort",
		"profile.repeatPassword": "Passwort wiederholen",
		"profile.saveAccessibility": "Profiländerungen speichern",
		"preferences.title": "Einstellungen",
		"preferences.darkTheme": "Dunkles/helles Design",
		"tabs.home": "HOME",
		"tabs.products": "PRODUKTE",
		"tabs.scan": "SCAN",
		"tabs.config": "CONFIG",
	},
	it: {
		"auth.logout": "Esci",
		"auth.loggingOut": "Uscita...",
		"auth.logoutError": "Non è stato possibile uscire. Riprova.",
		"common.accept": "Salva",
		"common.backToConfig": "Torna alle impostazioni",
		"config.title": "impostazioni",
		"config.system": "Sistema",
		"config.appPermissions": "Permessi dell'app",
		"config.profile": "Profilo",
		"config.preferences": "Preferenze",
		"config.notifications": "Notifiche",
		"config.categories": "Categorie",
		"config.facturas": "Fatture",
		"config.data": "Dati",
		"config.salary": "Stipendio",
		"config.information": "Informazioni",
		"data.import": "Importa",
		"data.sync": "Sincronizza",
		"data.export": "Esporta",
		"data.csvPending": "La connessione CSV è ancora da implementare.",
		"notifications.reminders": "Promemoria",
		"notifications.weeklySummary": "Riepiloghi settimanali",
		"notifications.push": "Push",
		"information.appName": "Applicazione",
		"information.softwareVersion": "Versione software",
		"information.runtimeVersion": "Versione runtime",
		"information.scheme": "Scheme",
		"permissions.camera": "Accesso fotocamera",
		"permissions.storage": "Archiviazione",
		"permissions.location": "Posizione",
		"profile.title": "Profilo",
		"profile.name": "Nome",
		"profile.email": "Email",
		"profile.password": "Password",
		"profile.repeatPassword": "Ripeti password",
		"profile.saveAccessibility": "Salva modifiche del profilo",
		"preferences.title": "Preferenze",
		"preferences.darkTheme": "Tema scuro/chiaro",
		"tabs.home": "HOME",
		"tabs.products": "PRODOTTI",
		"tabs.scan": "SCAN",
		"tabs.config": "CONFIG",
	},
	pt: {
		"auth.logout": "Terminar sessão",
		"auth.loggingOut": "A terminar sessão...",
		"auth.logoutError": "Não foi possível terminar sessão. Tenta novamente.",
		"common.accept": "Guardar",
		"common.backToConfig": "Voltar às definições",
		"config.title": "definições",
		"config.system": "Sistema",
		"config.appPermissions": "Permissões da app",
		"config.profile": "Perfil",
		"config.preferences": "Preferências",
		"config.notifications": "Notificações",
		"config.categories": "Categorias",
		"config.facturas": "Faturas",
		"config.data": "Dados",
		"config.salary": "Salário",
		"config.information": "Informação",
		"data.import": "Importar",
		"data.sync": "Sincronizar",
		"data.export": "Exportar",
		"data.csvPending": "A ligação CSV ainda está por implementar.",
		"notifications.reminders": "Lembretes",
		"notifications.weeklySummary": "Resumos semanais",
		"notifications.push": "Push",
		"information.appName": "Aplicação",
		"information.softwareVersion": "Versão de software",
		"information.runtimeVersion": "Versão runtime",
		"information.scheme": "Scheme",
		"permissions.camera": "Acesso à câmara",
		"permissions.storage": "Armazenamento",
		"permissions.location": "Localização",
		"profile.title": "Perfil",
		"profile.name": "Nome",
		"profile.email": "Email",
		"profile.password": "Palavra-passe",
		"profile.repeatPassword": "Repetir palavra-passe",
		"profile.saveAccessibility": "Guardar alterações do perfil",
		"preferences.title": "Preferências",
		"preferences.darkTheme": "Tema escuro/claro",
		"tabs.home": "INÍCIO",
		"tabs.products": "PRODUTOS",
		"tabs.scan": "SCAN",
		"tabs.config": "CONFIG",
	},
};

type I18nContextValue = {
	language: AppLanguage;
	setLanguage: (language: AppLanguage) => void;
	t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getDeviceLanguage(): AppLanguage {
	const languageCode = Localization.getLocales()[0]?.languageCode;

	if (SUPPORTED_LANGUAGES.includes(languageCode as AppLanguage)) {
		return languageCode as AppLanguage;
	}

	return "es";
}

export function I18nProvider({ children }: { children: ReactNode }) {
	const [language, setLanguage] = useState<AppLanguage>(() => getDeviceLanguage());

	const value = useMemo<I18nContextValue>(
		() => ({
			language,
			setLanguage,
			t: (key) => translations[language][key] ?? translations.es[key],
		}),
		[language],
	);

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
	const context = useContext(I18nContext);

	if (!context) {
		throw new Error("useI18n must be used inside I18nProvider");
	}

	return context;
}
