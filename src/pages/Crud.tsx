import { useEffect, useState } from "react";
import { Form, Button, Col, Row, Alert } from "react-bootstrap";
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import ToastDialog from "components/ToastDialog";
import { useParams, Link } from 'react-router-dom';


const Crud = () => {
    const [age, setAge] = useState<number | string>("");
    const [name, setName] = useState<string | null>(null);
    const [birthday, setBirthday] = useState<string | null>(null);
    const [errormsg, setErrormsg] = useState<string | null>(null);
    const [tdshow, setTdShow] = useState<boolean>(false);
    const [tdmsg, setTdMsg] = useState<string>("");
    const { uid } = useParams();

    useEffect(() => {
        if (uid !== undefined) {
            const udStr = localStorage.getItem("userData");
            if (udStr === null) {
                localStorage.clear();
                return;
            }
            const udJson = JSON.parse(udStr);
            if (udJson === null) {
                localStorage.clear();
            }
            const filteredobj = udJson.filter((obj: { uid: string; }) => obj.uid === uid)
            if (filteredobj.length == 1) {
                setName(filteredobj[0].name);
                setBirthday(filteredobj[0].birthday);
            }
        } else {
            setName("");
            setBirthday("");
        }
    }, [uid])

    useEffect(() => {
        const today = moment();
        let ageCal = today.diff(moment(birthday), 'years');
        ageCal = isNaN(ageCal) ? 0 : ageCal;
        setAge(ageCal === 0 ? "" : ageCal);
    }, [birthday])

    const formatDate = (date: Date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }



    const onDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBirthday(event.target.value);

    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (name === null || birthday === null) {
            setErrormsg("All columns are required.");
            return false;
        }

        const newPerson = {
            uid: uid !== undefined ? uid : uuidv4(),
            name: name,
            birthday: birthday,
        };

        // Get the existing data
        let existingData = localStorage.getItem('userData');

        // If no existing data, create an array
        // Otherwise, convert the localStorage string to an array
        existingData = existingData ? JSON.parse(existingData) : [];

        if (existingData !== null && Array.isArray(existingData)) {
            if (uid !== undefined) {
                const idx = existingData.findIndex((obj) => obj.uid == uid);
                existingData[idx] = newPerson;
            } else {
                existingData.push(newPerson);
            }
            localStorage.setItem('userData', JSON.stringify(existingData));
        } else {
            setTdMsg(`LocalStorage is corrupted.  Removing old records and storing current data.`);
            localStorage.removeItem('userData');
            localStorage.setItem('userData', JSON.stringify([newPerson]));
        }

        // Save back to localStorage

        // Clear form
        if (uid === undefined) {
            setName("");
            setBirthday("");
        }
        setTdMsg(`${name} is inserted into local memory.`);
        setTdShow(true)

        Array.from(document.getElementsByTagName("input")).forEach((t) => {
            t.value = "";
        });
    };

    const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setName("");
        setBirthday("");

    }

    const maxBirthday = formatDate(new Date(new Date().setFullYear(new Date().getFullYear() - 18)));
    const minBirthday = formatDate(new Date(new Date().setFullYear(new Date().getFullYear() - 90)));

    return <>
        {errormsg !== null && errormsg.length > 0 &&
            <Alert variant="danger">
                <div>{errormsg}</div>
            </Alert>
        }
        <Form onSubmit={handleSubmit} onReset={handleReset}>
            <Row>
                <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>名字</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" onChange={e => setName(e.target.value)} value={name === null ? "" : name}
                        isInvalid={errormsg !== null && errormsg.length > 0 && name === null} />
                    {errormsg !== null && errormsg.length > 0 && name === null &&
                        <Form.Control.Feedback type="invalid">
                            Name is required to proceed.
                        </Form.Control.Feedback>
                    }
                </Form.Group>
                <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>生日 ({age})</Form.Label>
                    <Form.Control type="date" placeholder="Enter birthday" max={maxBirthday} min={minBirthday} onChange={onDateChange} value={birthday === null ? "" : birthday}
                        isInvalid={errormsg !== null && errormsg.length > 0 && birthday === null}
                    />
                    {errormsg !== null && errormsg.length > 0 && birthday === null &&
                        <Form.Control.Feedback type="invalid">
                            Please select a birthday.
                        </Form.Control.Feedback>
                    }
                </Form.Group>
            </Row>
            <Row>
                <Form.Group as={Col} className="mt-3">
                    <Button variant="primary" size="sm" type="submit" className="me-2">
                        輸入
                    </Button>
                    <div className="vr" />
                    <Button variant="outline-primary" size="sm" type="reset">
                        取消
                    </Button>
                    {uid !== undefined &&
                        <Link className="ms-5 btn-link" to="/form">新增</Link>
                    }
                </Form.Group>
            </Row>
        </Form>
        <ToastDialog msg={tdmsg} show={tdshow} />
    </>;
};

export default Crud;