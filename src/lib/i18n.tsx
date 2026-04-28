import * as Localization from "expo-localization";
import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

export type AppLanguage = "es" | "en" | "ca" | "fr" | "de" | "it" | "pt";

export type TranslationKey =
	| "common.accept"
	| "common.backToConfig"
	| "config.title"
	| "config.system"
	| "config.appPermissions"
	| "config.profile"
	| "config.preferences"
	| "config.notifications"
	| "config.categories"
	| "config.data"
	| "config.information"
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
		"common.accept": "Aceptar",
		"common.backToConfig": "Volver a configuración",
		"config.title": "configuración",
		"config.system": "Sistema",
		"config.appPermissions": "Permisos de la app",
		"config.profile": "Perfil",
		"config.preferences": "Preferencias",
		"config.notifications": "Notificaciones",
		"config.categories": "Categorías",
		"config.data": "Datos",
		"config.information": "Información",
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
		"common.accept": "Save",
		"common.backToConfig": "Back to settings",
		"config.title": "settings",
		"config.system": "System",
		"config.appPermissions": "App permissions",
		"config.profile": "Profile",
		"config.preferences": "Preferences",
		"config.notifications": "Notifications",
		"config.categories": "Categories",
		"config.data": "Data",
		"config.information": "Information",
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
		"common.accept": "Acceptar",
		"common.backToConfig": "Tornar a configuració",
		"config.title": "configuració",
		"config.system": "Sistema",
		"config.appPermissions": "Permisos de l'app",
		"config.profile": "Perfil",
		"config.preferences": "Preferències",
		"config.notifications": "Notificacions",
		"config.categories": "Categories",
		"config.data": "Dades",
		"config.information": "Informació",
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
		"common.accept": "Enregistrer",
		"common.backToConfig": "Retour aux paramètres",
		"config.title": "paramètres",
		"config.system": "Système",
		"config.appPermissions": "Autorisations de l'app",
		"config.profile": "Profil",
		"config.preferences": "Préférences",
		"config.notifications": "Notifications",
		"config.categories": "Catégories",
		"config.data": "Données",
		"config.information": "Information",
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
		"common.accept": "Speichern",
		"common.backToConfig": "Zurück zu Einstellungen",
		"config.title": "einstellungen",
		"config.system": "System",
		"config.appPermissions": "App-Berechtigungen",
		"config.profile": "Profil",
		"config.preferences": "Einstellungen",
		"config.notifications": "Benachrichtigungen",
		"config.categories": "Kategorien",
		"config.data": "Daten",
		"config.information": "Informationen",
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
		"common.accept": "Salva",
		"common.backToConfig": "Torna alle impostazioni",
		"config.title": "impostazioni",
		"config.system": "Sistema",
		"config.appPermissions": "Permessi dell'app",
		"config.profile": "Profilo",
		"config.preferences": "Preferenze",
		"config.notifications": "Notifiche",
		"config.categories": "Categorie",
		"config.data": "Dati",
		"config.information": "Informazioni",
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
		"common.accept": "Guardar",
		"common.backToConfig": "Voltar às definições",
		"config.title": "definições",
		"config.system": "Sistema",
		"config.appPermissions": "Permissões da app",
		"config.profile": "Perfil",
		"config.preferences": "Preferências",
		"config.notifications": "Notificações",
		"config.categories": "Categorias",
		"config.data": "Dados",
		"config.information": "Informação",
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
