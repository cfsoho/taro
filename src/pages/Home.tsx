import { useEffect, useState } from "react";
import { Row, Card, CardGroup, Button, Col, Alert, AlertHeading } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import TaroBadge from "components/TaroBadge";


const Home = () => {
    const [userData, setUserData] = useState<any[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        let existingData = localStorage.getItem('userData');
        let existingJsonData = existingData ? JSON.parse(existingData) : [];
        if (existingJsonData !== null) {
            existingJsonData.sort((a: { birthday: string }, b: { birthday: string }) => {
                return moment(a.birthday).diff(moment(b.birthday));
            });
            setUserData(existingJsonData);
        }
    }, [])
    useEffect(() => {
        userData.sort((a: { birthday: string }, b: { birthday: string }) => {
            return moment(a.birthday).diff(moment(b.birthday));
        });
    }, [userData])


    function getKey(evt: React.MouseEvent<HTMLElement>) {
        evt.preventDefault();
        const btn = evt.currentTarget;
        const footer = btn.parentNode as HTMLElement;
        return footer.getAttribute('data-key');
    }

    function editData(evt: React.MouseEvent<HTMLElement>) {
        const key = getKey(evt);
        navigate(`./form/${key}`);
    }

    function delData(evt: React.MouseEvent<HTMLElement>) {
        const key = getKey(evt);
        let udstr = localStorage.getItem('userData');
        const udjson: [] = JSON.parse(udstr ? udstr : "[]");
        const udjsonDel = udjson.filter((obj: { uid: string }) => obj.uid !== key);
        udstr = JSON.stringify(udjsonDel);
        localStorage.setItem("userData", udstr);
        setUserData(udjsonDel);
    }

    function DetailPgNav(evt: React.MouseEvent<HTMLElement>) {
        evt.preventDefault();
        const key = getKey(evt);
        navigate(`./${key}`);
    }

    return <> 
            <Row className="g-4">
                {userData.map(({ uid, name, birthday }) => (
                    <Col key={uid} xs={12} md={6} lg={4}>
                        <Card data-key={uid}>
                            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                            <Card.Body onClick={DetailPgNav}>
                                <Card.Title>{name}</Card.Title>
                                <Card.Subtitle>
                                    {birthday}
                                </Card.Subtitle>
                                <Card.Text>
                                    <div>
                                        <TaroBadge bd={birthday} />
                                    </div>
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer data-key={uid} >
                                <Button variant="warning" size="sm" onClick={editData}> <PencilSquare /></Button>
                                <Button variant="danger" size="sm" onClick={delData} className="ms-2"> <Trash /></Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
                {userData.length === 0 &&
                    <Col>
                        <Alert variant="danger">
                            <AlertHeading>尚未登入資料</AlertHeading>
                            <div>請點選『新增生日』來登入資料</div>
                        </Alert>
                    </Col>
                }
            </Row> 
    </>;
};

export default Home;