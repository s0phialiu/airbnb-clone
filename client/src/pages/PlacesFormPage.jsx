import PhotosUploader from "./PhotosUploader";
import Perks from "../Perks";
import { useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function PlacesFormPage() {
    const {id} = useParams();
    console.log({id});
    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [description,setDescription] = useState('');
    const [perks,setPerks] = useState([]);
    const [extraInfo,setExtraInfo] = useState('');
    const [checkIn,setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [maxGuests,setMaxGuests] = useState(1);
    const [redirect,setRedirect] = useState(false);
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/places/'+id).then(response => {
            const {data} = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
        });
    }, [id]);

    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }
    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }
    function preInput(header,description) {
        return(
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }
    async function savePlace(ev) { // Function can add and edit places
        ev.preventDefault(); // Don't want default behavior on form submission
        const placeData = {title, address, addedPhotos, 
            description, perks, extraInfo, 
            checkIn, checkOut, maxGuests};
        if (id) {
            // It's an update
            await axios.put('/places', {  // Send put request to /places
                id, ...placeData
            });
            setRedirect(true);
        } else {
            // It's a new place
            await axios.post('/places', placeData);  // Send post request to /places
            setRedirect(true);
        }
    }
    if (redirect) {
        return <Navigate to={'/account/places'} />
    }
    return (
        <div>
            <AccountNav />
            <form onSubmit={savePlace}>
                {preInput('Title','Title, for example: My lovely apt')}
                <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="Title, for example: My lovely apt"/>
                {preInput('Address','Address to this place')}
                    <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="Address"/>
                    {preInput('Photos','More is better...')}
                    <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
                    {preInput('Description','Description of the place')}
                    <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
                    {preInput('Perks','Select all the perks of your place')}
                    <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                        <Perks selected={perks} onChange={setPerks}/>
                    </div>
                    {preInput('Extra info','House rules, etc')}
                    <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
                    {preInput('Check in and out times, max guests','Add check in and out times, remember to have some time window for cleaning the room between guests')}
                    <div className="grid gap-2 sm:grid-cols-3">
                        <div>
                            <h3 className="mt-2 -mt-1">Check in time</h3>
                            <input type="text" value={checkIn} 
                                onChange={ev => setCheckIn(ev.target.value)} 
                                placeholder="14"/>
                        </div>
                        <div>
                            <h3 className="mt-2 -mt-1">Check out time</h3>
                            <input type="text" value={checkOut} 
                                onChange={ev => setCheckOut(ev.target.value)} 
                                placeholder="11"/>
                        </div>
                        <div>
                            <h3 className="mt-2 -mt-1">Max number of guests</h3>
                            <input type="number" value={maxGuests} 
                                onChange={ev => setMaxGuests(ev.target.value)}/>
                        </div>
                    </div>
                    <div>
                        <button className="primary my-4">Save</button>
                    </div>
                </form>
            </div>
    );
}