import { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import moment from 'moment';


type ToastPosition = 'top-start' | 'top-center' | 'top-end' | 'middle-start' | 'middle-center' | 'middle-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';

interface Props {
    msg: string;
    pos?: ToastPosition;
    show?: boolean;
}

const ToastDialog: React.FC<Props> = ({ msg, pos = "bottom-end", show = false }) => {
    const [initTime, setInitTime] = useState<Date | null>(null)
    const [dispTime, setDispTime] = useState<number>(0)
    const [disp, setDisp] = useState<boolean>(show)
    const toggleShow = () => setDisp(!disp);

    useEffect(() => {
        setDisp(show);
    }, [show])
    useEffect(() => {
        if (disp === false) {
            return;
        }
        setInitTime(new Date())
    }, [disp])


    setInterval(() => {
        if (show === false) {
            return;
        }
        const date1 = moment(initTime);
        const date2 = moment();
        const diffInMinutes = date2.diff(date1, 'minutes');
        setDispTime(diffInMinutes)
    }, 1000)




    return (
        <ToastContainer
            className="p-3"
            position={pos}
            style={{ zIndex: 1 }}>
            <Toast onClose={toggleShow} show={disp}>
                <Toast.Header>
                    <strong className="me-auto">Taro {new Date().getFullYear()}&trade;</strong>
                    <small>{dispTime} mins ago</small>
                </Toast.Header>
                <Toast.Body>{msg}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default ToastDialog;