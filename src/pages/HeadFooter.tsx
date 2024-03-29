import { useLocation, useParams } from "react-router-dom";

import { useState, useEffect } from 'react';
import routes from "../data/routes.json"
import { Container, Row, Col, Breadcrumb } from "react-bootstrap";

export const Header = () => {

    const [appName, setAppName] = useState("");
    const [personName, setPersonName] = useState("");

    let location = useLocation();
    const { uid } = useParams();

    var dispRoute: any[] = routes.filter(r => !r.path.match(/\:\D+/gi));

    useEffect(() => {
        setPersonName("")
        let locPath = location.pathname;
        if (uid !== undefined) {
            locPath = locPath.replace(uid, ":uid")
            const usrDataStr = localStorage.getItem("userData");
            if (usrDataStr){
                let usrData = JSON.parse(usrDataStr);
                usrData = usrData.filter((obj: { uid: string; }) => obj.uid === uid);
                setPersonName(`${usrData[0].name} - `);
            }

        }
        const curntRoute = routes.filter((r) => r.path == locPath);
        const app_name = curntRoute.length > 0 ? curntRoute[0].name : "404?";
        setAppName(app_name)
    }, [location]);


    return (
        <>
            <Container className="mt-2 mb-3">
                <Row>
                    <Col>
                        <Breadcrumb>
                            {dispRoute.map(({ path, name }, index) => (
                                <Breadcrumb.Item key={index} href={path}>{name}</Breadcrumb.Item>
                            ))}
                        </Breadcrumb>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1 className="inline-block">{personName}{appName}</h1>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export const Footer = () => {
    return (
        <>
            <Container className="mt-3">
                <Row>
                    <footer>
                        <div>
                            &copy;{new Date().getFullYear()} All Rights Reserved
                        </div>
                    </footer>
                </Row>
            </Container>
        </>
    )
}