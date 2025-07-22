import { useParams } from 'react-router-dom';
import { Fragment, useState, useEffect } from 'react';
import TaroBadge from "components/TaroBadge";
import Accordion from 'react-bootstrap/Accordion';
import moment from 'moment';
import { getAllUsers, UserData } from "../utils/userDb";

const Taro: React.FC = () => {
    const { uid } = useParams<{ uid: string }>();
    const [usrData, setUsrData] = useState<UserData | null>(null);
    const [yrList, setYrList] = useState<string[]>([]);

    useEffect(() => {
        getAllUsers().then(users => {
            const target = users.find(user => user.uid === uid);
            if (target) {
                setUsrData(target);

                const years: string[] = [];
                const currentYear = new Date().getFullYear();
                for (let year = currentYear - 1; year <= currentYear + 5; year++) {
                    years.push(replaceYr(year, target.birthDatetime));
                }
                setYrList(years);
            }
        });
    }, [uid]);

    const replaceYr = (yr: number, fullDate: string) => {
        const bdArr = fullDate.split("-");
        bdArr[0] = yr.toString();
        return bdArr.join("-");
    };

    return usrData ? (
        <>
            <h2>
                {moment(usrData.birthDatetime).format("YYYY-MM-DD HH:mm")}（
                {moment().diff(moment(usrData.birthDatetime), "years")}歲）
            </h2>
            <TaroBadge bd={usrData.birthDatetime} />
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

export default Taro;