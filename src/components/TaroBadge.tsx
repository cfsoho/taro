import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { calBirthDay } from "utils/CalBirthday";

interface prop {
    bd: string;
}

const TaroBadge: React.FC<prop> = ({ bd }) => {
    const [numArr, setNumArr] = useState<any[]>([])
    useEffect(() => {
        const taroData = calBirthDay(bd);
        setNumArr(taroData)
    }, [])

    const phVariant = (ph: number) => {
        switch (ph) {
            case 1:
                return "danger";
            case -1:
                return "dark";
            default:
                return "warning";
        }
    }
    return (
        <>
            {numArr.map(({ name_zh, desc, ph }, index) => (
                <div key={index}>
                    <Badge bg={phVariant(ph)} className="me-1">{name_zh}</Badge>
                    <span>{desc}</span>
                </div>
            ))}
        </>
    );
};

export default TaroBadge;