// Contact.jsx
// Displays contact information for the company
import React from 'react';
import "../assets/style.css";
import "../assets/bootstrap.min.css";
import Header from '../Header/Header';

const Contact = () => {
    return (
        <div>
            <Header />            
            <main className="container mt-5">
                <section className="contact-info">
                    <h2 className="text-primary">Contact Customer Service</h2>
                    <img src="/static/cars.jpg" alt="Cars in showroom" clclassNameass="img-fluid" />
                    <ul className="list-unstyled">
                        <li>
                            Email: 
                            <a href="mailto:support@joeyscars.com" className="ms-2">
                                support@joeyscars.com
                            </a>
                        </li>
                        <li>
                            National Advertising team: 
                            <a href="mailto:NationalSales@joeyscars.com" className="ms-2">
                                NationalSales@joeyscars.com
                            </a>
                        </li>
                        <li>
                            Public Relations team: 
                            <a href="mailto:PR@joeyscars.com" className="ms-2">
                                PR@joeyscars.com
                            </a>
                        </li>
                        <li>
                            Contact our offices: 
                            <strong className="ms-2">312-611-1111</strong>
                        </li>
                        <li>
                            Become one of our car dealers: 
                            <a 
                                href="http://growwithjoeyscars.com" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="ms-2"
                            >
                                growwithjoeyscars.com
                            </a>
                        </li>
                    </ul>
                </section>
            </main>

            <footer class="bg-info text-white text-center py-3">
                <p>&copy; 2024 Joey's Cars Dealership</p>
            </footer>    
        </div>
    );
}

export default Contact
