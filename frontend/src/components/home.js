import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../styles/model.css';


const Home = () => {
    const [formName, setFormName] = useState('');
    const [formType, setFormType] = useState('');
    const [endDate, setEndDate] = useState('');
    const [specifications, setSpecifications] = useState([]);
    const [formLink, setFormLink] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleAddSpecification = (specificationType) => {
        switch (specificationType) {
            case 'textField':
                setSpecifications([...specifications, { type: 'textField', name: '' }]);
                break;
            case 'radioButton':
                setSpecifications([...specifications, { type: 'radioButton', name: '', options: [] }]);
                break;
            case 'checkbox':
                setSpecifications([...specifications, { type: 'checkbox', name: '', options: [] }]);
                break;
            default:
                break;
        }
    };

    const handleSpecificationNameChange = (index, name) => {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const owner_id = decodedToken.owner_id;
        console.log(owner_id);

        const updatedSpecifications = [...specifications];
        updatedSpecifications[index].name = name;
        setSpecifications(updatedSpecifications);
    };

    const handleOptionChange = (specIndex, optionIndex, optionValue) => {
        const updatedSpecifications = [...specifications];
        updatedSpecifications[specIndex].options[optionIndex] = optionValue;
        setSpecifications(updatedSpecifications);
    };

    const handleAddOption = (specIndex) => {
        const updatedSpecifications = [...specifications];
        updatedSpecifications[specIndex].options.push('');
        setSpecifications(updatedSpecifications);
    };

    const handleCreateForm = async () => {
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const owner_id = decodedToken.owner_id;
            const response = await axios.post('http://localhost:3000/create-form', {
                ownerId:owner_id,
                formName,
                formType,
                formEndDate:endDate,
                specifications
            });
            const formId = response.data.formId; 
            const formLink = `http://localhost:3001/getForm/${owner_id}/${formId}`;
            setFormLink(formLink);
            setShowModal(true);
            alert('Form created successfully!');        } catch (error) {
            console.error('Error creating form:', error);
            alert('Error creating form');
        }
    };

    return (
        <div>
            <h2>Create Form</h2>
            <form>
                <div>
                    <label>Form Name:</label>
                    <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required />
                </div>
                <div>
                    <label>Form Type:</label>
                    <input type="text" value={formType} onChange={(e) => setFormType(e.target.value)} required />
                </div>
                <div>
                    <label>End Date:</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                </div>
                <div>
                    <label>Specifications:</label>
                    <button onClick={() => handleAddSpecification('textField')}>Add TextField</button>
                    <button onClick={() => handleAddSpecification('radioButton')}>Add RadioButton</button>
                    <button onClick={() => handleAddSpecification('checkbox')}>Add Checkbox</button>
                    {specifications.map((specification, index) => (
                        <div key={index}>
                            {specification.type === 'textField' && (
                                <input type="text" value={specification.name} onChange={(e) => handleSpecificationNameChange(index, e.target.value)} required />
                            )}
                            {specification.type === 'radioButton' && (
                                <>
                                    <label>RadioButton:</label>
                                    <input type="text" value={specification.name} onChange={(e) => handleSpecificationNameChange(index, e.target.value)} required />
                                    {specification.options.map((option, optionIndex) => (
                                        <div key={optionIndex}>
                                            <input type="text" value={option} onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)} />
                                        </div>
                                    ))}
    <button type="button" onClick={() => handleAddOption(index)}>Add Option</button>
                                    </>
                            )}
                            {specification.type === 'checkbox' && (
                                <>
                                    <label>Checkbox:</label>
                                    <input type="text" value={specification.name} onChange={(e) => handleSpecificationNameChange(index, e.target.value)} required />
                                    {specification.options.map((option, optionIndex) => (
                                        <div key={optionIndex}>
                                            <input type="text" value={option} onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)} />
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => handleAddOption(index)}>Add Option</button>

                                </>
                            )}
                        </div>
                    ))}
                </div>
                <button type="button" onClick={handleCreateForm}>Create Form</button>
            </form>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <p>Form created successfully! Share this link:</p>
                        <a href={formLink}>{formLink}</a>
                    </div>
                </div>
            )}


        </div>
    );
};

export default Home;
