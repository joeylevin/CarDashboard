import LoginPanel from "./components/Login/Login"
import { Routes, Route } from "react-router-dom";
import Register from "./components/Register/Register";
import Dealers from './components/Dealers/Dealers';
import Dealer from "./components/Dealers/Dealer"
import PostReview from "./components/Dealers/PostReview"
import SearchCars from "./components/Dealers/SearchCars";
import Home from "./components/Home/Home"
import EditDealer from "./components/Dealers/EditDealer";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPanel />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dealers" element={<Dealers />} />
            <Route path="/dealer/:id" element={<Dealer />} />
            <Route path="/postreview/:id" element={<PostReview />} />
            <Route path="/editdealer/:id" element={<EditDealer />} />
            <Route path="/searchcars/:id" element={<SearchCars />} />
        </Routes>
    );
}
export default App;
