import { Alert, Box, Button, Container, Grid, Snackbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useDispatch } from 'react-redux';
import { Footer, ProductCard } from "../components";
import { addCart } from '../redux/action';

const Products = () => {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterByCategory, setFilterByCategory] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);
  const [favorite, setFavorite] = useState([]);
  const [alerts, setAlerts] = useState([]);


  // Helper to add a new alert
  const showAlert = (message, severity = 'success') => {
    setAlerts((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), message, severity, open: true }
    ]);
  };

  function handleSetFavorite (productId) {
    setFavorite((prev) => {
      let updated;
      if (prev.includes(productId)) {
        updated = prev.filter((id) => id !== productId);
        showAlert('Product removed from favorites!', 'info');
      } else {
        updated = [...prev, productId];
        showAlert('Product added to favorites!', 'info');
      }
      return updated;
    });
  } 

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
    showAlert('Product added to cart!', 'success');
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://fakestoreapi.com/products/");
        let data = await res.json();
        // Add stock property: randomize between 0 and 20, ensure some are 0
        data = data.map((item, idx) => {
          // 20% chance to be out of stock
          const stock = Math.random() < 0.2 ? 0 : Math.floor(Math.random() * 20) + 1;
          return { ...item, stock };
        });
        setProducts(data);
        setLoading(false);
        // set categories by filtering the property category of each item, get unique ones and set to categories
        const categories = [...new Set(data.map(item => item.category))];
        setCategories(categories);
      } catch (err) {
        setErrorLoading(true);
      }
    };

    getProducts();
  }, []);


  const Loader = () => {
    return (
      <Grid container spacing={3} justifyContent="center">
        {[...Array(6)].map((_, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Box sx={{ p: 2 }}>
              <Skeleton height={350} />
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  };


  function displayFilteredProducts() {
    let filteredProducts = products;
    if (filterByCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === filterByCategory
      );
    }
    if (filteredProducts.length === 0) {
      return (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No products found.
        </Typography>
      );
    }
    return (
        filteredProducts.map(product => (
          <Grid container size={{xs:12, sm:6, md:4, lg:4}} key={product.id} >
            <ProductCard data={product} addProduct={addProduct} setFavorite={handleSetFavorite} favorite={favorite.includes(product.id)} />
          </Grid>
        ))
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Products
        </Typography>
        {/* Category Filters */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mb: 3 ,}}>
          {categories.length > 0 && (
            <>
              <Button
                variant={!filterByCategory ? "contained" : "outlined"}
                color="primary"
                onClick={() => setFilterByCategory(undefined)}
                sx={{ m: 1 }}
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={filterByCategory === cat ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => setFilterByCategory(cat)}
                  sx={{ m: 1 }}
                >
                  {cat}
                </Button>
              ))}
            </>
          )}
        </Box>
        {/* Error message */}
        {errorLoading && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load products. Please try again later.
          </Alert>
        )}
      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="stretch" // This makes all grid items the same height
      >
        {loading
          ? <Loader />
          : displayFilteredProducts()
        }
        </Grid>
        {/* Multiple Snackbar Alerts */}
        {alerts.map((alert) => (
          <Snackbar
            key={alert.id}
            open={alert.open}
            autoHideDuration={2500}
            onClose={() =>
              setAlerts((prev) =>
                prev.map(a =>
                  a.id === alert.id ? { ...a, open: false } : a
                )
              )
            }
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={() =>
                setAlerts((prev) =>
                  prev.map(a =>
                    a.id === alert.id ? { ...a, open: false } : a
                  )
                )
              }
              severity={alert.severity}
              sx={{ width: '100%' }}
            >
              {alert.message}
            </Alert>
          </Snackbar>
        ))}
      </Container>
      <Footer />
    </>
  )
}

export default Products