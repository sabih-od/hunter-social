import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class StringsService {
  constructor() {}

  getOnlyDigits(phoneNumber) {
    var numberString = phoneNumber;
    var numberInDigits = numberString.replace(/[^\d]/g, '');
    var numberVal = parseInt(numberInDigits);
    console.log(numberVal);
    return numberVal.toString();
  }

  isPhoneNumberValid(number) {
    var _validPhoneNumber = this.getOnlyDigits(number);
    // remove trailing zeros
    let s = _validPhoneNumber.toString();
    return _validPhoneNumber.toString().length < 10 ? false : true;
  }

  capitalizeEachFirst(str: string) {
    if (!str) return '';
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
  }

  checkIfMatchingPasswords(
    passwordKey: string,
    passwordConfirmationKey: string
  ) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  parseAddressFromProfile(__profile) {
    return `${__profile['apartment'] || ''} ${
      __profile['street_address'] || ''
    } ${__profile['city'] || ''} ${__profile['state'] || ''} ${
      __profile['zip_code'] || ''
    }`;
  }

  parseName(input) {
    const capitalize = (s) => {
      if (typeof s !== 'string') return '';
      s = s.toLowerCase();
      return s.charAt(0).toUpperCase() + s.slice(1);
    };

    var fullName = input || '';
    var result = {};

    if (fullName.length > 0) {
      var nameTokens = fullName.match(/\w*/g) || [];
      nameTokens = nameTokens.filter((n) => n);

      if (nameTokens.length > 3) {
        result['firstName'] = nameTokens.slice(0, 2).join(' ');
        result['firstName'] = capitalize(result['firstName']);
      } else {
        result['firstName'] = nameTokens.slice(0, 1).join(' ');
        result['firstName'] = capitalize(result['firstName']);
      }

      if (nameTokens.length > 2) {
        result['middleName'] = nameTokens.slice(-2, -1).join(' ');
        result['lastName'] = nameTokens.slice(-1).join(' ');
        result['middleName'] = capitalize(result['middleName']);
        result['lastName'] = capitalize(result['lastName']);
      } else {
        if (nameTokens.length == 1) {
          result['lastName'] = '';
          result['middleName'] = '';
        } else {
          result['lastName'] = nameTokens.slice(-1).join(' ');
          result['lastName'] = capitalize(result['lastName']);
          result['middleName'] = '';
        }
      }
    }

    var display_name =
      result['lastName'] +
      (result['lastName'] ? ' ' : '') +
      result['firstName'];
    return display_name;
  }

  isLastNameExist(input) {
    var fullname = this.parseName(input);
    return !(fullname['lastName'] == '');
  }

  formatPhoneNumberRuntime(phoneNumber, last = false) {
    if (phoneNumber == null || phoneNumber == '') {
      return phoneNumber;
    }

    phoneNumber = this.getOnlyDigits(phoneNumber);
    // phoneNumber = phoneNumber.substring(phoneNumber.length - 1,-11);//keep only 10 digit Number
    // phoneNumber = phoneNumber.substring(phoneNumber.length - 10, -11);//keep only 10 digit Number
    phoneNumber = last
      ? phoneNumber.substring(phoneNumber.length - 10, phoneNumber.length)
      : phoneNumber.substring(0, 10);

    const cleaned = ('' + phoneNumber).replace(/\D/g, '');

    function numDigits(x: number) {
      return (Math.log(x) * Math.LOG10E + 1) | 0;
    }

    // only keep number and +
    const p1 = cleaned.match(/\d+/g);
    if (p1 == null) {
      return cleaned;
    }
    const p2 = phoneNumber.match(/\d+/g).map(Number);
    const len = numDigits(p2);
    // document.write(len + " " );
    switch (len) {
      case 1:
      case 2:
        return '(' + phoneNumber;
      case 3:
        return '(' + phoneNumber + ')';
      case 4:
      case 5:
      case 6:
        var f1 = '(' + phoneNumber.toString().substring(0, 3) + ')';
        var f2 = phoneNumber.toString().substring(len, 3);
        return f1 + ' ' + f2;
      default:
        f1 = '(' + phoneNumber.toString().substring(0, 3) + ')';
        f2 = phoneNumber.toString().substring(3, 6);
        var f3 = phoneNumber.toString().substring(6, 10);

        console.log(phoneNumber, f3);
        return f1 + ' ' + f2 + '-' + f3;
    }

    // return "len";
  }
}
