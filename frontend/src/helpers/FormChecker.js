// form에 입력된 값의 유효성 검사를 수행하는 helper class
class FormChecker {
  // 객체 생성시 필드명, 필드값, 유효성 조건을 저장한다. 
  constructor (fieldName,value,validationInfo){
      this.fieldName = fieldName;
      this.value = value;
      this.validationInfo = validationInfo;
  }

  // 특정 필드가 주어진 복수의 유효성 조건을 만족하는지 판단한다.
  // 판단 후 validResult 객체로 검사 결과를 반환한다.
  validate () {

      let validResult = {
          fieldName : this.fieldName,
          isCorrect : null,
          message : ''
      }

      if (this.validationInfo.length == 0)
          return validResult;

      for (var rule of this.validationInfo){

          if (!rule['method'](this.value,rule['args'])){
              
              validResult = {
                  fieldName : this.fieldName,
                  isCorrect : 'error',
                  message : rule['message']
              };

              return validResult;
          }
      }
      
      return validResult;
  }
} export default FormChecker;