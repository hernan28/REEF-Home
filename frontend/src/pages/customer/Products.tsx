import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  AddShoppingCart as AddCartIcon,
} from '@mui/icons-material';
import styled from '@emotion/styled';
import { useCart } from '../../contexts/CartContext';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const SearchContainer = styled.div`
  margin-bottom: 24px;
`;

const ProductCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled(CardMedia)`
  height: 200px;
  background-size: contain;
`;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
      stock
      imageUrl
    }
  }
`;

const Products = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    fetchPolicy: 'network-only'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  // Get products from query data
  const products = data?.products || [];

  const handleOpenDialog = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addItem({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: quantity,
        imageUrl: selectedProduct.imageUrl,
      });
      handleCloseDialog();
    }
  };

  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Our Products
      </Typography>

      <SearchContainer>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>

      <Grid container spacing={3}>
        {filteredProducts.map((product: Product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard>
              <ProductImage
                image={product.imageUrl}
                title={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    ${product.price.toFixed(2)}
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(product)}
                  >
                    <AddCartIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </ProductCard>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!selectedProduct} onClose={handleCloseDialog}>
        <DialogTitle>Add to Cart</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6">{selectedProduct.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                ${selectedProduct.price.toFixed(2)}
              </Typography>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: selectedProduct.stock }}
                fullWidth
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Stock available: {selectedProduct.stock}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddToCart} variant="contained">
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products; 