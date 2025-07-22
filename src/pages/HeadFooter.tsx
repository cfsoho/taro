import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Container, Row, Col, Breadcrumb } from "react-bootstrap";
import routes from "../data/routes.json";
import { getUserByUid } from "../utils/userDb";

export const Header = () => {
  const [appName, setAppName] = useState("");
  const [personName, setPersonName] = useState("");

  const location = useLocation();
  const { uid } = useParams();

  // 過濾掉包含 :param 的路由，只顯示首頁、表單等固定路徑
  const dispRoute = routes.filter(r => !r.path.match(/\:\D+/gi));

  useEffect(() => {
    setPersonName("");
    let locPath = location.pathname;

    if (uid !== undefined) {
      locPath = locPath.replace(uid, ":uid");
      getUserByUid(uid).then(user => {
        if (user) {
          setPersonName(user.name);
        }
      });
    }

    const currentRoute = routes.find(r => r.path === locPath);
    if (!currentRoute) {
      setAppName("404?");
    } else if (uid !== undefined) {
      setAppName(`(${currentRoute.name})`);
    } else {
      setAppName(currentRoute.name);
    }
  }, [location, uid]);

  return (
    <>
      <Container className="mt-2 mb-3">
        <Row>
          <Col>
            <Breadcrumb>
              {dispRoute.map(({ path, name }, index) => (
                <Breadcrumb.Item key={index} href={path}>
                  {name}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1 className="inline-block">
              {personName}{appName}
            </h1>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const Footer = () => {
  return (
    <>
      <Container className="mt-3">
        <Row>
          <footer>
            <div>&copy;{new Date().getFullYear()} All Rights Reserved</div>
          </footer>
        </Row>
      </Container>
    </>
  );
};
