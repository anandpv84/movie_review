import React, { useEffect, useState } from 'react'
import '../pages/admin.css'
import { addmovieApi, allmovieApi, deleteApi } from '../services/allApi';
import { useNavigate } from 'react-router-dom';

function Admin() {
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [token, settoken] = useState('');
    useEffect(() => {
        const token = sessionStorage.getItem("tokenad");
        if (!token) {
            console.log("no token==")
            navigate('/adminlogin');
        } else {
            settoken(token);
        }
    }, [navigate]);

    const [movies, setmovies] = useState({
        title: "",
        year: "",
        Image: ""
    })

    // eslint-disable-next-line no-unused-vars
    const [tokenad, settokenad] = useState('')
    useEffect(() => {
        const storedToken = sessionStorage.getItem("tokenad");
        settokenad(storedToken);
    }, []);


    const [allmovies, setallmovies] = useState([])
    const getallmovies = async () => {
        const result = await allmovieApi();
        setallmovies(result.data)
    }
    useEffect(() => {
        getallmovies();
    }, [])


    const handleadd = async (e) => {
        e.preventDefault();
        console.log('=== Adding movie ===');

        const { title, year, Image } = movies;

        if (!title || !year || !Image) {
            alert("Please fill the form completely.");
        } else {
            const reqBody = new FormData();
            reqBody.append("title", movies.title);
            reqBody.append("year", movies.year);
            reqBody.append("Image", movies.Image);

            try {
                const result = await addmovieApi(reqBody);
                if (result.status === 201) {
                    alert("Movie added successfully.");
                    console.log("Movie added successfully");
                } else if (result.status === 400) {
                    alert("Movie already exists.");
                } else {
                    alert("Something went wrong. Please try again.");
                }
            } catch (error) {
                console.error("Error adding movie:", error);
                alert("Movie already exists");
            }
            getallmovies();
        }
    };


    const handledelete = async (id) => {
        try {
            const result = await deleteApi(id);

            if (result.status === 200) {
                alert('Movie deleted successfully.');
                getallmovies();
            } else {
                alert('Failed to delete movie. Please try again.');
            }
        } catch (error) {
            console.error("Error deleting movie:", error);
            alert('Failed to delete movie. Please check your internet connection and try again.');
        }
    }
    const handlelogout = () => {
        sessionStorage.removeItem("tokenad");
        navigate('/dashboard');
    };

    return (
        <>
         <button onClick={handlelogout} className='log'>
                            <span>LOGOUT</span>
                            <svg viewBox="-5 -5 110 110" preserveAspectRatio="none" aria-hidden="true">
                                <path d="M0,0 C0,0 100,0 100,0 C100,0 100,100 100,100 C100,100 0,100 0,100 C0,100 0,0 0,0" />
                            </svg>
                        </button>

            <div className="container-fluid h-100">
                <div className="row h-100">
                    <div id='movielist' className="col-8 p-5" style={{ maxHeight: '100vh', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr className='text-center'>
                                    <th>Name</th>
                                    <th >Active</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allmovies?.length > 0 ?
                                        allmovies.map((item) => (


                                            <tr className='text-center' key={item._id}>
                                                <td>{item.title}</td>
                                                <td><button onClick={() => handledelete(item._id)} style={{ backgroundColor: "transparent", color: "red" }}>Delete</button></td>
                                            </tr>


                                        )) :

                                        <tr>
                                            <td colSpan="2" className='text-center'>
                                                No movies
                                            </td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className='tt col-4 p-5' id='addmovie'>
                        <div>
                            <h2>Add Movie</h2>
                            <div>
                                <input value={movies.title} onChange={((e) => setmovies({ ...movies, title: e.target.value }))} className='in mb-2' type="text" placeholder='Movie name' /><br></br>
                                <input value={movies.year} onChange={((e) => setmovies({ ...movies, year: e.target.value }))} className='in mb-2' type="number" placeholder='Year' /><br></br>
                                <input onChange={(e) => setmovies({ ...movies, Image: e.target.files[0] })} className='int mt-1' type="file" />
                            </div>
                            <button className='bt mt-3' onClick={handleadd}>Add</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Admin