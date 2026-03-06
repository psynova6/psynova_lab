import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomeScreen from './components/HomeScreen';
import PuzzleScreen from './components/PuzzleScreen';

export default function App() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/level/:id" element={<PuzzleScreen />} />
            </Routes>
        </AnimatePresence>
    );
}
