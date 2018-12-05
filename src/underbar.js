(function() {
  'use strict';

  window._ = {};

  // 인자 그대로 반환
  _.identity = function(val) {
    return val
  };

  /**
   * COLLECTIONS
   * ===========
   *
   * In this section, we'll have a look at functions that operate on collections
   * of values; in JavaScript, a 'collection' is something that can contain a
   * number of values--either an array or an object.
   *
   *
   * IMPORTANT NOTE!
   * ===========
   *
   * The .first function is implemented for you, to help guide you toward success
   * in your work on the following functions. Whenever you see a portion of the
   * assignment pre-completed, be sure to read and understand it fully before
   * you proceed. Skipping this step will lead to considerably more difficulty
   * implementing the sections you are responsible for.
   */

  // 인자가 1개면 array의 첫번째 인자, 아니면 첫번째 인자부터 n번째 요소 전까지의 배열 반환
  _.first = function(array, n) {
    return n === undefined ? array[0] : array.slice(0, n);
  };

  // 인자가 1개면 array의 마지막 인자, 아니면 n = 0일 때 빈 배열, 그 외에 뒤에서 n번째까지의 배열 반환
  _.last = function(array, n) {
    return n === undefined ? array.pop() : (n === 0 ? [] : array.slice(-n))
  };

  // collection이 배열인지 객체인지에 따라, collection.forEach((element, index, array) => ...) 를 실행하도록 유도
  _.each = function(collection, iterator) {
    if (Array.isArray(collection)) {
      for (let i = 0; i < collection.length; i++) {
        iterator(collection[i], i, collection)
      }
    } else if (collection instanceof Object && collection.constructor === Object) {
      for (let key in collection) {
        iterator(collection[key], key, collection)
      }
    }
  };

  // 처음부터 결과값을 -1로 정해놓고, array의 값 중에 target과 맞는 값이 있다면 해당 값의 인덱스를 결과에 저장한다
  _.indexOf = function(array, target) {
    var result = -1;

    _.each(array, (item, index) => {
      if (item === target && result === -1) {
        result = index;
      }
    });

    return result;
  };

  // test를 통과하는 collection의 element들만 result에 담아 내보낸다
  _.filter = function(collection, test) {
    let result = []

    _.each(collection, element => {
      if (test(element)) {
        result.push(element)
      }
    })

    return result
  };

  // test를 통과하지 못하는 collection의 element들만 result에 담아 내보낸다
  _.reject = function(collection, test) {
    let result = []

    _.filter(collection, element => {
      if (!test(element)) {
        result.push(element)
      }
    })

    return result
  };

  // 자동으로 중복을 제거한 배열을 반환
  _.uniq = function(array) {
    return [...new Set(array)]
  };

  // 각각의 element에 대해 iterator를 실행한 결과를 result에 넣어 내보낸다
  _.map = function(collection, iterator) {
    let result = []

    _.each(collection, element => {
      result.push(iterator(element))
    })

    return result
  };

  _.pluck = function(collection, key) {
    return _.map(collection, function(item) {
      return item[key];
    });
  };

  // 초기값이 있으면 초기값부터, 없으면 바로 accumulator를 iterator를 실행한 결과값으로 넣으며 순환시킨뒤 accumulator를 반환
  _.reduce = function(collection, iterator, accumulator) {
    let isLength2 = arguments.length <= 2

    _.each(collection, currentValue => {
      if (isLength2) {
        accumulator = currentValue
        isLength2 = false
      } else {
        accumulator = iterator(accumulator, currentValue)
      }
    })

    return accumulator
  };

  _.contains = function(collection, target) {
    return _.reduce(collection, function(wasFound, item) {
      if (wasFound) {
        return true;
      }
      return item === target;
    }, false);
  };

  // iterator가 없으면 collection이 전부 true를 포함하는지 체크한 결과를 반환한다
  _.every = function(collection, iterator) {
    if (!iterator) return !collection.includes(false)

    return _.reduce(collection, (accumulator, currentValue) => {
      if (!accumulator) return false // 처음부터 false면 false 반환
      else if (iterator(currentValue)) accumulator = true // 다음 currentValue가 true면 true
      else accumulator = false // 다음 current가 false면 false

      return accumulator // false가 반환되면 첫 if문에서 false가 반환되고, 아니라면 계속해서 요소를 순환하며 테스트를 하게 된다
    }, true)
  };

  _.some = function(collection, iterator) {
    if (!iterator) return collection.includes(true) // iteratior가 없을 시 collection이 하나라도 true를 포함하는 지

    return !_.every(collection, item => !iterator(item))
    // iteratior를 하나라도 false하는 게 있다면 false를 출력하게 되는데, 앞에 !를 붙임으로써 그 결과를 다시 뒤집는다
  };


  /**
   * OBJECTS
   * =======
   *
   * In this section, we'll look at a couple of helpers for merging objects.
   */

  // 모든 인자들을 reduce로 초깃값에 전부 assign으로 담은 결과값을 반환한다
  _.extend = function(obj) {
    return _.reduce([...arguments], (accumulator, currentValue) => {
      return Object.assign(accumulator, currentValue)
    }, obj)
  };

  // 
  _.defaults = function(obj) {
    _.each([...arguments].slice(1), item => {
      _.each(item, (value, key) => {
        if(obj[key] === undefined) obj[key] = value // 인자 객체의 key가 obj에 없을시(undefined)에만 값을 추가
      });
    });

    return obj;
  };


  /**
   * FUNCTIONS
   * =========
   *
   * Now we're getting into function decorators, which take in any function
   * and return out a new version of the function that works somewhat differently
   */

  _.once = function(func) {
    var alreadyCalled = false;
    var result;
    return function() {
      if (!alreadyCalled) {
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      return result;
    };
  };

  // 함수를 기억함
  _.memoize = function(func) {
    const storedFunc = function() { // this가 storedFunc를 가리켜야 하기 때문에 arrow function을 쓰면 안됨
      const cache = storedFunc.cache;
      const key = JSON.stringify(arguments);
      if (!cache[key]) {
        cache[key] = func.apply(this, arguments);
      }
      return cache[key];
    };
    storedFunc.cache = {};
    return storedFunc;
  };

  // 인자가 2개 이하면 그냥 setTimeout을,
  // 2개 이상이면 모두 func에 전개하여 담아 실행한다
  _.delay = function(func, wait) {
    arguments.length <= 2 
      ? setTimeout(func, wait) 
      : setTimeout(func(...[...arguments].slice(2)), wait)
  };


  /**
   * ADVANCED COLLECTION OPERATIONS
   * ==============================
   */

  // array에서 요소 하나를 뽑아 result에 넣고, 뽑은 요소가 중복되면 건너뛰고 길이가 같아지면 result를 내보낸다
  _.shuffle = function(array) {
    let result = []
    let temp
    while (array.length !== result.length) {
      if(temp && !result.includes(temp)) {
        result.push(temp)
      }
      temp = array[Math.floor(Math.random() * array.length)]
    }
    return result
  };


  /**
   * ADVANCED
   * =================
   *
   * Note: This is the end of the pre-course curriculum. Feel free to continue,
   * but nothing beyond here is required.
   */

  // 두 번째 인자가 string이면 object['key']를 이용, function이면 바로 apply 적용
  _.invoke = function(collection, functionOrKey, args) {
    let result = []
    if (typeof functionOrKey === 'string') {
      _.each(collection, item => {
        result.push(item[functionOrKey].apply(item))
      })
    }
    if (typeof functionOrKey === 'function') {
      _.each(collection, item => {
        result.push(functionOrKey.apply(item))
      })
    }
    return result
  };

  // iterator가 string으로 들어왔다면, 그 상태로는 메소드를 실행할 수 없으니 다시 함수로 만든다
  // 주어진 iterator에 따라 collection을 정렬한 값을 반환한다
  _.sortBy = function(collection, iterator) {
    if (typeof iterator === "string") {
      const method = iterator
      iterator = object => object[method]
    }

    return collection.sort((a, b) => {
      return iterator(a) - iterator(b)
    })
  };

  // 같은 인덱스에 위치한 값들만의 배열을 차례대로 담은 배열 반환
  _.zip = function() {
    let result = []

    for (let i in arguments) {
      const tempArr = []
      for (let j in arguments) {
        tempArr.push(arguments[j][i])
      }
      result[i] = tempArr
    }

    return result
  };

  // nestedArray의 요소중 배열이 하나라도 있을 경우 flat() 적용
  _.flatten = function(nestedArray, result) {
    while (_.some(nestedArray, item => Array.isArray(item))) {
      nestedArray = nestedArray.flat()
    }
    return nestedArray
  };

  // 두 배열의 중복되는 요소만을 새 배열에 담아 반환
  _.intersection = function() {
    let uniqueArr = []
    let args = [...arguments]

    for (let i in args[0]) {
      for (let j in args[0]) {
        if (args[0][i] === args[1][j]) uniqueArr.push(args[0][i])
      }
    }

    return uniqueArr
  };

  // array를 제외한 인자의 요소들 중에 array 요소와 일치하는 게 있다면 array의 요소를 삭제하고 array를 반환
  _.difference = function(array) {
    let temp
    let subArr = [...arguments].slice(1)

    for (let i in subArr) {
      for (let j in subArr[i]) {
        temp = array.findIndex(x => x === subArr[i][j])
        if (temp !== -1) array.splice(temp, 1)
      }
    }

    return array
  };

  // func가 wait보다 더 짧은 주기로 반복 호출될 경우가 있다
  // throttle은 함수가 호출될 때 함수를 무조건 최소 wait의 주기로 실행하게 한다 
  _.throttle = function(func, wait) {
    let call = true;

    return () => {
      if (call) {
        call = false;
        setTimeout(() => {
          func.apply(arguments);
          call = true
        }, wait);
      }
    };
  };
}());
