import validator from 'validator';

class InputValidator {

  static validate = validator;
  
  static strLengthCondition (inpStr,args){
    if (inpStr.length < args[0]['min'] || inpStr.length > args[0]['max']){
        return false;
    }
    return true;
  }
  
  static isNotEmpty (inpStr){
    return !validator.isEmpty(inpStr);
  }
  
  // 8글자 이상 20글자 이하 and 특수문자 최소 1개 포함 여부를 검사한다. 
  static passwordStrengthCondition (inpStr){
    return new RegExp('^(?=.*?[#?!@$%^&*-]).{8,20}$').test(inpStr);
  }
  
  // 1차 비밀번호와 2차 비밀번호가 같은지 여부를 검사한다.
  static sameAsPassword (passwordStr,args){
    return passwordStr == args[0]['confirmationStr'];
  }
  
  // 조건에 맞는 글자만 허용하는지 여부를 검사한다.
  static letterCondition(inpStr,conditions){
    
    const matchingCharacters = {
      'hangul': '가-힣',
      'alphabet': 'A-Za-z',
      'number': '0-9'
    }
  
    let regex = '^[';
  
    conditions.forEach(type => {
      regex += matchingCharacters[type];
    });
    regex += ']+$';
  
    return new RegExp(regex).test(inpStr);
  }
} export default InputValidator;
