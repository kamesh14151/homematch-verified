import { createRoot } from "react-dom/client";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import App from "./App.tsx";
import "./index.css";

const platform = Capacitor.getPlatform();
const isNativeApp = platform !== "web";

if (isNativeApp) {
	document.documentElement.classList.add("app-native", `app-${platform}`);
	document.body.classList.add("app-native", `app-${platform}`);

	void StatusBar.setOverlaysWebView({ overlay: false });
	void StatusBar.setStyle({ style: Style.Dark });

	if (platform === "android") {
		void StatusBar.setBackgroundColor({ color: "#ffffffff" });
	}

	void SplashScreen.hide();
}

createRoot(document.getElementById("root")!).render(<App />);
