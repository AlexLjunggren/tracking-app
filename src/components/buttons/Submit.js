import { Button, Spinner } from 'react-bootstrap';

export default function Submit({ buttonText, processingText, processing}) {

    const getButtonText = () => {
        return processing ?
                processingText || 'Processing...' :
                buttonText || 'Submit';
    }

    return (
        <Button type="submit" className="mb-3" >
            {processing ? (
                <Spinner
                    animation="border"
                    size="sm"
                    variant="light"
                />
            ) : null}
            {getButtonText()}
        </Button>
    );
}