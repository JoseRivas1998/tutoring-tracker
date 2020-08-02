export const updateForm = (event, key, form) => {
    const updatedForm = {
        ...form
    };

    const updatedElement = {
        ...updatedForm[key]
    };

    updatedElement.value = updatedElement.filter ? updatedElement.filter(event.target.value) : event.target.value;

    updatedElement.touched = true;
    updatedElement.valid = updatedElement.validator ? updatedElement.validator(updatedElement.value) : true;

    let formValid = true;
    for (let key in updatedForm) {
        if (updatedForm.hasOwnProperty(key)) formValid = formValid && updatedForm[key].valid
    }

    updatedForm[key] = updatedElement;
    return {form: updatedForm, formValid: formValid};
}
