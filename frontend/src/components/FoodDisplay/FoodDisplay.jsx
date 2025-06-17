// import React, { useContext } from 'react'
// import './FoodDisplay.css'
// import { StoreContext } from '../../context/StoreContext'
// import FoodItem from '../FoodItem/FoodItem'
// const FoodDisplay = ({category}) => {

//     const {food_list} = useContext(StoreContext)

//   return (
//     <div className='food-display' id='food-display'>
//       <h2>Top dishes near you</h2>
//       <div className="food-display-list">
//         {food_list.map((item,index)=>{
//           if(category=== "All" || category===item.category){
//             return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>
//           }
//         })}
//       </div>
//     </div>
//   )
// }

// export default FoodDisplay


import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {

    const { food_list, loadingFood, foodError } = useContext(StoreContext);


    if (loadingFood) {
        return <div className='food-display' id='food-display'><h2>Loading dishes...</h2></div>;
    }

    if (foodError) {
        return <div className='food-display' id='food-display'><h2 style={{color: 'red'}}>Error: {foodError}</h2></div>;
    }

    if (!food_list || food_list.length === 0) {
        return <div className='food-display' id='food-display'><h2>No dishes found.</h2></div>;
    }

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            <div className="food-display-list">
                {food_list.map((item, index) => {
                    if (!item) return null;

                    if (category === "All" || category === item.category) {
                        return (
                            <FoodItem
                                key={index}
                                id={item._id}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                image={item.image}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default FoodDisplay;