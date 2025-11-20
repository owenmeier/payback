import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import UploadPage from "./pages/UploadPage";
import SplittingPage from "./pages/SplittingPage";
import ResultsPage from "./pages/ResultsPage";
import ItemEditingPage from "./pages/ItemEditingPage";

function App() {
	return (
		<AppProvider>
			<Router>
				<Routes>
					<Route path="/" element={<UploadPage />} />
					<Route path="/edit-items" element={<ItemEditingPage />} />
					<Route path="/splitting" element={<SplittingPage />} />
					<Route path="/results" element={<ResultsPage />} />
				</Routes>
			</Router>
		</AppProvider>
	);
}

export default App;
