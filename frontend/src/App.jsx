// App.jsx
import './App.css'
import Navbar from './components/core/Navbar'
import AppRoutes from './components/Routes/AppRoutes'

function App() {
  return (
    <div className="w-screen min-h-screen bg-[#000917] font-inter">
      <Navbar />
      <AppRoutes />
    </div>
  )
}

export default App