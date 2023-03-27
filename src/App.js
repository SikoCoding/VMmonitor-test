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
  ButtonGroup,
  DropdownButton,
  Dropdown
} from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
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

let TimeReset;

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const tick = () => {
    //let newCount = count < 30 ? count + 1 : 0
    setCount((prevState) => (prevState < 30 ? prevState + 1 : 0));
    TimeReset = count;
  };
  useEffect(() => {
    const timer = setInterval(() => tick(), 1000);
    return () => clearInterval(timer);
  });
  // const dispatch = useDispatch();
  useEffect(() => {
    if (count === 0) {
      const fetchProducts = async () => {
        const res = await axios.get('https://cabalapi.cyclic.app/api/cb');
        setProducts(res.data);
      };
      fetchProducts();
    }
  }, [count]);
  let CheckColor;
  let ErrBugs;
  function CheckEtai(name) {
    if (name == '1') {
      CheckColor = 'warning';
      ErrBugs = 'กำลังบอท...';
    } else if (name == '2') {
      CheckColor = 'success';
      ErrBugs = 'ลงดันเสร็จ';
    } else if (name == '3') {
      CheckColor = 'danger';
      ErrBugs = 'บอทมีปัญหา';
    }
  }

  return (
    <Row className="g-1">
      {products.map((products) => (
        <Col md={1}>
          <ListGroup>
            <ListGroup.Item key={products.id}>
              {CheckEtai(products.Status)}
              <ButtonGroup size="sm">
                <Button variant="primary">{products.UserVM}</Button>
                <Button variant="outline-primary">{products.VMNumber}</Button>
                <Button variant="outline-primary">{products.UserID}</Button>
              </ButtonGroup>
              <form>
                <Button
                  variant={CheckColor}
                  size="sm"
                  align="right"
                  onClick={() => alert(CheckColor)}
                >
                  {ErrBugs}
                </Button>{' '}             
                <DropdownButton
                  as={ButtonGroup}
                  title={products.Loop}
                  id="bg-vertical-dropdown-1"
                  size="sm"
                  variant="outline-secondary"
                >
                  <Dropdown.Item eventKey="1">จุด : {products.Point}</Dropdown.Item>
                  <Dropdown.Item eventKey="2">รอบ: {products.Round}</Dropdown.Item>
                  <Dropdown.Item eventKey="3">ลูป : {products.Loop}</Dropdown.Item>
                </DropdownButton>
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
              <Nav.Link href="https://cabalapi.cyclic.app/api/cbstatus/report/csv">
                Download CSV
              </Nav.Link>
              {/* <Nav.Link as={Link} to="/orders">
                Orders <Badge bg="secondary">{ordersCount}</Badge>
              </Nav.Link> */}
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
            {/* <Route path="orders" element={<OrderPage />}></Route> */}
            <Route path="products/:id" element={<ProductDetailsPage />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
