import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import styled from '@emotion/styled';

const OrderStatusChip = styled(Chip)<{ status: string }>`
  background-color: ${({ status }) => {
    switch (status) {
      case 'pending':
        return '#fff3e0';
      case 'processing':
        return '#e3f2fd';
      case 'shipped':
        return '#e8f5e9';
      case 'delivered':
        return '#f1f8e9';
      case 'cancelled':
        return '#ffebee';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'pending':
        return '#e65100';
      case 'processing':
        return '#1565c0';
      case 'shipped':
        return '#2e7d32';
      case 'delivered':
        return '#1b5e20';
      case 'cancelled':
        return '#c62828';
      default:
        return '#616161';
    }
  }};
`;

interface OrderItem {
  id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
  };
}

interface Order {
  id: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
}

const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      createdAt
      status
      total
      items {
        id
        product {
          name
          price
        }
        quantity
        price
      }
    }
  }
`;

const Orders = () => {
  const { loading, error, data } = useQuery(GET_MY_ORDERS, {
    fetchPolicy: 'network-only'
  });
  
  // Remove useState for orders and use data from query
  const orders = data?.myOrders || [];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders</div>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {orders.map((order: Order) => (
        <Accordion key={order.id} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
              <Typography sx={{ flexGrow: 1 }}>
                Order #{order.id}
              </Typography>
              <Typography color="text.secondary">
                {new Date(+order.createdAt).toLocaleDateString()}
              </Typography>
              <OrderStatusChip
                label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                status={order.status}
                size="small"
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Order Details
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item: OrderItem) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">${item.product.price.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        ${(item.quantity * item.product.price).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>${order.total.toFixed(2)}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </AccordionDetails>
        </Accordion>
      ))}

      {orders.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            You haven't placed any orders yet.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Orders; 