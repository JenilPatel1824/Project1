import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DynamicForm({ ownerId, formId }) {
    const [formDetails, setFormDetails] = useState(null);
    const [formSpecifications, setFormSpecifications] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`/getform/${ownerId}/${formId}`);
                setFormDetails(response.data.form);
                setFormSpecifications(response.data.formSpecifications);
            } catch (error) {
                console.error('Error fetching form data:', error);
            }
        }

        fetchData();
    }, [ownerId, formId]);

    const renderFormField = (fieldId, fieldData) => {
        switch (fieldData.type) {
            case 'text':
                return <input type="text" id={fieldId} name={fieldId} placeholder={fieldData.label} />;
            case 'email':
                return <input type="email" id={fieldId} name={fieldId} placeholder={fieldData.label} />;
            case 'date':
                return <input type="date" id={fieldId} name={fieldId} placeholder={fieldData.label} />;
            case 'checkbox':
                return (
                    <div>
                        {fieldData.options.map((option, index) => (
                            <div key={index}>
                                <input type="checkbox" id={`${fieldId}_${index}`} name={`${fieldId}_${index}`} value={option} />
                                <label htmlFor={`${fieldId}_${index}`}>{option}</label>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    if (!formDetails || !formSpecifications) {
        return <div>Loading...</div>;
    }

    return (
        <form>
            <h2>{formDetails.formName}</h2>
            {Object.entries(formSpecifications).map(([fieldId, fieldData]) => (
                <div key={fieldId}>
                    <label htmlFor={fieldId}>{fieldData.label}</label>
                    {renderFormField(fieldId, fieldData)}
                </div>
            ))}
            <button type="submit">Submit</button>
        </form>
    );
}

export default DynamicForm;
