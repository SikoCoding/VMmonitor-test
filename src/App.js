import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo1.png';
import axios from 'axios';
import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Link,
  Navigate,
  useParams,
  useNavigate,
} from 'react-router-dom';
import {
  Navbar,
  Nav,
  ListGroup,
  Container,
  Badge,
  Button,
  Row,
  Card,
  Col,
} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    products: [],
  },
  reducers: {
    addProduct(state, action) {
      state.products.push(action.payload);
    },
  },
});
const orderReducer = orderSlice.reducer;
const { addProduct } = orderSlice.actions;
const store = configureStore({
  reducer: {
    order: orderReducer,
  },
});
const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get('https://cabalapi.cyclic.app/api/cbstatus');
      setProducts(res.data);
    };
    fetchProducts();
  }, []);
  return (
    <Row className="g-1">
      {products.map((products) => (
        <Col md={2}>
          <ListGroup>
            <ListGroup.Item key={products.id}>
              {products.UserVM} จอ : {products.VMNumber} ID : {products.UserID}{' '}
              จุด :{products.Point} รอบ:{products.Round} ลูป:{products.Loop}
              {'   '}
              <form>
                <Button
                  variant="outline-primary"
                  size="sm"
                  align="right"
                  onClick={() => alert('กดทำไม มันยังใช่ไม่ได้')}
                >
                  Start
                </Button>{' '}
                <Button
                  variant="outline-danger"
                  size="sm"
                  align="right"
                  onClick={() => alert('กดทำไม มันยังใช่ไม่ได้')}
                >
                  Stop
                </Button>{' '}
                <Button
                  variant="secondary"
                  size="sm"
                  align="right"
                  onClick={() => alert('กดทำไม มันยังใช่ไม่ได้')}
                >
                  ปิดเกมส์
                </Button>{' '}
              </form>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      ))}
    </Row>
  );
};
const Layout = () => {
  const products = useSelector((state) => state.order.products);
  const ordersCount = products.length;
  return (
    <div>
      <Navbar bg="info" variant="light">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Etai Team
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/products">
                VmMonitor
              </Nav.Link>
              <Nav.Link as={Link} to="/orders">
                Orders <Badge bg="secondary">{ordersCount}</Badge>
              </Nav.Link>
              <Nav.Link href="https://cabalapi.cyclic.app/api/cbstatus/report/csv">
                Download CSV
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet></Outlet>
    </div>
  );
};
const ProductDetailsPage = () => {
  const { id } = useParams();
  console.log(id);
  return <div>Product Details : {id}</div>;
};

const OrderPage = () => {
  const products = useSelector((state) => state.order.products);
  return (
    <ListGroup>
      {products.map((product) => (
        <ListGroup.Item key={product.id}>
          {product.UserID} {product.Level}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/products" />}></Route>
            <Route path="products" element={<ProductPage />}></Route>
            <Route path="orders" element={<OrderPage />}></Route>
            <Route path="products/:id" element={<ProductDetailsPage />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
