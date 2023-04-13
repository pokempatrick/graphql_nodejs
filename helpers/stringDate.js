exports.stringDate = (inputDate) =>
    inputDate && new Date(inputDate).toISOString();
