import axios from 'axios';

//ACTION TYPES

const SET_PRODUCT = 'SET_PRODUCT';

//ACTION CREATORS

const setProduct = product => ({
  type: SET_PRODUCT,
  product,
});

//THUNK CREATORS

export const fetchProduct = id => {
  return dispatch => {
    return axios
      .get(`api/products/${id}`)
      .then(res => res.data)
      .then(product => dispatch(setProduct(product)));
  };
};

//REDUCER

export const product = (state = {}, action) => {
  switch (action.type) {
    case SET_PRODUCT:
      return action.product;
    default:
      return state;
  }
};
