import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';


const EditDealer = () => {
    const [dealer, setDealer] = useState({});
    const [zip, setZip] = useState("");

    let curr_url = window.location.href;
    let root_url = curr_url.substring(0, curr_url.indexOf("editdealer"));
    let params = useParams();
    let id = params.id;
    let dealer_url = root_url + `djangoapp/dealer/${id}`;
    let review_url = root_url + `djangoapp/edit_dealer/${id}`;

    const saveChanges = async () => {
        let jsoninput = JSON.stringify({
            "zip": zip,
        });

        const res = await fetch(review_url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: jsoninput,
        });

        if (res.status === 200) {
            window.location.href = window.location.origin + "/dealer/" + id;
        }
        else {
            const err = await res.json();
            console.error("Error:", err);
        }
    }
    const get_dealer = async () => {
        const res = await fetch(dealer_url, {
            method: "GET"
        });
        const retobj = await res.json();

        if (retobj.status === 200) {
            let dealerobjs = Array.from(retobj.dealer)
            if (dealerobjs.length > 0)
                setDealer(dealerobjs[0])
                setZip(dealerobjs[0].zip)
        }
    }

    useEffect(() => {
        get_dealer();
    }, []);


    return (
        <div>
            <Header />
            <div style={{ margin: "5%" }}>
                <h1 style={{ color: "darkblue" }}>{dealer.full_name}</h1>
                <div className='input_field'>
                    Zip Code <input type="string" value={zip} onChange={(e) => setZip(e.target.value)} />
                </div>

                <div>
                    <button className='postreview' onClick={saveChanges}>Save Changes</button>
                </div>
            </div>
        </div>
    )
}
export default EditDealer