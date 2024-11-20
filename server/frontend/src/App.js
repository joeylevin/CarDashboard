import LoginPanel from "./components/Login/Login"
import { Routes, Route } from "react-router-dom";
import Register from "./components/Register/Register";
import Dealers from './components/Dealers/Dealers';
import Dealer from "./components/Dealers/Dealer"
import PostReview from "./components/Dealers/PostReview"
import SearchCars from "./components/Dealers/SearchCars";
import Home from "./components/Homepages/Home"
import EditDealer from "./components/Dealers/EditDealer";
import About from "./components/Homepages/About";
import Contact from "./components/Homepages/Contact";
import DealerProvider from './contexts/DealerContext';
import NotFound from "./components/Homepages/NotFound";
import Header from "./components/Header/Header";
import { UserProvider } from "./contexts/UserContext";
import ChatBot from "./components/Chat/ChatBot";

function App() {
    return (
        <DealerProvider>
            <UserProvider>
                <div>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<LoginPanel />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dealers" element={<Dealers />} />
                        <Route path="/dealer/:id" element={<Dealer />} />
                        <Route path="/postreview/:id" element={<PostReview />} />
                        <Route path="/postreview/:id/:reviewid" element={<PostReview />} />
                        <Route path="/editdealer/:id" element={<EditDealer />} />
                        <Route path="/searchcars/:id" element={<SearchCars />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <ChatBot />
                </div>
            </UserProvider>
        </DealerProvider>
    );
}
export default App;
