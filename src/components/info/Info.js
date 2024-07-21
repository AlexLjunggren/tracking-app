import './Info.css';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function Help({ label, tip }) {

    return (
        <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={
                <Tooltip>{tip || 'Tooltip'}</Tooltip>
            }
        >
            <Form.Text className='info'>{label || 'Info (?)'}</Form.Text>
        </OverlayTrigger>
    );
}