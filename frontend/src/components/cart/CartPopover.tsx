import { useState } from 'react';
import {
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import styled from '@emotion/styled';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      total
      status
      shippingAddress
      items {
        id
        quantity
        price
        product {
          id
          name
        }
      }
    }
  }
`;


const CartItem = styled(ListItem)`
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

const ItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 16px;
  border-radius: 4px;
`;

interface CartPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const CartPopover = ({ anchorEl, onClose }: CartPopoverProps) => {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [createOrder, { loading: isSubmitting }] = useMutation(CREATE_ORDER);
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = (id: string, currentQuantity: number, change: number) => {
    const newQuantity = Math.max(1, currentQuantity + change);
    updateQuantity(id, newQuantity);
  };

  const handleCheckout = () => {
    setIsCheckoutDialogOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutDialogOpen(false);
    if (orderSubmitted) {
      clearCart();
      onClose();
      setOrderSubmitted(false);
    }
  };

  const handleSubmitOrder = async () => {
    try {
      setError(null);
      const orderItems = items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      await createOrder({
        variables: {
          input: {
            items: orderItems,
            shippingAddress
          }
        }
      });

      setOrderSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the order');
    }
  };

  return (
    <>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 400, maxHeight: 500 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Shopping Cart
          </Typography>
          {items.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              Your cart is empty
            </Typography>
          ) : (
            <>
              <List>
                {items.map((item) => (
                  <CartItem key={item.id} disablePadding>
                    <ItemImage src={item.imageUrl} alt={item.name} />
                    <ListItemText
                      primary={item.name}
                      secondary={`$${item.price.toFixed(2)}`}
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => removeItem(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </CartItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">${total.toFixed(2)}</Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </>
          )}
        </Box>
      </Popover>

      <Dialog
        open={isCheckoutDialogOpen}
        onClose={handleCloseCheckout}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {orderSubmitted ? 'Order Submitted!' : 'Complete Your Order'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {orderSubmitted ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Your order has been successfully submitted!
            </Alert>
          ) : (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Order Summary
              </Typography>
              <List>
                {items.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantity: ${item.quantity}`}
                    />
                    <Typography>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Total: ${total.toFixed(2)}
              </Typography>
              <TextField
                label="Shipping Address"
                multiline
                rows={3}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                fullWidth
                required
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCheckout}>
            {orderSubmitted ? 'Close' : 'Cancel'}
          </Button>
          {!orderSubmitted && (
            <Button
              variant="contained"
              onClick={handleSubmitOrder}
              disabled={!shippingAddress.trim() || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Order'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CartPopover; 