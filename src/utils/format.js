
export const formatValidationErrors = (errors) => {
    if(!errors || !errors.issues) return 'validaion failed';
    
    if(Array.isArray(errors.issues)) return errors.issues.map(issue => issue.message).join(', ');

    return JSON;
}