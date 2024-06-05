import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


function DynamicForm() {

    const { owner_id, formId } = useParams();
    const [formDetails, setFormDetails] = useState(null);
    const [formSpecifications, setFormSpecifications] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`http://localhost:3000/getform/${owner_id}/${formId}`);
                setFormDetails(response.data.form);
                setFormSpecifications(response.data.formSpecifications);
            } catch (error) {
                console.error('Error fetching form data:', error);
            }
        }

        fetchData();
    }, [owner_id, formId]);

    if (!formDetails || !formSpecifications) {
        return <div>Loading...</div>;
    }

    const renderField = (specification, index) => {
        const specType = specification.type?.S || specification.type;
        const specName = specification.name?.S || specification.name;
        const options = specification.options?.L || specification.options;

        switch (specType) {
            case 'textField':
                return (
                    <div key={index}>
                        <label>{specName}:</label>
                        <input type="text" name={specName} />
                    </div>
                );
            case 'radioButton':
                return (
                    <div key={index}>
                        <label>{specName}:</label>
                        {Array.isArray(options) && options.map((option, optionIndex) => {
                            const optionValue = option.S || option;
                            return (
                                <div key={optionIndex}>
                                    <input type="radio" id={optionValue} name={specName} value={optionValue} />
                                    <label htmlFor={optionValue}>{optionValue}</label>
                                </div>
                            );
                        })}
                    </div>
                );
            case 'checkbox':
                return (
                    <div key={index}>
                        <label>{specName}:</label>
                        {Array.isArray(options) && options.map((option, optionIndex) => {
                            const optionValue = option.S || option;
                            return (
                                <div key={optionIndex}>
                                    <input type="checkbox" id={optionValue} name={specName} value={optionValue} />
                                    <label htmlFor={optionValue}>{optionValue}</label>
                                </div>
                            );
                        })}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <h2>{formDetails.formName?.S || formDetails.formName}</h2>
            <h2>{formDetails.formType?.S || formDetails.formType}</h2>
            EndDate:<h2>{formDetails.formEndDate?.S || formDetails.formEndDate}</h2>


            <form>
                {Array.isArray(formSpecifications) && formSpecifications.map((specification, index) => renderField(specification.M || specification, index))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default DynamicForm;
