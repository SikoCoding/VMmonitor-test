import 'bootstrap/dist/css/bootstrap.min.css';
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
const IndexPage = () => {
  return <div>Index Page</div>;
};
const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get('https://cabalapi.cyclic.app/api/cb');
      setProducts(res.data);
    };
    fetchProducts();
  }, []);
  return (
    <ListGroup>
      {products.map((product) => (
        <ListGroup.Item key={product.id}>
          UserVM : {product.UserVM} จอที่ : {product.VMNumber} ID :{' '}
          {product.UserID} Status : จุดที่ {product.Point} ลูปที่ {product.Loop}{' '}
          {/* <Button variant="outline-primary" onClick={() => dispatch(addProduct(product))}>
            Start
          </Button> */}
          <Button variant="outline-primary" onClick={()=>alert("อันแน่!!! กดทำไมจ้ะ มันยังใช้ไม่ได้")}>
            Start
          </Button>
          <Button variant="outline-danger" onClick={()=>alert("ยังกดอีก มันยังใช้ไม่ได้นะจ้ะ")}>
            Stop
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};
const Layout = () => {
  const products = useSelector((state) => state.order.products);
  const ordersCount = products.length;
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
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
