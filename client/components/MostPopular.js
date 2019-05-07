/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../store';

const mapStateToProps = state => {
  const { products } = state.products;
  return {
    products,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchProducts: () => dispatch(fetchProducts()),
  };
};

class MostPopular extends React.Component {
  constructor() {
    super();
    this.state = {
      orderItems: [],
      mostPopular: [],
    };
  }

  componentDidMount() {
    fetchProducts();
// TODO change to thunk
    axios
      .get('api/orderItems')
      .then(res => res.data)
      .then(orderItems => this.setState({ orderItems }))
      .then(() => this.setState({ mostPopular: this.filterPopular(this.state.orderItems) }));
  }

  filterPopular = orderItems => {
    const mostPopular = [];
    const { products } = this.props;

    // logic to get productIds with highest quantity ordered, from all orderItems:
    orderItems.reduce((sumsByItem, orderItem) => {
      if (!sumsByItem[orderItem.productId]) {
        // eslint-disable-next-line no-param-reassign
        sumsByItem[orderItem.productId] = { productId: orderItem.productId, quantity: 0 };
        mostPopular.push(sumsByItem[orderItem.productId]);
      }
      // eslint-disable-next-line no-param-reassign
      sumsByItem[orderItem.productId].quantity += orderItem.quantity;
      return sumsByItem;
    }, {});

    mostPopular.sort((a, b) => (b.quantity > a.quantity ? 1 : -1));

    //adjust the second slice index to change how many productIds are returned:
    const numProductsDisplayed = 4;

    const mostPopularProdIds = mostPopular
      .slice(0, numProductsDisplayed)
      .reduce((accum, curVal) => {
        accum.push(curVal.productId);
        return accum;
      }, []);

    const mostPopularProds = products.filter(product => mostPopularProdIds.includes(product.id));

    return mostPopularProds;
  };

  render() {
    const { mostPopular } = this.state;

    return (
      <div>
        <h4>Popular menu items</h4>
        <div className="menu-list">
          {mostPopular.map(prod => {
            const { id, title, description, price } = prod;
            return (
              <div key={id} className="menu-item">
                <ul>
                  <li>Placeholder for image</li>
                  <Link to={`/menu/${id}`}>
                    <li>{title}</li>
                  </Link>
                  <li>{description}</li>
                  <li>{price}</li>
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MostPopular);