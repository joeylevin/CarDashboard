import React from 'react';
import "../assets/style.css";
import "../assets/bootstrap.min.css";

const About = () => {
    return (
        <div>
            <div className="card infoContainer" >
                <div className="banner" name="about-header">
                    <h1>About Us</h1>
                    Welcome to Joey&apos;s dealership, home to the best cars. We deal in sale of domestic and imported cars at reasonable prices.
                </div>
                <div style={{display: 'flex', flexDirection: 'row', margin:'auto'}}>
                    <div className="card" style={{width: '30%'}}>
                        <img className="card-img-top" src="/static/person1.jpg" alt="Joey" />
                        <div className="card-body">
                        <p className="title">Joey Levin</p>
                        <p>CEO</p>
                        <p className="card-text">Joey Levin is the visionary leader of the dealership, bringing over 15 years of experience in the automotive industry. With a strong background in business development and strategic planning, Joey has successfully expanded the dealership&apos;s market presence and fostered a culture of excellence and customer satisfaction. He is dedicated to driving innovation and growth while ensuring the highest standards of service. Under his leadership, the dealership has achieved record sales and built a loyal customer base.</p>
                        <p>joey.levin@joeyscars.com</p>
                        </div>
                    </div>

                    <div className="card" style={{width: '30%'}}>
                        <img className="card-img-top" src="/static/person2.jpg" alt="Sarah" />
                        <div className="card-body">
                        <p className="title">Sarah Thompson</p>
                        <p>Sales Manager</p>
                        <p className="card-text">Sarah is a dynamic Sales Manager with over 8 years of experience in the automotive industry. She excels at building relationships with customers and guiding them through the purchasing process. Her passion for cars and commitment to customer satisfaction have made her a key player in driving sales and improving team performance.</p>
                        <p>sarah.thompson@joeyscars.com</p>
                        </div>
                    </div>

                    <div className="card" style={{width: '30%'}}>
                        <img className="card-img-top" src="/static/person3.jpg" alt="Photos of James" />
                        <div className="card-body">
                        <p className="title">James Ramirez</p>
                        <p>Service Advisor</p>
                        <p className="card-text">James is a knowledgeable Service Advisor with a background in automotive repair and customer service. With over 5 years of experience, he ensures that clients understand their vehicle&apos;s maintenance needs and assists in scheduling service appointments. His friendly demeanor and expertise help create a positive experience for every customer.</p>
                        <p>james.ramirez@joeyscars.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About
