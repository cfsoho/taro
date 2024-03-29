import { useParams } from 'react-router-dom';
import { Fragment, useState, useEffect } from 'react';
import TaroBadge from "components/TaroBadge";
import Accordion from 'react-bootstrap/Accordion';
import moment from 'moment';

interface UserData {
    birthday: string;
    uid: string;
    // add other properties as needed
}

const Detail = () => {
    const { uid } = useParams<{ uid: string }>();
    const [usrData, setUsrData] = useState<UserData | null>(null);
    const [yrList, setYrList] = useState<string[]>([]);

    useEffect(() => {
    }, []);
    useEffect(() => {
        const usrDataStr = localStorage.getItem("userData");
        if (usrDataStr) {
            let usrDataJSON = JSON.parse(usrDataStr);
            usrDataJSON = usrDataJSON.filter((obj: { uid: string; }) => obj.uid === uid);
            setUsrData(usrDataJSON[0]);

            let years = [];
            let currentYear = new Date().getFullYear();
            for (let year = currentYear - 1; year <= currentYear + 5; year++) {
                years.push(replaceYr(year, usrDataJSON[0].birthday));
            }
            setYrList(years)
        }
    }, [uid]);

    const replaceYr = (yr: number, usrbirthday: string) => {
        const bdArr = usrbirthday.split("-");
        bdArr[0] = yr.toString();
        return bdArr.join("-");
    }

    return usrData ? (
        <>
            <h2>{usrData.birthday}（{moment(new Date()).diff(moment(usrData.birthday), "years")}歲）</h2>
            <TaroBadge bd={usrData.birthday} />
            <Accordion className='mt-4' defaultActiveKey={[`acc_${new Date().getFullYear()}`]} alwaysOpen>
                {yrList.map((yr) => (
                    <Fragment key={`acc_${yr.slice(0, 4)}`}>
                        <Accordion.Item eventKey={`acc_${yr.slice(0, 4)}`}>
                            <Accordion.Header>{yr.slice(0, 4)}</Accordion.Header>
                            <Accordion.Body>
                                <TaroBadge bd={yr} />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Fragment>
                ))}
            </Accordion >
        </>
    ) : null;
}

export default Detail;