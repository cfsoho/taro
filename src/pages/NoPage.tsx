import { Alert, AlertHeading } from "react-bootstrap";

const NoPage = () => {
    return <>
        <Alert variant="danger">
            <AlertHeading>404</AlertHeading>
            <div>Page not found.</div>
        </Alert>
    </>;
};

export default NoPage;