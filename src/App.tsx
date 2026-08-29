import './App.css'
import Navbar from './components/Navbar'
import CardList from './components/CardList'
import { verbsData } from './data/verbs'

function App() {
    const level = 1
    const cards = verbsData[level] ?? []

    return (
        <>
            <Navbar />

            <h2 className="level-title">
                Глаголы — Уровень {level}
            </h2>

            <CardList cards={cards} />
        </>
    )
}

export default App