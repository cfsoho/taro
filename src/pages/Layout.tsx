import { Outlet } from "react-router-dom";
import { Header, Footer } from "./HeadFooter";
import { Container } from "react-bootstrap";

const Layout = () => {
    return (
        <>
            <Header />
            <Container>
                <Outlet />
            </Container>
            <Footer/>
        </>
    )
};

export default Layout;