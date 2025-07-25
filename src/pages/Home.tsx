import { useEffect, useState } from "react";
import { Row, Card, Button, Col, Alert, AlertHeading } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import TaroBadge from "components/TaroBadge";
import { getAllUsers, deleteUser, UserData } from "../utils/userDb";
import { getAllLocations, findMatchingCity, detectCountryFromCoordinates } from "../utils/loadLocation";
import type { Location } from "../utils/loadLocation";

const Home: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [allLocations, setAllLocations] = useState<Location[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers().then((users) => {
      users.sort((a, b) => moment(a.birthDatetime).diff(moment(b.birthDatetime)));
      setUserData(users);
    });

    const locs = getAllLocations();
    setAllLocations(locs);
  }, []);

  function getKey(evt: React.MouseEvent<HTMLElement>) {
    evt.preventDefault();
    const btn = evt.currentTarget;
    const footer = btn.parentNode as HTMLElement;
    return footer.getAttribute("data-key");
  }

  function editData(evt: React.MouseEvent<HTMLElement>) {
    const key = getKey(evt);
    navigate(`./form/${key}`);
  }

  async function delData(evt: React.MouseEvent<HTMLElement>) {
    const key = getKey(evt);
    if (!key) return;

    await deleteUser(key);
    const updated = await getAllUsers();
    updated.sort((a, b) => moment(a.birthDatetime).diff(moment(b.birthDatetime)));
    setUserData(updated);
  }

  function DetailPgNav(key: String, page: string = '') {
    const path = page ? `./${key}/${page}` : `./${key}`;
    navigate(path);
  }


  return (
    <>
      <Row className="g-4">
        {userData.map(({ uid, name, birthDatetime, birthLat, birthLng }) => {
          const birthDateOnly = moment(birthDatetime).format("YYYY-MM-DD");
          const birthTime = moment(birthDatetime).format("HH:mm");

          const lat = birthLat ?? null;
          const lng = birthLng ?? null;
          const cityData = lat && lng ? findMatchingCity(allLocations, lat, lng) : null;
          const country = lat && lng ? detectCountryFromCoordinates(lat, lng) : null;

          return (
            <Col key={uid} xs={12} md={6} lg={3}>
              <Card data-key={uid}>
                <Card.Body onClick={() => DetailPgNav(uid, 'taro')}>
                  <Card.Title>{name}</Card.Title>
                  <Card.Subtitle>{birthDateOnly} {birthTime}</Card.Subtitle>
                  <Card.Subtitle>{cityData?.label && <div>{country} - {cityData.label}</div>}
                    {lat && lng && (
                      <div style={{ fontSize: '80%', color: 'gray' }}>
                        ({lat}, {lng})
                      </div>
                    )}</Card.Subtitle>

                  <Card.Text>
                    <div style={{ cursor: 'pointer', userSelect: 'none' }}><TaroBadge bd={birthDateOnly} /></div>
                  </Card.Text>
                </Card.Body>

                <Card.Footer data-key={uid}>
                  <Button variant="warning" size="sm" onClick={editData}>
                    <PencilSquare />
                  </Button>
                  <Button variant="danger" size="sm" onClick={delData} className="ms-2">
                    <Trash />
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          );
        })}

        {userData.length === 0 &&
          <Col>
            <Alert variant="danger">
              <AlertHeading>尚未登入資料</AlertHeading>
              <div>請點選『新增生日』來登入資料</div>
            </Alert>
          </Col>
        }
      </Row>
    </>
  );
};

export default Home;
