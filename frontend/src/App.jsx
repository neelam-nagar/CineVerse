import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import MovieDetail from "./pages/MovieDetail/MovieDetail.jsx";
import Login from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Signup.jsx";
import WriteReview from "./pages/WriteReview/WriteReview.jsx"
import { Navigate } from "react-router-dom";
import authStore from "./store/authStore.js"
import { Loader } from "lucide-react"
import { useEffect } from "react"
import ProtectedRoute from "./components/protectedRoute.jsx";
import AnalysisPage from "./pages/ReviewAnalysis/ReviewAnalysis.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import EditReview from "./components/EditReview.jsx";



export default function App() {

  const { authUser, loadUser, loading } = authStore()

  useEffect(() => {
    loadUser()
  }, [loadUser])

  console.log({ authUser });

  if (loading && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/login" element={ <Login /> } />
        <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
        <Route path="/write-review/:id" element={ <ProtectedRoute> <WriteReview /> </ProtectedRoute> } />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reviews/edit/:id" element={<EditReview />} />
        {/* add ProtectedRoute wrapper for write-review/profile later */}
      </Routes>
    </BrowserRouter>
  );
}
