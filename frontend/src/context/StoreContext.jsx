import axios from "axios";
import { createContext,useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const [cartItem,setCartItem] = useState({});
  const url ="https://food-delivery-3a7e.onrender.com"
  const [token,setToken] = useState("")
  const [food_list,setFoodList] = useState([])
  const [loadingFood, setLoadingFood] = useState(true); // Add loading state
  const [foodError, setFoodError] = useState(null);   // Add error state

  const addToCart = async (itemId) =>{
    if (!cartItem[itemId]) {
      setCartItem((prev)=>({...prev,[itemId]:1}))
    }
    else{
      setCartItem((prev)=>({...prev,[itemId]:prev[itemId]+1}))
    }
    if(token){
      await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
    }
  }

  const removeFromCart = async (itemId) =>{
    setCartItem((prev)=>({...prev,[itemId]:prev[itemId]-1}));
    if(token){
      await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
    }
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    if (!food_list || food_list.length === 0) {
        return 0;
    }
    for(const item in cartItem)
      {
        if(cartItem[item]>0) {
          let itemInfo = food_list.find((product) => product._id === item);
          if (itemInfo) { 
            totalAmount += itemInfo.price * cartItem[item];
          }
      }
    }
    return totalAmount;
  }

  const fetchFoodList = async()=>{
    setLoadingFood(true); 
    setFoodError(null);   
    try {
      const response = await axios.get(url + "/api/food/list");
      if (response.data.success) { 
        setFoodList(response.data.data);
      } else {
        setFoodError("Failed to fetch food list: " + response.data.message); 
        setFoodList([]); 
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
      setFoodError("Network error or server unavailable.");
      setFoodList([]); 
    } finally {
        setLoadingFood(false); 
    }
  }

  const loadCartData = async (token) => {
    const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
    setCartItem(response.data.cartData);
  }

  useEffect(()=>{
    async function loadData() { 
        await fetchFoodList();
        if (localStorage.getItem("token")){
            setToken(localStorage.getItem("token"))
            await loadCartData(localStorage.getItem("token"))
        }
    }
    loadData();
  },[])


  const ContextValue = {
   food_list,
   cartItem,
   setCartItem,
   addToCart,
   removeFromCart,
   getTotalCartAmount,
   url,
   token,
   setToken,
   loadingFood, 
   foodError 
  };

  return (
    <StoreContext.Provider value={ContextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

