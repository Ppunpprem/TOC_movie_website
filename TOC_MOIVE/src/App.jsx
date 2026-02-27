import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './HomePage.jsx'
import DetailPage from './detailpage.jsx'
import MoviesPage from './MoviesPage'

// this one is the only correct path which work properly the website
function App() {
  return (
    <BrowserRouter basename="/TOC_movie_website">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/:id" element={<DetailPage />} />
        <Route path="/movies" element={<MoviesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App