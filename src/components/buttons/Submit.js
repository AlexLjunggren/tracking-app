import './Submit.css'
import { Button, InputGroup, Spinner } from 'react-bootstrap';

export default function Submit({ buttonText, processing }) {

    return (
        <InputGroup className='submit-input-group'>
            {processing ? (
                <InputGroup.Text>
                    <Spinner
                        animation="border"
                        size="sm"
                        variant="primary"
                    />
                </InputGroup.Text>
            ) : null}
            <Button type="submit" disabled={processing}>{buttonText || 'Submit'}</Button>
        </InputGroup>
    );
}