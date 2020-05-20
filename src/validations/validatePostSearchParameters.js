// text: String, fromDate: DateTime, toDate: DateTime, ownerId: Int, fromApplicantLimit: Int, toApplicantLimit: Int
const validator = require('validator');
const { UserInputError } = require('apollo-server');

const validateText = (text, validatorErrors) => {
  if (typeof text !== 'undefined') {
    if ( validator.isEmpty(text, { ignore_whitespace: true })) {
      validatorErrors.text = 'Invalid text, can\'t be an empty string'
    }
  }
}

const validateDates = (fromDate, toDate, validatorErrors) => {
  
  if( fromDate ) {
    if( !(validator.isISO8601(fromDate, {strict: true})) ) {
      validatorErrors.fromDate = 'Invalid date: check format and dates that doesn\'t exist'
    }
  }
 
  if ( toDate ) {
    if( !(validator.isISO8601(toDate, {strict: true})) ) {
      validatorErrors.toDate = 'Invalid date: check format and dates that doesn\'t exist'
    }
  }
  
  if (!validatorErrors.fromDate && !validatorErrors.toDate && fromDate && toDate) {
    if(!(validator.isBefore(fromDate, toDate)) && !(fromDate === toDate)) {
      validatorErrors.fromDate = 'Invalid date: fromDate can\'t be after toDate'
      validatorErrors.toDate = 'Invalid date: toDate can\'t be before fromDate'
    }
  }

}

// ownerId doesn't need to be validated.

const validateApplicantLimits = (fromApplicantLimit, toApplicantLimit, validatorErrors) => {
  if (fromApplicantLimit && toApplicantLimit) {
    if (fromApplicantLimit > toApplicantLimit) {
      validatorErrors.fromApplicantLimit = 'fromApplicantLimit can\'t be greater than toApplicantLimit'
      validatorErrors.toApplicantLimit = 'toApplicantLimit can\'t be lower than fromApplicantLimit'
    }
  }
  
}

const validatePostSearchParameters = params => {
  const validatorErrors = {}

  validateText(params.text, validatorErrors)
  validateDates(params.fromDate, params.toDate, validatorErrors)
  validateApplicantLimits(params.fromApplicantLimit, params.toApplicantLimit, validatorErrors)

  if ((Object.keys(validatorErrors)).length) {
    throw new UserInputError(
      'Failed to fetch data due to validation errors',
      { validatorErrors }
    ); 
  }
}

module.exports = { validatePostSearchParameters }