import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from '../dummy-products.js';

export const CartContext = createContext({
    items: [],
    addItemToCart: () => {},
    updateItemQuantity: () => {},
});

function shoppingCartReducer(state, actions) {
    if (actions.type === 'ADD_ITEM') {
        const updatedItems = [...state.items];
    
          const existingCartItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.id === actions.payload
          );
          const existingCartItem = updatedItems[existingCartItemIndex];
    
          if (existingCartItem) {
            const updatedItem = {
              ...existingCartItem,
              quantity: existingCartItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
          } else {
            const product = DUMMY_PRODUCTS.find((product) => product.id === actions.payload);
            updatedItems.push({
              id: actions.payload,
              name: product.title,
              price: product.price,
              quantity: 1,
            });
          }
    
          return {
            ...state, //not needed here since we are updating
            items: updatedItems,
          };
    }

    if (actions.type === 'UPDATE_ITEM') {
        const updatedItems = [...state.items];
          const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id === actions.payload.productId
          );
    
          const updatedItem = {
            ...updatedItems[updatedItemIndex],
          };
    
          updatedItem.quantity += actions.payload.amount;
    
          if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
          } else {
            updatedItems[updatedItemIndex] = updatedItem;
          }
    
          return {
            ...state,
            items: updatedItems,
          };
    }
    return state;
}

export default function CartContextProvider({children}) {
    const [shoppingCartState, shoppingCartDispatch] = useReducer(
        shoppingCartReducer, 
        {
            items: [],
        }
    );

    // const [shoppingCart, setShoppingCart] = useState({
    //     items: [],
    //   });
    
      function handleAddItemToCart(id) {
        shoppingCartDispatch({
            type: 'ADD_ITEM',
            payload: id,
        });

        // setShoppingCart((prevShoppingCart) => {
        //   const updatedItems = [...prevShoppingCart.items];
    
        //   const existingCartItemIndex = updatedItems.findIndex(
        //     (cartItem) => cartItem.id === id
        //   );
        //   const existingCartItem = updatedItems[existingCartItemIndex];
    
        //   if (existingCartItem) {
        //     const updatedItem = {
        //       ...existingCartItem,
        //       quantity: existingCartItem.quantity + 1,
        //     };
        //     updatedItems[existingCartItemIndex] = updatedItem;
        //   } else {
        //     const product = DUMMY_PRODUCTS.find((product) => product.id === id);
        //     updatedItems.push({
        //       id: id,
        //       name: product.title,
        //       price: product.price,
        //       quantity: 1,
        //     });
        //   }
    
        //   return {
        //     items: updatedItems,
        //   };
        // });
      }
      function handleUpdateCartItemQuantity(productId, amount) {
        shoppingCartDispatch({
            type: 'UPDATE_ITEM',
            payload: {
                productId,
                amount
            }
        })
      }
    //   function handleUpdateCartItemQuantity(productId, amount) {
    //     setShoppingCart((prevShoppingCart) => {
    //       const updatedItems = [...prevShoppingCart.items];
    //       const updatedItemIndex = updatedItems.findIndex(
    //         (item) => item.id === productId
    //       );
    
    //       const updatedItem = {
    //         ...updatedItems[updatedItemIndex],
    //       };
    
    //       updatedItem.quantity += amount;
    
    //       if (updatedItem.quantity <= 0) {
    //         updatedItems.splice(updatedItemIndex, 1);
    //       } else {
    //         updatedItems[updatedItemIndex] = updatedItem;
    //       }
    
    //       return {
    //         items: updatedItems,
    //       };
    //     });
    //   }

      const ctxValue = {
        items: shoppingCartState.items,
        addItemToCart: handleAddItemToCart,
        updateItemQuantity: handleUpdateCartItemQuantity,
      };

      return <CartContextProvider value={ctxValue}>
        {children}
      </CartContextProvider>
}