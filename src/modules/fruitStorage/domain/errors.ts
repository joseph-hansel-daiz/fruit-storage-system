export const FRUIT_STORAGE_ERRORS = {
    // Validation Errors
    NAME_CANNOT_BE_EMPTY: 'Fruit storage name cannot be empty.',
    DESCRIPTION_CANNOT_EXCEED_LIMIT: 'Description cannot exceed 30 characters.',
    AMOUNT_SHOULD_POSITIVE: 'Amount should be greater than zero (0)',

    // Operation Errors
    CANNOT_CREATE_EXISTING_FRUIT: 'Cannot create existing fruit storage.',
    CANNOT_CREATE: 'Cannot create fruit storage.',
    CANNOT_READ: 'Cannot find fruit storage.',
    CANNOT_UPDATE: 'Cannot update fruit storage.',
    CANNOT_DELETE: 'Cannot delete fruit storage.',
    CANNOT_DELETE_WITH_EXISTING_FRUIT: 'Cannot delete storage with fruit.',
    CANNOT_DELETE_ALL: 'Cannot delete fruit storage.',
    CANNOT_STORE: 'Cannot store fruit/s. Exceeds storage limit.',
    CANNOT_REMOVE: 'Cannot remove fruit/s. Insufficient amount of fruits in storage.'
};