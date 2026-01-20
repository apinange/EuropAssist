import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MotoristaPage from './pages/MotoristaPage'
import GuinchoPage from './pages/GuinchoPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MotoristaPage />} />
        <Route path="/guincho" element={<GuinchoPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

