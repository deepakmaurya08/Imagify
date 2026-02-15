
import { createContext, useEffect, useState} from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export const AppContext = createContext()

const AppContextProvider = (props) =>{
    

    const [user, setUser] = useState(null);

    const [showLogin, setShowLogin] = useState(false);
    const[token, setToken] = useState(localStorage.getItem('token'))

    const [credit, setCredit] = useState(false)


    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const navigate = useNavigate()




   const loadCreditsData = async (current_token) => { 
    
    console.log("Token used in API call:", current_token || token); 
    
    try{
        const activeToken = current_token || token; 

        if (!activeToken) return; 

        const {data} = await axios.get(backendUrl + '/api/user/credits',
        {headers: {token: activeToken}}) 

            if(data.success){
                console.log("Credits fetched successfully:", data.credits); 
                setCredit(data.credits)
                setUser(data.user)
            } else {
                console.error("Failed to load credits:", data.message);
            }

    }catch(error){
        console.error("API Error during loadCreditsData:", error.message);
        toast.error("Failed to load user data. Try logging in again.");
    }
}

   const generateImage = async(prompt) =>{
    try{
        const {data} = await axios.post(backendUrl + '/api/image/generate-image', {prompt},
            {headers : {token}}
        )

        if(data.success){
            loadCreditsData()
            return data.resultImage
        }else{
            toast.error(data.message)
            loadCreditsData()
            if(data.creditBalance === 0){
                navigate('/buy')
            }
        }

    }catch(error){
         toast.error(error.message)
    }
   }

    const logout = ()=>{
        localStorage.removeItem('token');
        setToken('')
        setUser(null)

    }


    useEffect(()=>{
        if(token){
            loadCreditsData(token)
        }
    }, [token])

    const value = {
        user,setUser,showLogin, setShowLogin , backendUrl , token, setToken, credit , setCredit, loadCreditsData, logout, generateImage
    }
    return(
        <AppContext.Provider value={value}>
            {props.children}

        </AppContext.Provider>
    )
}

export default AppContextProvider